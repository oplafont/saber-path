"use client";

import { useEffect, useState } from 'react';

/**
 * SuccessPage displays the user's full Jedi profile after a successful payment.
 * It retrieves the stored profile and name from localStorage and provides
 * functionality to download the profile as a PDF certificate.
 */
export default function SuccessPage() {
  const [profile, setProfile] = useState<string | null>(null);
  const [name, setName] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedProfile = localStorage.getItem('jediProfile');
      const storedName = localStorage.getItem('jediName');
      setProfile(storedProfile);
      setName(storedName || '');
    }
  }, []);

  const handleDownloadPdf = async () => {
    if (!profile) return;
    try {
      const res = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, name }),
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'jedi_profile.pdf';
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white p-8"
      style={{ backgroundImage: "url('/starwars-bg.jpg')" }}
    >
      <h1 className="text-4xl font-bold mb-4 text-yellow-400 font-[Orbitron]">
        Thank you for your purchase!
      </h1>
      {profile ? (
        <>
          <pre className="whitespace-pre-wrap font-mono text-lg mb-6">
            {profile}
          </pre>
          <button
            onClick={handleDownloadPdf}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-lg transition"
          >
            Download Certificate (PDF)
          </button>
        </>
      ) : (
        <p className="text-lg">Loading your Jedi profile...</p>
      )}
    </div>
  );
}
