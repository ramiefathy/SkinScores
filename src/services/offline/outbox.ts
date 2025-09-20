type Item = { id:string; url:string; method:string; body:any; headers?:Record<string,string> };
const KEY = 'skinscores-outbox';

export function enqueue(item: Item){
  const q: Item[] = JSON.parse(localStorage.getItem(KEY) || '[]');
  q.push(item); localStorage.setItem(KEY, JSON.stringify(q));
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    navigator.serviceWorker.ready.then(r => (r as any).sync.register('sync-outbox')).catch(()=>{});
  }
}

export async function flush(){
  const q: Item[] = JSON.parse(localStorage.getItem(KEY) || '[]');
  const remain: Item[] = [];
  for (const it of q) {
    try {
      await fetch(it.url, { method: it.method, headers: {'Content-Type':'application/json', ...(it.headers||{})}, body: JSON.stringify(it.body) });
    } catch(e) { remain.push(it); }
  }
  localStorage.setItem(KEY, JSON.stringify(remain));
}
(window as any).flushOutbox = flush;
