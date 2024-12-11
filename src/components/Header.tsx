import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import useDataSetColumnsStore from '@/store/useDataSetColumns';
import useUserStore from '@/store/userStore';
import { Bot, ChevronDown, Search, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
// import { SidebarTrigger } from './ui/sidebar';

export default function Header() {
  const { user, logout } = useUserStore();
  const { emptyData } = useDataSetColumnsStore();
  const [search, setSearch] = useState('');

  const handleLogout = () => {
    emptyData();
    logout();
  };

  return (
    <header className='bg-white text-white p-4 w-full'>
      {/* <SidebarTrigger /> */}
      <div className='container mx-auto flex items-center justify-between'>
        <div className='flex w-full'>
          <div className='flex items-center space-x-4'>
            <span className='text-red-500 text-2xl font-bold mt-auto'>
              &raquo;
            </span>
            <div>
            <div className='text-xs text-gray-500'>Account Management</div>
            <div className='text-lg font-semibold text-black'>Arhasi Portal<span className='text-lg font-semibold text-red-500'>.</span></div>

            </div>
          </div>

          <div className='flex-1 max-w-md mx-4'>
            <div className='relative'>
              <div className='absolute left-2 top-3'>
                <Search className='h-4 w-4 text-[#7F8A8C]' />
              </div>
              <Input
                type='search'
                placeholder='Search'
                className='w-full pl-7 f text-[#7F8A8C] bg-[#B4C0C217] border-gray-700'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className='absolute right-2 top-2 bg-[#FFFFFF] rounded-md p-1 shadow'>
                <SlidersHorizontal className='h-4 w-4 text-[#7F8A8C]' />
              </div>
            </div>
          </div>
          <Button
            variant='outline'
            className='bg-[#FFFFFF] border-[#3D494A]'
            onClick={() => {
              alert(search);
            }}
          >
            <Bot className='h-4 w-4' />
            Search with AI
          </Button>
        </div>

        <div className='flex items-center space-x-4'>
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className='hover:bg-transparent hover:text-white'
            >
              <Button variant='ghost' className='flex items-center space-x-2'>
                <Avatar className='h-8 w-8 '>
                  <AvatarImage
                    src='/placeholder.svg?height=32&width=32'
                    alt='Matt Andrew'
                  />
                  <AvatarFallback className='bg-[#3D494A] hover:bg-transparent '>
                    MA
                  </AvatarFallback>
                </Avatar>
                <div className='text-left '>
                  <div className='text-sm font-medium '>
                    {user.user_firstname}
                  </div>
                  <div className='text-xs text-gray-400 '>
                    {user.user_email}
                  </div>
                </div>
                <ChevronDown className='h-4 w-4 text-gray-400' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
