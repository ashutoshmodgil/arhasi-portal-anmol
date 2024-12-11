import useGetUserDashboards from '@/api/hooks/useGetUserDashboards';
import Billing from '@/assets/icons/billing.svg';
import OverView from '@/assets/icons/overview.svg';
import Subscriptions from '@/assets/icons/subscriptions.svg';
import LoginOrSignup from '@/assets/icons/loginorsignup.svg';
import Logo from '@/assets/logo.svg';
import ProductCard from '@/assets/productCard.png';
import ConfidentialityCard from '@/assets/confidentialityCard.png';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import PageRoutes from '@/routes/PageRoutes';
import { Home, Inbox, StepBack } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CreateDashboardModal from './createDashboardModal';
import DeleteDashboardModal from './DeleteDashboardModal';
import EditDashboardModal from './editDashboardModal';
import { Button } from './ui/button';

const footerItems = [
  {
    title: 'Notifications',
    url: '#',
    icon: Home,
  },
  {
    title: 'Settings',
    url: PageRoutes.settings,
    icon: Inbox,
  },
];

type DashboardTypes = {
  dashboard_id: string;
  user_id: string;
  dashboard_name: string;
  icon: string;
};

export function AppSidebar() {
  const navigate = useNavigate();

  const [openCreateDashboardModal, setOpenCreateDashboardModal] =
    useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState<{
    open: boolean;
    dashboardId: string;
  }>({
    open: false,
    dashboardId: '',
  });

  const [showEditModal, setShowEditModal] = useState<{
    open: boolean;
    dashboardId: string;
    dashboardName: string;
  }>({
    open: false,
    dashboardId: '',
    dashboardName: '',
  });

  const { data: userDashboards } = useGetUserDashboards();

  const userDashboardsList:DashboardTypes[] =[
    {
      dashboard_id: "1",
      user_id: "1",
      dashboard_name: "OverView",
      icon: OverView
  },
    {
      dashboard_id: "2",
      user_id: "2",
      dashboard_name: "Billing",
      icon: Billing
  },
    {
      dashboard_id: "3",
      user_id: "3",
      dashboard_name: "Subscriptions",
      icon: Subscriptions
  },
    {
      dashboard_id: "4",
      user_id: "4",
      dashboard_name: "Login or SignUp",
      icon: LoginOrSignup
  },

  ]
  const productList =[
    {
      dashboard_id: "1",
      user_id: "1",
      dashboard_name: "OverView",
      icon: ProductCard
  },
    {
      dashboard_id: "2",
      user_id: "2",
      dashboard_name: "Billing",
      icon: ConfidentialityCard
  },

  ]

  return (
    <>
      {openCreateDashboardModal && (
        <CreateDashboardModal
          open={openCreateDashboardModal}
          onClose={() => setOpenCreateDashboardModal(false)}
        />
      )}

      {showDeleteModal.open && (
        <DeleteDashboardModal
          open={showDeleteModal.open}
          dashboard_id={showDeleteModal.dashboardId}
          onClose={() => setShowDeleteModal({ open: false, dashboardId: '' })}
        />
      )}

      {showEditModal.open && (
        <EditDashboardModal
          open={showEditModal.open}
          dashboard_id={showEditModal.dashboardId}
          dashboard_name={showEditModal.dashboardName}
          onClose={() =>
            setShowEditModal({
              open: false,
              dashboardId: '',
              dashboardName: '',
            })
          }
        />
      )}

      <Sidebar className='bg-black border-primary-background'>
        <SidebarHeader className='mt-10 px-6'>
          <img src={Logo} alt='logo' className='h-8 w-8' />
        </SidebarHeader>
        <SidebarContent className='px-6 mt-4'>
          {/* <SidebarGroup>
            <SidebarGroupLabel className='text-[#7F8A8C]'>
              Add Dashboard
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className='py-6 bg-primary-background hover:bg-primary-background '
                  >
                    <div
                      className='flex items-center gap-2 cursor-pointer'
                      onClick={() => setOpenCreateDashboardModal(true)}
                    >
                      <Plus className='text-white' />
                      <span className='text-white'>Add Dashboard</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup> */}
          <SidebarGroup>
            <SidebarGroupLabel className='text-[#7F8A8C]'>
              Menu
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {userDashboardsList?.map((dashboard: DashboardTypes) => (
                  <SidebarMenuItem key={dashboard.dashboard_id}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        'hover:border-r-4  hover:bg-primary-background hover:border-red-700 py-6',
                        window.location.pathname.includes(
                          dashboard.dashboard_id
                        ) && 'border-r-4 border-red-700 bg-primary-background'
                      )}
                    >
                      <div className='flex gap-2 items-center'>
                      <img src={dashboard.icon} alt='billing' className='h-4 w-4' />
                        <span
                          onClick={() =>
                            navigate(
                              PageRoutes.dashboardId.replace(
                                ':dashboard_id',
                                dashboard.dashboard_id
                              )
                            )
                          }
                          className='text-white  cursor-pointer'
                        >
                          {dashboard.dashboard_name}
                        </span>

                        {/* <Trash2
                            className='text-primary cursor-pointer'
                            onClick={() =>
                              deleteDashboard(dashboard.dashboard_id)
                            }
                          /> */}

                        {/* <DropdownMenu>
                          <DropdownMenuTrigger className='z-50'>
                            <Ellipsis className='text-white cursor-pointer' />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() =>
                                setShowEditModal({
                                  open: true,
                                  dashboardId: dashboard.dashboard_id,
                                  dashboardName: dashboard.dashboard_name,
                                })
                              }
                            >
                             Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                //  navigate(`/settings/${dashboard.dashboard_id}`)
                                //  navigate(PageRoutes.settings)
                                navigate(
                                  PageRoutes.dashboardSettings.replace(
                                    ':dashboard_id',
                                    dashboard.dashboard_id
                                  )
                                )
                              }
                            >
                              Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                setShowDeleteModal({
                                  open: true,
                                  dashboardId: dashboard.dashboard_id,
                                })
                              }
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu> */}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          {/* <SidebarGroup>
            <SidebarGroupLabel className='text-[#7F8A8C]'>
              Product
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {productList?.map((dashboard: DashboardTypes) => (
                  <SidebarMenuItem key={dashboard.dashboard_id}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        'hover:border-r-4  hover:bg-primary-background hover:border-red-700 py-6',
                        window.location.pathname.includes(
                          dashboard.dashboard_id
                        ) && 'border-r-4 border-red-700 bg-primary-background'
                      )}
                    >
                      <div className='flex gap-2 items-center'>
                      <img src={dashboard.icon} alt='billing' className='h-12 w-12' />
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup> */}
        </SidebarContent>
        <SidebarFooter className='px-6 mb-10'>
          <SidebarGroup>
            <SidebarGroupLabel className='text-[#7F8A8C]'>
              More
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {footerItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className=' py-6 hover:bg-primary-background '
                    >
                      <Link to={item.url}>
                        <item.icon className='text-white' />
                        <span className='text-white'>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <Button
            variant='outline'
            className='rounded-full bg-primary-background hover:bg-primary-background'
          >
            <StepBack className='text-white' />
            <span className='text-white'>Close</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
