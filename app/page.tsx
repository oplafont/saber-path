'use client';

import { useState, useEffect, useRef } from "react";

export default function HomePage() {
  const [answers, setAnswers] = useState<string[][]>(
    Array.from({ length: 5 }, () => ["", "", ""])
  );
  const [jediName, setJediName] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/saber-click.mp3");
  }, []);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  const handleRankChange = (
    questionIndex: number,
    rankIndex: number,
    value: string
  ) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex][rankIndex] = value;
    setAnswers(newAnswers);
    playSound();
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResult("");
    setShowResult(false);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers, name: jediName }),
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data.result);
        setTimeout(() => setShowResult(true), 300);
      } else {
        setResult("Failed to generate Jedi profile. Try again later.");
      }
    } catch (error) {
      setResult("An error occurred. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAnswers(Array.from({ length: 5 }, () => ["", "", ""]));
    setJediName("");
    setResult("");
    setShowResult(false);
  };

  const questions = [
    [
      "Strike first—power and momentum win battles.",
      "Observe, wait, and react with precision when the time is right.",
      "Talk them down—violence is the last resort.",
      "Distract them with wit or surprise, then exploit the opening.",
    ],
    [
      "Channel it into strength—it’s fuel for my fire.",
      "Acknowledge it but stay in control—emotion must serve me, not rule me.",
      "Bury it and stay composed—it has no place in the moment.",
      "Follow where it leads—it’s a compass, not a curse.",
    ],
    [
      "I lead from the front—I won’t ask what I won’t do myself.",
      "I delegate based on strength—I trust my people to do their jobs.",
      "I work behind the scenes—guiding without being the focus.",
      "I challenge the mission entirely—is this really the right move?",
    ],
    [
      "I test it—knowledge is meant to be wielded.",
      "I study it, but keep it secret—some truths are too unstable.",
      "I destroy it—there are some paths that shouldn't be walked.",
      "I bring it to others—we need to face it together.",
    ],
    [
      "End them—this is justice.",
      "Let them live, but never trust them again.",
      "Seek understanding—what really caused the betrayal?",
      "Walk away—this fight doesn’t define me anymore.",
    ],
  ];

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white px-4 py-10"
      style={{ backgroundImage: "url('/starwars-bg.jpg')" }}
    >
      <h1 className="text-5xl font-[Orbitron] font-extrabold mb-6 text-center text-yellow-400 drop-shadow-[0_0_15px_rgba(255,255,100,0.8)]">
        The Way of the Saber
      </h1>

      <div className="mb-6">
        <label className="block text-xl font-semibold mb-2">
          What should we call you, Jedi?
        </label>
        <input
          type="text"
          value={jediName}
          onChange={(e) => setJediName(e.target.value)}
          placeholder="Enter your Jedi name"
          className="w-full p-3 rounded-lg border bg-background text-foreground focus:outline-none focus:ring"
        />
      </div>

      {questions.map((choices, questionIndex) => (
        <div key={questionIndex} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Question {questionIndex + 1}</h2>
          {[0, 1, 2].map((rank) => (
            <div key={rank} className="mb-2">
              <label className="block mb-1">Rank {rank + 1}</label>
              <select
                value={answers[questionIndex][rank]}
                onChange={(e) =>
                  handleRankChange(questionIndex, rank, e.target.value)
                }
                className="w-full p-2 rounded border bg-white text-black"
              >
                <option value="">-- Select an option --</option>
                {choices.map((choice, idx) => {
                  const isSelected =
                    answers[questionIndex].includes(choice) &&
                    answers[questionIndex][rank] !== choice;
                  return (
                    <option
                      key={idx}
                      value={choice}
                      disabled={isSelected}
                      style={{ color: isSelected ? "gray" : "inherit" }}
                    >
                      {choice}
                    </option>
                  );
                })}
              </select>
            </div>
          ))}
        </div>
      ))}

      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-lg"
        >
          {loading ? "Revealing..." : "Reveal My Saber Path"}
        </button>

        <button
          onClick={handleReset}
          className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition shadow-lg"
        >
          Reset Quiz
        </button>
      </div>

      {result && (
        <div className="mt-10 p-6 bg-black/70 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-yellow-300 font-[Orbitron]">
            Your Jedi Profile
          </h2>
          <pre
            className={`whitespace-pre-wrap font-mono text-lg ${showResult ? "animate-typewriter" : ""}`}
            style={{
              overflow: "hidden",
              maxHeight: showResult ? "1000px" : "0",
              transition: "max-height 1s ease-in-out",
            }}
          >
            {result}
          </pre>
        </div>
      )}

      {/* Hidden audio for sound fx */}
      <audio ref={audioRef} src="/saber-click.mp3" preload="auto" />
    </div>
  );
}
