'use client';
import { useState } from 'react';

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const handleSubscribe = async () => {
    setLoading(true);
    const res = await fetch('/api/checkout', { method: 'POST' });
    const { url } = await res.json();
    window.location.href = url;
  };
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-xl text-center">
        <h1 className="text-3xl font-bold text-white mb-4">EdgeBoard Subscription</h1>
        <p className="text-gray-300 mb-6">Full access to +EV bets and parlays for $29/month.</p>
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl disabled:opacity-50"
        >
          {loading ? 'Redirecting...' : 'Subscribe $29/month'}
        </button>
      </div>
    </div>
  );
}
