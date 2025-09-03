import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api.js';
const Ctx = createContext({ user: null, ready: false, login: async()=>{}, register: async()=>{}, logout: async()=>{} });
export const useAuth = ()=>useContext(Ctx);
export function AuthProvider({ children }) {
const [user,setUser]=useState(null); const [ready,setReady]=useState(false);
const fetchMe = async()=>{ const {data}=await api.get('/users/me'); setUser(data); };
useEffect(()=>{ (async()=>{
try { await fetchMe(); }
catch {
try { await api.post('/auth/refresh'); await fetchMe(); }
catch { setUser(null); }
} finally { setReady(true); }
})(); },[]);
const login = async (email,password)=>{ await api.post('/auth/login',{email,password}); await fetchMe(); };
const register = async (name,email,password)=>{ await api.post('/auth/register',{name,email,password}); };
const logout = async ()=>{ try { await api.post('/auth/logout',{}); } finally { setUser(null); } };
return <Ctx.Provider value={{ user, ready, login, register, logout }}>{children}</Ctx.Provider>;
}