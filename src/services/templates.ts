export type Template = { id:string; name:string; toolIds:string[] };

export async function saveTemplate(uid:string, t: Template, db?: any){
  try{
    if (!db) {
      const key='session-templates'; const arr:Template[] = JSON.parse(localStorage.getItem(key)||'[]');
      localStorage.setItem(key, JSON.stringify(arr.filter(x=>x.id!==t.id).concat([t]))); return;
    }
    const { doc, setDoc } = await import('firebase/firestore');
    await setDoc(doc(db, `users/${uid}/templates/${t.id}`), { ...t, updatedAt: Date.now() });
  }catch(e){ console.error(e); }
}
