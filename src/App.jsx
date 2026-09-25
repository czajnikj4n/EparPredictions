import { useCollection } from './hooks/useCollection';
import { usePlayer } from './hooks/usePlayer';
import NameGate from './components/NameGate';
import FixtureCard from './components/FixtureCard';
import Leaderboard from './components/Leaderboard';
import './App.css';

export default function App() {
  const { uid, playerName, setPlayerName } = usePlayer();
  const { docs: matches, loading } = useCollection('matches', 'order');

  if (!uid) return <p>Connecting…</p>;
  if (!playerName) return <NameGate onSubmit={setPlayerName} />;
  if (loading) return <p>Loading fixtures…</p>;

  return (
    <div className="app">
      <header>
        <h1>🇵🇱 EPAR Nations League Predictor</h1>
        <p>Playing as {playerName}</p>
      </header>

      <section className="fixtures">
        {matches.map((match) => (
          <FixtureCard key={match.id} match={match} uid={uid} playerName={playerName} />
        ))}
      </section>

      <Leaderboard matches={matches} />
    </div>
  );
}