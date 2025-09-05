import { Routes, Route, Navigate, Link, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext.jsx';
import AuthGuard from './auth/AuthGuard.jsx';
import Login from './auth/Login.jsx';
import Register from './auth/Register.jsx';
import Tasks from './pages/Tasks.jsx';
import AdminUsers from './pages/AdminUsers.jsx';
function Header() {
const { user } = useAuth();
return (
<nav className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-200">
  <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
    <Link to="/app/tasks" className="text-gray-700 hover:text-black font-medium">Tasks</Link>
    {user?.role !== 'User' && (
      <Link to="/app/admin/users" className="text-gray-700 hover:text-black font-medium">Admin</Link>
    )}
    <div className="ml-auto text-sm text-gray-500">{user?.name}</div>
  </div>
</nav>
);
}
function AppLayout(){
return (
<div className="min-h-screen">
<Header />
<Outlet />
</div>
);
}
export default function App(){
return (
<AuthProvider>
<Routes>
<Route path="/" element={<Navigate to="/login" replace />} />

<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route element={<AuthGuard />}>
<Route path="/app" element={<AppLayout />}>
<Route path="" element={<Navigate to="tasks" replace />} />
<Route path="tasks" element={<Tasks />} />
<Route path="admin/users" element={<AdminUsers />} />
</Route>
</Route>
<Route path="*" element={<Navigate to="/app/tasks" replace />} />
</Routes>
</AuthProvider>
);
}