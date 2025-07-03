import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join the platform to get started"
      footer={
        <>
          Already have an account? <Link to="/login" className="text-indigo-600 font-semibold">Login</Link>
        </>
      }
    >
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="email"
          placeholder="Enter your Email *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        />
        <input
          type="password"
          placeholder="Password *"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        />
        <button
          type="submit"
          className="w-full py-2 text-white font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 transition"
        >
          SIGN UP
        </button>
      </form>
    </AuthLayout>
  );
}
