'use client';

import React, { useState } from 'react';

const QUESTIONS = [
  {
    id: 1,
    prompt: "You’re in a heated standoff. A decision must be made.",
    options: [
      "Strike first—power and momentum win battles.",
      "Observe, wait, and react with precision when the time is right.",
      "Talk them down—violence is the last resort.",
      "Distract them with wit or surprise, then exploit the opening."
    ]
  },
  {
    id: 2,
    prompt: "You feel an overwhelming surge of emotion—grief, rage, or love. What do you do?",
    options: [
      "Channel it into strength—it’s fuel for my fire.",
      "Acknowledge it but stay in control—emotion must serve me, not rule me.",
      "Bury it and stay composed—it has no place in the moment.",
      "Follow where it leads—it’s a compass, not a curse."
    ]
  },
  {
    id: 3,
    prompt: "You’ve been chosen to lead a squad into a dangerous mission. How do you approach it?",
    options: [
      "I lead from the front—I won’t ask what I won’t do myself.",
      "I delegate based on strength—I trust my people to do their jobs.",
      "I work behind the scenes—guiding without being the focus.",
      "I challenge the mission entirely—is this really the right move?"
    ]
  },
  {
    id: 4,
    prompt: "You stumble upon a forbidden Force technique said to be dangerous and powerful.",
    options: [
      "I test it—knowledge is meant to be wielded.",
      "I study it, but keep it secret—some truths are too unstable.",
      "I destroy it—there are some paths that shouldn't be walked.",
      "I bring it to others—we need to face it together."
    ]
  },
  {
    id: 5,
    prompt: "You’re face-to-face with a rival who once betrayed you. You’ve won. What now?",
    options: [
      "End them—this is justice.",
      "Let them live, but never trust them again.",
      "Seek understanding—what really caused the betrayal?",
      "Walk away—this fight doesn’t define me anymore."
    ]
  }
];

export default function JediQuiz() {
  const [responses, setResponses] = useState(
    QUESTIONS.map(() => Array(3).fill(''))
  );

  const handleChange = (qIndex: number, rank: number, value: string) => {
    const updated = [...responses];
    updated[qIndex][rank] = value;
    setResponses(updated);
  };

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ answers: responses })
      });
  
      const data = await res.json();
      setResult(data.result);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setResult('Failed to generate Jedi profile. Try again later.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="p-6 space-y-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-4">Path of the Saber</h1>
      {QUESTIONS.map((q, qIndex) => (
        <div key={q.id} className="border rounded-lg p-4 space-y-4 shadow">
          <h2 className="text-xl font-semibold">Question {q.id}</h2>
          <p>{q.prompt}</p>
          {[0, 1, 2].map((rank) => (
            <div key={rank}>
              <label className="block text-sm font-medium mb-1">
                {rank + 1} – Rank #{rank + 1} choice
              </label>
              <select
                className="w-full p-2 rounded border"
                value={responses[qIndex][rank]}
                onChange={(e) => handleChange(qIndex, rank, e.target.value)}
              >
                <option value="">Select an option</option>
                {q.options.map((opt, i) => (
                  <option key={i} value={opt} disabled={responses[qIndex].includes(opt)}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      ))}

      <div className="text-center">
        <button
          onClick={handleSubmit}
          className="mt-6 px-6 py-3 text-lg font-semibold bg-black text-white rounded hover:bg-gray-800"
        >
          Reveal My Saber Path
        </button>
        {loading && (
  <p className="text-center mt-4 text-lg font-medium text-yellow-500">
    Reading the Flow… Forging your legacy...
  </p>
)}

{result && (
  <div className="mt-10 border p-6 rounded bg-black text-white space-y-4">
    <h2 className="text-2xl font-bold text-center text-lime-400">Your Jedi Profile</h2>
    <pre className="whitespace-pre-wrap text-lg">{result}</pre>
  </div>
)}

      </div>
    </div>
  );
}
