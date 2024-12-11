import PageRoutes from '@/routes/PageRoutes';
import useUserStore from '@/store/userStore';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = () => {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const location = useLocation();

  if (!isLoggedIn) {
    // Redirect to login page if not authenticated
    return (
      <Navigate to={PageRoutes.login} state={{ from: location }} replace />
    );
  }

  // Render the child components if authenticated
  return <Outlet />;
};

export default ProtectedRoute;
