export async function toggleFavorite(uid:string, toolId:string, db?: any){
  try{
    if (!db) {
      const key = 'fav-tools'; const set = new Set(JSON.parse(localStorage.getItem(key)||'[]'));
      if (set.has(toolId)) set.delete(toolId); else set.add(toolId);
      localStorage.setItem(key, JSON.stringify([...set])); return;
    }
    const ref = (await import('firebase/firestore')).doc(db, `users/${uid}/favorites/${toolId}`);
    const { deleteDoc, setDoc, getDoc } = await import('firebase/firestore');
    const snap = await getDoc(ref);
    if (snap.exists()) await deleteDoc(ref); else await setDoc(ref, { addedAt: Date.now() });
  }catch(e){ console.error(e); }
}
