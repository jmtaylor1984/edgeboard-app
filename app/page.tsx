'use client';

import { useState, useEffect } from 'react';

interface Parlay {
  type: string;
  game: string;
  game_time: string;
  leg1: string;
  leg1_signal: number;
  leg1_grade: string;
  leg2: string;
  leg2_signal: number;
  leg2_grade: string;
  leg3: string;
  leg3_signal: number;
  leg3_grade: string;
  combined_signal: number;
  combined_grade: string;
  confidence: string;
}

export default function Home() {
  const [parlays, setParlays] = useState<Parlay[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [minSignal, setMinSignal] = useState(0);
  const [lastUpdated, setLastUpdated] = useState('');
  const [games, setGames] = useState<{[key: string]: Parlay[]}>({});

  useEffect(() => {
    fetchParlays();
    // Refresh every 5 minutes (300,000 ms)
    const interval = setInterval(fetchParlays, 300000);
    return () => clearInterval(interval);
  }, [filter, minSignal]);

  const fetchParlays = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/parlays?type=${filter}&minSignal=${minSignal}&limit=500`);
      const data = await response.json();
      if (data.success) {
        setParlays(data.parlays);
        setLastUpdated(data.last_updated);
        
        // Group by game
        const grouped = data.parlays.reduce((acc: any, parlay: Parlay) => {
          const gameKey = `${parlay.game} (${parlay.game_time})`;
          if (!acc[gameKey]) acc[gameKey] = [];
          acc[gameKey].push(parlay);
          return acc;
        }, {});
        setGames(grouped);
      }
    } catch (error) {
      console.error('Error fetching parlays:', error);
    }
    setLoading(false);
  };

  const getSignalColor = (signal: number) => {
    if (signal >= 80) return 'text-green-400';
    if (signal >= 70) return 'text-blue-400';
    if (signal >= 60) return 'text-yellow-400';
    return 'text-gray-400';
  };

  const getSignalBg = (signal: number) => {
    if (signal >= 80) return 'bg-green-500/10 border-green-500/30';
    if (signal >= 70) return 'bg-blue-500/10 border-blue-500/30';
    if (signal >= 60) return 'bg-yellow-500/10 border-yellow-500/30';
    return 'bg-gray-500/10 border-gray-500/30';
  };

  const getGradeBadge = (grade: string) => {
    if (grade.includes('ELITE')) return 'bg-gradient-to-r from-green-600 to-emerald-600';
    if (grade.includes('GREAT')) return 'bg-gradient-to-r from-blue-600 to-indigo-600';
    return 'bg-gradient-to-r from-yellow-600 to-orange-600';
  };

  const stats = {
    total: parlays.length,
    elite: parlays.filter(p => p.combined_signal >= 80).length,
    avgSignal: parlays.length > 0 ? (parlays.reduce((sum, p) => sum + p.combined_signal, 0) / parlays.length).toFixed(1) : '0',
    games: Object.keys(games).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black">
      {/* Animated Background - 50 years of polish */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <span className="text-2xl">🏀</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                  EdgeBoard
                </h1>
                <p className="text-xs text-gray-500">Same-Game Parlay Intelligence • Real NBA Data • Free</p>
              </div>
            </div>
            
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{stats.total}</div>
                <div className="text-xs text-gray-500">Active Parlays</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{stats.elite}</div>
                <div className="text-xs text-gray-500">Elite Signals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{stats.avgSignal}%</div>
                <div className="text-xs text-gray-500">Avg Signal</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{stats.games}</div>
                <div className="text-xs text-gray-500">Games Today</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-4 mb-8 border border-gray-700">
          <div className="flex flex-wrap gap-3 items-center">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                filter === 'all' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              All Parlays
            </button>
            <button
              onClick={() => setFilter('3-Leg Same-Game')}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                filter === '3-Leg Same-Game' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              🔗 Same-Game Parlays
            </button>
            
            <div className="flex-1"></div>
            
            <select
              value={minSignal}
              onChange={(e) => setMinSignal(Number(e.target.value))}
              className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
            >
              <option value={0}>All Signals</option>
              <option value={80}>Elite Only (80%+)</option>
              <option value={70}>Great+ (70%+)</option>
              <option value={60}>Good+ (60%+)</option>
            </select>
            
            <button
              onClick={fetchParlays}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl transition text-sm"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-right text-xs text-gray-500 mb-4">
          Live data from NBA.com • {lastUpdated ? `Updated: ${new Date(lastUpdated).toLocaleTimeString()}` : 'Loading...'}
        </div>

        {/* Parlays by Game */}
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 animate-pulse">
                <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-16 bg-gray-700 rounded"></div>
                  <div className="h-16 bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : Object.keys(games).length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏀</div>
            <p className="text-gray-400">No games today. Check back during the NBA season.</p>
            <p className="text-gray-500 text-sm mt-2">Data refreshes daily at 6 AM</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(games).map(([gameName, gameParlays]) => (
              <div key={gameName} className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-green-500 rounded-full"></div>
                  <h2 className="text-xl font-bold text-white">{gameName}</h2>
                  <span className="text-sm text-gray-500">{gameParlays.length} parlays</span>
                </div>
                
                <div className="grid gap-4">
                  {(gameParlays as Parlay[]).map((parlay, idx) => (
                    <div 
                      key={idx} 
                      className={`group bg-gray-800/30 backdrop-blur rounded-xl border transition-all duration-300 hover:scale-[1.01] ${getSignalBg(parlay.combined_signal)}`}
                    >
                      <div className="p-5">
                        {/* Header */}
                        <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
                          <div className="flex gap-2">
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold text-white ${getGradeBadge(parlay.combined_grade)} shadow-lg`}>
                              {parlay.combined_grade}
                            </span>
                            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-gray-700 text-gray-300">
                              {parlay.type}
                            </span>
                          </div>
                          <div className="flex gap-3 items-center">
                            <span className={`text-sm font-semibold ${parlay.confidence === 'HIGH' ? 'text-green-400' : 'text-yellow-400'}`}>
                              {parlay.confidence} Confidence
                            </span>
                            <div className="text-right">
                              <div className="text-xs text-gray-500">Combined Signal</div>
                              <div className={`text-2xl font-bold ${getSignalColor(parlay.combined_signal)}`}>
                                {parlay.combined_signal}%
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Legs */}
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded-xl">
                            <span className="text-gray-300 font-medium">{parlay.leg1}</span>
                            <span className={`text-sm font-bold ${getSignalColor(parlay.leg1_signal)}`}>
                              {parlay.leg1_grade} ({parlay.leg1_signal}%)
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded-xl">
                            <span className="text-gray-300 font-medium">{parlay.leg2}</span>
                            <span className={`text-sm font-bold ${getSignalColor(parlay.leg2_signal)}`}>
                              {parlay.leg2_grade} ({parlay.leg2_signal}%)
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded-xl">
                            <span className="text-gray-300 font-medium">{parlay.leg3}</span>
                            <span className={`text-sm font-bold ${getSignalColor(parlay.leg3_signal)}`}>
                              {parlay.leg3_grade} ({parlay.leg3_signal}%)
                            </span>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="pt-3 border-t border-gray-700 flex justify-between items-center">
                          <div className="flex gap-2">
                            <span className="text-xs text-gray-500">NBA.com API • Real-time</span>
                          </div>
                          <button 
                            onClick={() => {
                              const text = `${parlay.leg1}\n${parlay.leg2}\n${parlay.leg3}\n\n🎯 Combined Signal: ${parlay.combined_signal}%\n📊 ${parlay.game} - ${parlay.game_time}`;
                              navigator.clipboard.writeText(text);
                            }}
                            className="text-sm px-3 py-1.5 rounded-xl bg-gray-700 hover:bg-gray-600 transition text-gray-300"
                          >
                            📋 Copy Parlay
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            EdgeBoard Parlay Intelligence — Data from NBA.com API (free)
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Research only. No guaranteed outcomes. Bet responsibly. 21+.
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Updates every 5 minutes • Real NBA data • No subscriptions required
          </p>
        </div>
      </footer>
    </div>
  );
}