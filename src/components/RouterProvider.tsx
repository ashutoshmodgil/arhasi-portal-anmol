import Chatbot from '@/pages/Chatbot';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import Settings from '@/pages/settings';
import PageRoutes from '@/routes/PageRoutes';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import ProtectedRoute from './auth/ProtectedRoute';
import PublicRoute from './auth/PublicRoute';

const RouterProvider = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route element={<PublicRoute />}>
          <Route path={PageRoutes.login} element={<Login />} />
        </Route> */}

        {/* <Route element={<ProtectedRoute />}> */}
          <Route element={<Layout />}>
            {/* <Route path={PageRoutes.dashboardSettings} element={<Settings />} /> */}
            <Route
              path={PageRoutes.home}
              element={<Navigate to={PageRoutes.dashboard} replace />}
            />
            <Route
              path={"*"}
              element={<Navigate to={PageRoutes.dashboard} replace />}
            />
            <Route path={PageRoutes.dashboard} element={<Dashboard />} />
            {/* <Route path={PageRoutes.dashboardId} element={<Dashboard />} /> */}

            {/* <Route path={PageRoutes.settings} element={<Settings />} /> */}
            {/* <Route path={PageRoutes.dashboardSettings} element={<Settings />} /> */}
          </Route>
          {/* <Route path={PageRoutes.dashboardChatbot} element={<Chatbot />} /> */}
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
  );
};

export default RouterProvider;
