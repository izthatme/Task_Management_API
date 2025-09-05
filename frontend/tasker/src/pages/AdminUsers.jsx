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
if (user?.role !== 'Admin') return <div className="p-6 text-gray-600">Forbidden</div>;
return (
<div className="max-w-4xl mx-auto px-4 py-6">
<h2 className="text-2xl font-semibold mb-3">Users</h2>
{err && <div className="text-red-600 text-sm">{err}</div>}
<ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg">
{list.map(u=>(
  <li key={u.id} className="p-3 flex justify-between">
    <span className="font-medium">{u.name}</span>
    <span className="text-gray-600">{u.email}</span>
    <span className="text-gray-500">{u.role}</span>
  </li>
))}
</ul>
</div>
);
}