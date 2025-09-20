import * as React from 'react';
import { Dialog, DialogTitle, TextField, List, ListItem, ListItemButton } from '@mui/material';

type Cmd = { label: string; run: () => void };

const CMDS: Cmd[] = [
  { label: 'Search tools', run: () => location.assign('/library') },
  { label: 'Open SJS/TEN bundle', run: () => location.assign('/bundles/sjs-ten') },
  { label: 'Open AD bundle', run: () => location.assign('/bundles/ad') },
  { label: 'Open EB bundle', run: () => location.assign('/bundles/eb') },
  { label: 'Patients', run: () => location.assign('/patients') }
];

export default function CommandPalette(){
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState('');
  React.useEffect(()=>{
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen(o=>!o); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  },[]);
  const filtered = CMDS.filter(c => c.label.toLowerCase().includes(q.toLowerCase()));
  return (
    <Dialog open={open} onClose={()=>setOpen(false)} fullWidth maxWidth="sm">
      <DialogTitle>Command palette</DialogTitle>
      <TextField autoFocus placeholder="Type a command…" value={q} onChange={e=>setQ(e.target.value)} sx={{mx:2}} />
      <List>
        {filtered.map((c,i)=>(
          <ListItem key={i} disablePadding>
            <ListItemButton onClick={()=>{ setOpen(false); c.run(); }}>{c.label}</ListItemButton>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}
