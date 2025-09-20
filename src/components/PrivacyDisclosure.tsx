import * as React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

export default function PrivacyDisclosure(){
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button size="small" onClick={()=>setOpen(true)}>What does “Local‑only” mean?</Button>
      <Dialog open={open} onClose={()=>setOpen(false)}>
        <DialogTitle>Local‑only mode</DialogTitle>
        <DialogContent>
          <ul>
            <li>No data leave your browser; results compute locally.</li>
            <li>Exports (CSV/FHIR) are generated client‑side; “Save to EHR” requires SMART login.</li>
            <li>Close the browser → unsaved data may be lost; export first.</li>
          </ul>
        </DialogContent>
        <DialogActions><Button onClick={()=>setOpen(false)}>Close</Button></DialogActions>
      </Dialog>
    </>
  );
}
