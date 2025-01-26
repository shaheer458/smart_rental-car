"use client"; // Mark this as a client component

import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const validEmail = 'dreamcar123321@gmail.com'; // Replace with your valid email
    const validPassword = 'Qadri@#321'; // Replace with your valid password

    if (email === validEmail && password === validPassword) {
      // Store a simple session token in localStorage
      localStorage.setItem('admin', 'true');
      window.location.href = '/dashboard'; // Redirect to the dashboard
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-md shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Login</button>
      </form>
    </div>
  );
};

export default Login;
