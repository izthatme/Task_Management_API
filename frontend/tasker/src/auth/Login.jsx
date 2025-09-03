import { useState } from 'react';
import { useAuth } from './AuthContext.jsx';
import { useLocation, useNavigate, Link } from 'react-router-dom';
export default function Login(){
const { login } = useAuth();
const nav = useNavigate(); const loc = useLocation();
const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [err,setErr]=useState('');
const submit = async (e)=>{ e.preventDefault();
try { await login(email,password); nav((loc.state?.from?.pathname) || '/app/tasks'); }
catch(e){ setErr(e?.response?.data?.message || 'Login failed'); }
};
return (
<form onSubmit={submit} style={{ maxWidth:320, margin:'10% auto', display:'grid', gap:8 }}>
<h1>Login</h1>
<input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
<input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
{err && <div style={{color:'red'}}>{err}</div>}
<button type="submit">Login</button>
<div>New? <Link to="/register">Register</Link></div>
</form>
);
}