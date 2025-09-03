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
const [filters,setFilters]=useState({ status:'', priority:'', due_from:'', due_to:'', q:'' });
const qs = useMemo(()=>({ ...filters, page, limit }), [filters, page, limit]);
async function load(){
setLoading(true);
try{
const { data } = await api.get('/tasks', { params: qs });
const p = data?.items ? data : { items: data, page, limit, total: data?.length || 0, hasMore: false };
setItems(p.items); setTotal(p.total); setHasMore(p.hasMore);
} catch(e){ setErr(e?.response?.data?.message || 'Load failed'); }
finally { setLoading(false); }
}
useEffect(()=>{ load(); }, [qs.page, qs.limit, qs.status, qs.priority, qs.due_from, qs.due_to, qs.q]);
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
if (loading) return <div>Loading...</div>;
return (
<div style={{ maxWidth:920, margin:'16px auto' }}>
<header style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
<h2>Tasks</h2>
<div>Logged in as: <b>{user?.name}</b> ({user?.role}) <button onClick={logout}>Logout</button></div>
</header>
{err && <div style={{color:'red'}}>{err}</div>}
<section style={{ display:'flex', gap:8, flexWrap:'wrap', margin:'12px 0' }}>
<input placeholder="Search" value={filters.q} onChange={e=>setFilters(f=>({...f, q:e.target.value, page:1}))}/>
<select value={filters.status} onChange={e=>setFilters(f=>({...f, status:e.target.value }))}>
<option value="">All status</option>
<option value="todo">Todo</option>
<option value="in_progress">In progress</option>
<option value="done">Done</option>
</select>
<select value={filters.priority} onChange={e=>setFilters(f=>({...f, priority:e.target.value }))}>
<option value="">All priority</option>
<option value="low">Low</option>
<option value="medium">Medium</option>
<option value="high">High</option>
</select>
<input type="date" value={filters.due_from} onChange={e=>setFilters(f=>({...f, due_from:e.target.value }))}/>
<input type="date" value={filters.due_to} onChange={e=>setFilters(f=>({...f, due_to:e.target.value }))}/>
<button onClick={()=>setPage(1)}>Apply</button>
</section>
<section style={{ display:'grid', gap:8 }}>
<div style={{ display:'flex', gap:8 }}>
<input placeholder="New task title" value={title} onChange={e=>setTitle(e.target.value)} />
<button onClick={create}>Add</button>
</div>
<ul style={{ listStyle:'none', padding:0 }}>
{items.map(t=>(
<li key={t.id} style={{ border:'1px solid #eee', padding:12, borderRadius:8, marginBottom:8 }}>
<div style={{ display:'flex', justifyContent:'space-between', gap:8 }}>
<div>
<b>{t.title}</b>
<div style={{ fontSize:12, color:'#666' }}>
Status: {t.status} | Priority: {t.priority} | Due: {t.due_date || '-'}
</div>
</div>
<div style={{ display:'flex', gap:8 }}>
<select value={t.status} onChange={e=>patch(t.id, { status: e.target.value })}>
<option value="todo">Todo</option>
<option value="in_progress">In progress</option>
<option value="done">Done</option>
</select>
<select value={t.priority} onChange={e=>patch(t.id, { priority: e.target.value })}>
<option value="low">Low</option>
<option value="medium">Medium</option>
<option value="high">High</option>
</select>
<button onClick={()=>remove(t.id)}>Delete</button>
</div>
</div>
</li>
))}
</ul>
</section>
<footer style={{ display:'flex', gap:8, alignItems:'center', marginTop:12 }}>
<button disabled={page===1} onClick={()=>setPage(p=>p-1)}>Prev</button>
<span>Page {page}</span>
<button disabled={!hasMore && page*limit>=total} onClick={()=>setPage(p=>p+1)}>Next</button>
<select value={limit} onChange={e=>setLimit(parseInt(e.target.value))}>
<option value={5}>5</option>
<option value={10}>10</option>
<option value={20}>20</option>
</select>
</footer>
</div>
);
}

