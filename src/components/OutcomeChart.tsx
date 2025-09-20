import * as React from 'react';
let Real: any;
try { Real = require('@mui/x-charts').LineChart; } catch {}
export default function OutcomeChart({ data, label }:{ data:{ date:string, value:number }[]; label?:string }){
  if (Real) {
    const LineChart = Real;
    return <LineChart xAxis={[{ data: data.map(d=>d.date) }]} series={[{ data: data.map(d=>d.value), label: label||'Score' }]} />;
  }
  const w=480,h=160,p=28; const max=Math.max(...data.map(d=>d.value),1);
  const path = data.map((d,i)=>{
    const x=p + (i/(data.length-1))*(w-2*p);
    const y=h-p - (d.value/max)*(h-2*p);
    return `${i?'L':'M'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');
  return <svg width={w} height={h}><path d={path} fill="none" stroke="currentColor" strokeWidth="2"/></svg>;
}
