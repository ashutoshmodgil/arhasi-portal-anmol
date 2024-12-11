import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
  return (
    <SidebarProvider className='bg-white'>
      <AppSidebar />
      <main className='flex flex-col w-full relative'>
        <Header />
        {/* <ModeToggle /> */}
        <Outlet />
      </main>
    </SidebarProvider>
  );
};

export default Layout;
