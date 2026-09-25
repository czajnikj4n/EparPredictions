import { useMemo } from 'react';
import { useCollection } from '../hooks/useCollection';
import { pointsFor } from '../utils/scoring';

export default function Leaderboard({ matches }) {
  const { docs: predictions, loading } = useCollection('predictions');

  const standings = useMemo(() => {
    const byPlayer = {};
    for (const pred of predictions) {
      const match = matches.find((m) => m.id === pred.matchId);
      if (!match) continue;
      const pts = pointsFor(pred, match);
      if (!byPlayer[pred.uid]) byPlayer[pred.uid] = { name: pred.playerName, total: 0 };
      byPlayer[pred.uid].total += pts;
    }
    return Object.entries(byPlayer)
      .map(([uid, v]) => ({ uid, ...v }))
      .sort((a, b) => b.total - a.total);
  }, [predictions, matches]);

  if (loading) return <p>Loading leaderboard…</p>;

  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>
      <ol>
        {standings.map((p) => (
          <li key={p.uid}>
            <span>{p.name}</span>
            <span>{p.total} pts</span>
          </li>
        ))}
      </ol>
    </div>
  );
}