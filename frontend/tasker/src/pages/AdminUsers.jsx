import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../auth/AuthContext.jsx';
export default function AdminUsers(){
const { user } = useAuth();
const [list,setList]=useState([]); const [err,setErr]=useState('');
useEffect(()=>{ (async()=>{
try { const { data } = await api.get('/users'); setList(data.items || data); }
catch(e){ setErr(e?.response?.data?.message || 'Failed to load users'); }
})(); },[]);
if (user?.role === 'user') return <div>Forbidden</div>;
return (
<div style={{ maxWidth:720, margin:'16px auto' }}>
<h2>Users</h2>
{err && <div style={{color:'red'}}>{err}</div>}
<ul>{list.map(u=>(<li key={u.id}>{u.name} — {u.email} — {u.role}</li>))}</ul>
</div>
);
}