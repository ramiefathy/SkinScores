export function toCSV(rows: Record<string, any>[], delimiter= ','){
  if (!rows.length) return '';
  const keys = Array.from(new Set(rows.flatMap(r => Object.keys(r))));
  const esc = (s:any) => {
    const v = String(s ?? '');
    return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
  };
  const head = keys.join(delimiter);
  const body = rows.map(r => keys.map(k => esc(r[k])).join(delimiter)).join('\n');
  return head + '\n' + body + '\n';
}
