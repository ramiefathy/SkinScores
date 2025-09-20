import * as React from 'react';
import { Chip, Stack } from '@mui/material';

function getFavs(){
  try { return JSON.parse(localStorage.getItem('fav-tools') || '[]'); } catch { return []; }
}

export default function QuickBar(){
  const [ids, setIds] = React.useState<string[]>(getFavs());
  React.useEffect(()=>{
    const i = setInterval(()=> setIds(getFavs()), 1500);
    return ()=> clearInterval(i);
  },[]);
  if (!ids.length) return null;
  return (
    <Stack direction="row" spacing={1} sx={{mb:2}}>
      {ids.map(id => <Chip key={id} label={id.toUpperCase()} onClick={()=>location.assign(`/calculators/${id}`)} />)}
    </Stack>
  );
}
