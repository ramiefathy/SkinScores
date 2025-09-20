export type SmartLaunchConfig = {
  clientId: string;
  redirectUri: string;
  defaultIss?: string;
  scope?: string;
  storage?: Storage;
  pkce?: boolean;
};

export type SmartToken = {
  access_token: string;
  token_type: string;
  expires_in?: number;
  scope?: string;
  patient?: string;
  id_token?: string;
  refresh_token?: string;
  iss: string;
};

const b64u = (buf: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

async function sha256(str: string) {
  const enc = new TextEncoder();
  const data = enc.encode(str);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return b64u(hash);
}

async function discover(iss: string) {
  const smartUrl = iss.replace(/\/$/, '') + '/.well-known/smart-configuration';
  const r = await fetch(smartUrl, { headers: { 'Accept': 'application/json' } });
  if (r.ok) return r.json();
  const metaUrl = iss.replace(/\/$/, '') + '/metadata';
  const m = await fetch(metaUrl, { headers: { 'Accept': 'application/fhir+json' } }).then(r => r.json());
  const ext = (m.rest?.[0]?.security?.extension || []).find((e: any) => e.url && e.url.includes('oauth-uris'));
  const auth = ext?.extension?.find((x: any) => x.url === 'authorize')?.valueUri;
  const token = ext?.extension?.find((x: any) => x.url === 'token')?.valueUri;
  return { authorization_endpoint: auth, token_endpoint: token };
}

export async function beginLaunch(cfg: SmartLaunchConfig, search = new URLSearchParams(location.search)) {
  const iss = search.get('iss') || cfg.defaultIss;
  const launch = search.get('launch') || undefined;
  if (!iss) throw new Error('Missing issuer (iss)');
  const disc = await discover(iss);
  const state = crypto.randomUUID();
  const storage = cfg.storage || sessionStorage;
  const scope = cfg.scope || 'launch/patient patient/*.read patient/*.write openid fhirUser online_access';

  let code_verifier: string | undefined;
  let code_challenge: string | undefined;
  if (cfg.pkce !== false) {
    code_verifier = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))));
    code_challenge = await sha256(code_verifier);
  }

  storage.setItem('smart_tmp', JSON.stringify({ iss, state, code_verifier, redirectUri: cfg.redirectUri, clientId: cfg.clientId, scope }));

  const qp = new URLSearchParams({
    response_type: 'code',
    client_id: cfg.clientId,
    redirect_uri: cfg.redirectUri,
    scope,
    state,
    aud: iss
  });
  if (launch) qp.set('launch', launch);
  if (code_challenge) { qp.set('code_challenge', code_challenge); qp.set('code_challenge_method', 'S256'); }

  location.assign(`${disc.authorization_endpoint}?${qp.toString()}`);
}

export async function completeLaunch(storage: Storage = sessionStorage): Promise<SmartToken> {
  const tmp = JSON.parse(storage.getItem('smart_tmp') || '{}');
  const params = new URLSearchParams(location.search);
  const code = params.get('code');
  const state = params.get('state');
  if (!code || !state || state !== tmp.state) throw new Error('State mismatch or missing code');

  const disc = await discover(tmp.iss);
  const body: any = {
    grant_type: 'authorization_code',
    code,
    redirect_uri: tmp.redirectUri,
    client_id: tmp.clientId
  };
  if (tmp.code_verifier) body.code_verifier = tmp.code_verifier;

  const tokenResp = await fetch(disc.token_endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(body).toString()
  });
  if (!tokenResp.ok) throw new Error('Token exchange failed');
  const token = await tokenResp.json();
  const full: SmartToken = { ...token, iss: tmp.iss };
  storage.setItem('smart_token', JSON.stringify(full));
  return full;
}

export async function smartFetch(resourcePath: string, storage: Storage = sessionStorage) {
  const tok: SmartToken | null = JSON.parse(storage.getItem('smart_token') || 'null');
  if (!tok) throw new Error('No SMART token in storage');
  const url = tok.iss.replace(/\/$/, '') + '/' + resourcePath.replace(/^\//, '');
  const r = await fetch(url, { headers: { 'Authorization': `Bearer ${tok.access_token}` } });
  if (!r.ok) throw new Error(`SMART fetch failed (${r.status})`);
  return r.json();
}


export async function smartRequest(resourcePath: string, init: RequestInit = {}, storage: Storage = sessionStorage) {
  const tok: SmartToken | null = JSON.parse(storage.getItem('smart_token') || 'null');
  if (!tok) throw new Error('No SMART token in storage');
  const url = tok.iss.replace(/\/$/, '') + '/' + resourcePath.replace(/^\//, '');
  const r = await fetch(url, { ...init, headers: { ...(init.headers||{}), 'Authorization': `Bearer ${tok.access_token}`, 'Content-Type': (init as any).body ? 'application/fhir+json' : (init.headers as any)?.['Content-Type'] || 'application/json' } });
  if (!r.ok) throw new Error(`SMART request failed (${r.status})`);
  return r.json();
}
