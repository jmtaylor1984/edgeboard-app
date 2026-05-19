'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
interface PlayerProp {
  player: string;
  stat_display: string;
  projected_line: number;
  expected_value: number;
  true_probability: number;
  recommendation: string;
}

interface TeamEdge {
  game: string;
  spread_line: string;
  spread_ev: number;
  total_line: number;
  total_ev: number;
}

interface Parlay {
  game: string;
  type: string;
  leg1: string;
  leg1_ev: number;
  leg2: string;
  leg2_ev: number;
  leg3: string;
  leg3_ev: number;
  combined_probability: number;
  fair_decimal_odds: number;
}

// ------------------------------------------------------------------
// Main Component
// ------------------------------------------------------------------
export default function Home() {
  const searchParams = useSearchParams();
  const secret = searchParams.get('access');
  const [authenticated, setAuthenticated] = useState(false);
  const [props, setProps] = useState<PlayerProp[]>([]);
  const [edges, setEdges] = useState<TeamEdge[]>([]);
  const [parlays, setParlays] = useState<Parlay[]>([]);
  const [loading, setLoading] = useState(true);

  // Check secret (replace with your own long random string)
  useEffect(() => {
    if (secret === 'YOUR_SECRET_CODE') {
      setAuthenticated(true);
    }
  }, [secret]);

  // Fetch data only if authenticated
  useEffect(() => {
    if (!authenticated) return;
    fetch('/api/parlays')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProps(data.playerProps || []);
          setEdges(data.teamEdges || []);
          setParlays(data.parlays || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [authenticated]);

  // Paywall
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">🏀</div>
          <h1 className="text-4xl font-bold text-white mb-2">EdgeBoard</h1>
          <p className="text-gray-400 mb-6">Live +EV bets & parlays for Kalshi</p>
          <a
            href="https://your-gumroad-product-link.com"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition"
          >
            Subscribe on Gumroad – $29/mo
          </a>
          <p className="text-gray-500 text-sm mt-4">Already subscribed? Use your secret link.</p>
        </div>
      </div>
    );
  }<a href="https://gum.co/edgeboard-tip" target="_blank" class="bg-yellow-600 text-white px-3 py-1 rounded text-sm">☕ Tip Jar</a>

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading edge data...</div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // Render Dashboard
  // ------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏀</span>
            <span className="font-bold text-xl">EdgeBoard</span>
            <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full ml-2">LIVE EDGE</span>
          </div>
          <div className="text-sm text-gray-400">Updates every morning</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="text-gray-400 text-sm">+EV Player Props</div>
            <div className="text-3xl font-bold text-green-400">{props.filter(p => p.expected_value > 3).length}</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="text-gray-400 text-sm">Top Parlays</div>
            <div className="text-3xl font-bold text-blue-400">{parlays.length}</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="text-gray-400 text-sm">Highest EV</div>
            <div className="text-3xl font-bold text-yellow-400">
              {props.length ? Math.max(...props.map(p => p.expected_value)).toFixed(1) : 0}%
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="text-gray-400 text-sm">Best Parlay Odds</div>
            <div className="text-3xl font-bold text-purple-400">
              {parlays.length ? parlays[0].fair_decimal_odds.toFixed(2) : 0}x
            </div>
          </div>
        </div>

        {/* Player Props Grid */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">📊 +EV Player Props</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {props.filter(p => p.expected_value > 3).slice(0, 12).map((prop, i) => (
              <div key={i} className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-4 border border-gray-700 hover:border-green-500/50 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-lg">{prop.player}</div>
                    <div className="text-gray-300 text-sm">{prop.stat_display} Over {prop.projected_line}</div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-bold ${prop.recommendation === 'STRONG BUY' ? 'bg-green-600' : 'bg-blue-600'}`}>
                    {prop.recommendation}
                  </div>
                </div>
                <div className="mt-3 flex justify-between text-sm">
                  <span className="text-green-400">EV: +{prop.expected_value}%</span>
                  <span className="text-blue-400">True Prob: {prop.true_probability}%</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Team Edges Table */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">🏀 Team Edges</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-gray-800">
                <tr>
                  <th className="pb-2">Game</th>
                  <th className="pb-2">Spread</th>
                  <th className="pb-2">Spread EV</th>
                  <th className="pb-2">Total</th>
                  <th className="pb-2">Total EV</th>
                </tr>
              </thead>
              <tbody>
                {edges.map((edge, i) => (
                  <tr key={i} className="border-b border-gray-800/50">
                    <td className="py-3 font-medium">{edge.game}</td>
                    <td>{edge.spread_line}</td>
                    <td className={edge.spread_ev > 0 ? 'text-green-400' : 'text-red-400'}>{edge.spread_ev > 0 ? `+${edge.spread_ev}%` : `${edge.spread_ev}%`}</td>
                    <td>Over {edge.total_line}</td>
                    <td className={edge.total_ev > 0 ? 'text-green-400' : 'text-red-400'}>{edge.total_ev > 0 ? `+${edge.total_ev}%` : `${edge.total_ev}%`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Parlays List */}
        <section>
          <h2 className="text-2xl font-bold mb-4">🎯 Top 3‑Leg Same‑Game Parlays</h2>
          <div className="space-y-4">
            {parlays.slice(0, 30).map((p, i) => (
              <div key={i} className="bg-gray-900 rounded-xl p-5 border border-gray-800 hover:border-gray-700 transition">
                <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
                  <div>
                    <div className="font-bold text-xl">{p.game}</div>
                    <div className="text-sm text-gray-400">{p.type}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-mono">Probability {p.combined_probability}%</div>
                    <div className="text-blue-400 text-sm">Fair odds {p.fair_decimal_odds}x</div>
                  </div>
                </div>
                <div className="grid gap-2 mt-2">
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span>{p.leg1}</span>
                    <span className="text-green-400 text-sm">EV +{p.leg1_ev}%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span>{p.leg2}</span>
                    <span className="text-green-400 text-sm">EV +{p.leg2_ev}%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span>{p.leg3}</span>
                    <span className="text-green-400 text-sm">EV +{p.leg3_ev}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}