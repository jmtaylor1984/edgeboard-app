'use client';

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      await signIn("credentials", { email, password, callbackUrl: "/" });
    } else {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        await signIn("credentials", { email, password, callbackUrl: "/" });
      } else {
        alert("Registration failed");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-xl w-96">
        <h1 className="text-2xl font-bold text-white mb-6">EdgeBoard</h1>
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full bg-white text-gray-900 py-2 rounded-lg mb-4"
        >
          Continue with Google
        </button>
        <div className="text-center text-gray-500 my-4">OR</div>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-700 text-white p-2 rounded mb-3"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-700 text-white p-2 rounded mb-4"
            required
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-gray-400 text-sm mt-4 w-full text-center"
        >
          {isLogin ? "Need an account? Sign Up" : "Already have an account? Sign In"}
        </button>
      </div>
    </div>
  );
}
