import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

export function useCollection(path, orderByField) {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = orderByField
      ? query(collection(db, path), orderBy(orderByField))
      : collection(db, path);
    const unsub = onSnapshot(ref, (snap) => {
      setDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, [path, orderByField]);

  return { docs, loading };
}