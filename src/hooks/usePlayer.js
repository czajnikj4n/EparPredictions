import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { auth } from '../firebase';

export function usePlayer() {
  const [uid, setUid] = useState(null);
  const [playerName, setPlayerNameState] = useState(
    () => localStorage.getItem('predictor_name') || ''
  );

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) setUid(user.uid);
      else signInAnonymously(auth).catch((err) => console.error(err));
    });
    return unsub;
  }, []);

  function setPlayerName(name) {
    localStorage.setItem('predictor_name', name);
    setPlayerNameState(name);
  }

  return { uid, playerName, setPlayerName };
}