import PageRoutes from '@/routes/PageRoutes';
import useUserStore from '@/store/userStore';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);

  console.log({ isLoggedIn });

  if (isLoggedIn) return <Navigate to={PageRoutes.dashboard} replace />;

  return <Outlet />;
};

export default PublicRoute;
