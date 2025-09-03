import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
export default function AuthGuard(){
const { user, ready } = useAuth();
const location = useLocation();
if (!ready) return <div>Loading...</div>;
if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
return <Outlet />;
}