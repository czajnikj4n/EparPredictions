import { useEffect, useState } from 'react';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { hasKickedOff, pointsFor } from '../utils/scoring';

export default function FixtureCard({ match, uid, playerName }) {
  const [myPrediction, setMyPrediction] = useState(null);
  const [poland, setPoland] = useState('');
  const [opponent, setOpponent] = useState('');
  const [saving, setSaving] = useState(false);
  const locked = hasKickedOff(match);

  useEffect(() => {
    if (!uid) return;
    getDoc(doc(db, 'predictions', `${match.id}_${uid}`)).then((snap) => {
      if (snap.exists()) setMyPrediction(snap.data());
    });
  }, [match.id, uid]);

  async function submit(e) {
    e.preventDefault();
    if (poland === '' || opponent === '') return;
    setSaving(true);
    const data = {
      matchId: match.id,
      uid,
      playerName,
      polandScore: Number(poland),
      opponentScore: Number(opponent),
      createdAt: serverTimestamp(),
    };
    try {
      await setDoc(doc(db, 'predictions', `${match.id}_${uid}`), data);
      setMyPrediction(data);
    } catch (err) {
      console.error(err);
      alert('Could not save — the match may have already started.');
    } finally {
      setSaving(false);
    }
  }

  const finished = match.polandScore != null && match.opponentScore != null;
  const kickoffDate = match.kickoff?.toDate ? match.kickoff.toDate() : new Date(match.kickoff);

  return (
    <div className="fixture-card">
      <h3>{match.isHome ? `Poland vs ${match.opponent}` : `${match.opponent} vs Poland`}</h3>
      <p className="kickoff">{kickoffDate.toLocaleString()}</p>

      {finished && (
        <p className="result">
          Final: {match.isHome
            ? `${match.polandScore}-${match.opponentScore}`
            : `${match.opponentScore}-${match.polandScore}`}
        </p>
      )}

      {myPrediction ? (
        <p className="locked-in">
          Your prediction: {myPrediction.polandScore}-{myPrediction.opponentScore}
          {finished && <> · {pointsFor(myPrediction, match)} pts</>}
        </p>
      ) : locked ? (
        <p className="missed">Locked — no prediction submitted</p>
      ) : (
        <form onSubmit={submit} className="predict-form">
          <input type="number" min="0" max="20" value={poland}
            onChange={(e) => setPoland(e.target.value)} placeholder="POL" />
          <span>–</span>
          <input type="number" min="0" max="20" value={opponent}
            onChange={(e) => setOpponent(e.target.value)}
            placeholder={match.opponent.slice(0, 3).toUpperCase()} />
          <button type="submit" disabled={saving}>Lock it in</button>
        </form>
      )}
    </div>
  );
}