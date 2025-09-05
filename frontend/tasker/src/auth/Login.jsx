import { useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import { useLocation, useNavigate, Link } from "react-router-dom";
export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      nav(loc.state?.from?.pathname || "/app/tasks");
    } catch (e) {
      setErr(e?.response?.data?.message || "Login failed");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-semibold mb-4">Login</h1>
        <div className="space-y-3">
          <input className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <input className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        </div>
        {err && <div className="text-red-600 text-sm mt-3">{err}</div>}
        <button type="submit" className="mt-4 w-full bg-black text-white rounded px-4 py-2 hover:bg-gray-900">Login</button>
        <div className="text-sm text-gray-600 mt-3">New? <Link className="text-black hover:underline" to="/register">Register</Link></div>
      </form>
    </div>
  );
}
