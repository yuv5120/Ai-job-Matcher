console.log("Login component loaded");
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <AuthLayout
      title="Admin Login"
      subtitle="Welcome back! Please enter your details"
      footer={
        <>
          Don’t have an account? <Link to="/register" className="text-indigo-600 font-semibold">Sign up</Link>
        </>
      }
    >
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Enter your Email *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        />
        <div className="relative">
          <input
            type="password"
            placeholder="Password *"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <EyeOff className="absolute right-3 top-2.5 text-gray-400" />
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <label>
            <input type="checkbox" className="mr-2" />
            Remember me
          </label>
          <a href="#" className="text-pink-500 font-medium hover:underline">Forgot password?</a>
        </div>

        <button
          type="submit"
          className="w-full py-2 text-white font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 transition"
        >
          LOGIN
        </button>
      </form>
    </AuthLayout>
  );
}
