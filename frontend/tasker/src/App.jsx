import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext.jsx';
import AuthGuard from './auth/AuthGuard.jsx';
import Login from './auth/Login.jsx';
import Register from './auth/Register.jsx';
import Tasks from './pages/Tasks.jsx';
import AdminUsers from './pages/AdminUsers.jsx';
function Header() {
const { user } = useAuth();
return (
<nav style={{ display:'flex', gap:12, padding:12, borderBottom:'1px solid #eee' }}>
<Link to="/app/tasks">Tasks</Link>
{user?.role !== 'user' && <Link to="/app/admin/users">Admin</Link>}
</nav>
);
}
export default function App(){
return (
<AuthProvider>
<Routes>
<Route path="/" element={<Navigate to="/login" replace />} />

<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/app/tasks" element={<h1>Hello User</h1>} />
<Route element={<AuthGuard />}>
<Route path="/app/" element={
<div>
<Header />
<Routes>
<Route path="tasks" element={<Tasks />} />
<Route path="admin/users" element={<AdminUsers />} />
<Route path="" element={<Navigate to="tasks" replace />} />
</Routes>
</div>
} />
</Route>
<Route path="*" element={<Navigate to="/app/tasks" replace />} />
</Routes>
</AuthProvider>
);
}