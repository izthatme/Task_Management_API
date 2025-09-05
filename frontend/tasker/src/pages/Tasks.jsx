import { useEffect, useMemo, useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../auth/AuthContext.jsx';
export default function Tasks(){
const { user, logout } = useAuth();
const [items,setItems]=useState([]);
const [page,setPage]=useState(1); const [limit,setLimit]=useState(10);
const [total,setTotal]=useState(0); const [hasMore,setHasMore]=useState(false);
const [loading,setLoading]=useState(true); const [err,setErr]=useState('');
const [title,setTitle]=useState('');
const [filters,setFilters]=useState({ status:'', priority:'', dueFrom:'', dueTo:'', q:'' });
const qs = useMemo(()=>({ ...filters, page, limit }), [filters, page, limit]);
async function load(){
setLoading(true);
try{
const { data } = await api.get('/tasks', { params: qs });
const p = data?.data ? data : { data, page, limit, total: data?.length || 0, totalPages: 1 };
setItems(p.data); setTotal(p.total); setHasMore(page * limit < p.total);
} catch(e){ setErr(e?.response?.data?.message || 'Load failed'); }
finally { setLoading(false); }
}
useEffect(()=>{ load(); }, [qs.page, qs.limit, qs.status, qs.priority, qs.dueFrom, qs.dueTo, qs.q]);
async function create(){
if(!title.trim()) return;
const { data } = await api.post('/tasks',{ title });
setItems(prev=>[data, ...prev]); setTitle('');
}
async function patch(id, body){
const { data } = await api.patch(`/tasks/${id}`, body);
setItems(prev=>prev.map(t=>t.id===id? data : t));
}
async function remove(id){
await api.delete(`/tasks/${id}`);
setItems(prev=>prev.filter(t=>t.id!==id));
}
if (loading) return <div className="p-6 text-gray-600">Loading...</div>;
return (
<div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
<header className="flex justify-between items-center">
<h2 className="text-2xl font-semibold">Tasks</h2>
<div className="text-sm text-gray-600">{user?.name} — {user?.role} <button className="ml-2 text-red-600 hover:underline" onClick={logout}>Logout</button></div>
</header>
{err && <div className="text-red-600 text-sm">{err}</div>}
<section className="flex flex-wrap gap-2">
<input className="border border-gray-300 rounded px-3 py-2" placeholder="Search" value={filters.q} onChange={e=>setFilters(f=>({...f, q:e.target.value, page:1}))}/>
<select className="border border-gray-300 rounded px-3 py-2" value={filters.status} onChange={e=>setFilters(f=>({...f, status:e.target.value }))}>
<option value="">All status</option>
<option value="todo">Todo</option>
<option value="in_progress">In progress</option>
<option value="done">Done</option>
</select>
<select className="border border-gray-300 rounded px-3 py-2" value={filters.priority} onChange={e=>setFilters(f=>({...f, priority:e.target.value }))}>
<option value="">All priority</option>
<option value="low">Low</option>
<option value="medium">Medium</option>
<option value="high">High</option>
</select>
<input className="border border-gray-300 rounded px-3 py-2" type="date" value={filters.dueFrom} onChange={e=>setFilters(f=>({...f, dueFrom:e.target.value }))}/>
<input className="border border-gray-300 rounded px-3 py-2" type="date" value={filters.dueTo} onChange={e=>setFilters(f=>({...f, dueTo:e.target.value }))}/>
<button className="bg-black text-white rounded px-4 py-2" onClick={()=>setPage(1)}>Apply</button>
</section>
<section className="space-y-3">
<div className="flex gap-2">
<input className="flex-1 border border-gray-300 rounded px-3 py-2" placeholder="New task title" value={title} onChange={e=>setTitle(e.target.value)} />
<button className="bg-black text-white rounded px-4 py-2" onClick={create}>Add</button>
</div>
<ul className="space-y-2">
{items.map(t=>(
<li key={t.id} className="border border-gray-200 rounded-lg p-3">
<div className="flex justify-between gap-3">
<div>
<b className="block">{t.title}</b>
<div className="text-xs text-gray-500">Status: {t.status} | Priority: {t.priority} | Due: {t.dueDate || '-'}</div>
</div>
<div className="flex gap-2">
<select className="border border-gray-300 rounded px-2 py-1" value={t.status} onChange={e=>patch(t.id, { status: e.target.value })}>
<option value="todo">Todo</option>
<option value="in_progress">In progress</option>
<option value="done">Done</option>
</select>
<select className="border border-gray-300 rounded px-2 py-1" value={t.priority} onChange={e=>patch(t.id, { priority: e.target.value })}>
<option value="low">Low</option>
<option value="medium">Medium</option>
<option value="high">High</option>
</select>
<button className="text-red-600 hover:underline" onClick={()=>remove(t.id)}>Delete</button>
</div>
</div>
</li>
))}
</ul>
</section>
<footer className="flex gap-2 items-center pt-2">
<button className="border border-gray-300 rounded px-3 py-1 disabled:opacity-50" disabled={page===1} onClick={()=>setPage(p=>p-1)}>Prev</button>
<span>Page {page}</span>
<button className="border border-gray-300 rounded px-3 py-1 disabled:opacity-50" disabled={!hasMore && page*limit>=total} onClick={()=>setPage(p=>p+1)}>Next</button>
<select className="border border-gray-300 rounded px-2 py-1" value={limit} onChange={e=>setLimit(parseInt(e.target.value))}>
<option value={5}>5</option>
<option value={10}>10</option>
<option value={20}>20</option>
</select>
</footer>
</div>
);
}

