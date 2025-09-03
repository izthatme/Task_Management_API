import { useState } from 'react';
import { useAuth } from './AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
export default function Register(){
const { register } = useAuth();
const nav = useNavigate();
const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [password,setPassword]=useState('');
const [err,setErr]=useState('');
const submit = async (e)=>{ e.preventDefault();
try { await register(name,email,password); nav('/login'); }
catch(e){ setErr(e?.response?.data?.message || 'Register failed'); }
};
return (
<form onSubmit={submit} style={{ maxWidth:320, margin:'10% auto', display:'grid', gap:8 }}>
<h1>Register</h1>
<input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
<input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
<input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
{err && <div style={{color:'red'}}>{err}</div>}
<button type="submit">Create account</button>
<div>Have an account? <Link to="/login">Login</Link></div>
</form>
);
}

