import { useState } from 'react';

export default function NameGate({ onSubmit }) {
  const [name, setName] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length >= 2) onSubmit(trimmed);
  }

  return (
    <form className="name-gate" onSubmit={handleSubmit}>
      <h2>Who's predicting?</h2>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        maxLength={24}
        autoFocus
      />
      <button type="submit">Join the game</button>
    </form>
  );
}