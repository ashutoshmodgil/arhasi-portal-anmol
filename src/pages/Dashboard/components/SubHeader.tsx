import Dots from '@/assets/icons/dots.svg';
import Vector from '@/assets/icons/vector.svg';
import { DatePicker } from '@/components/datePicker';
import useDataSetColumnsStore from '@/store/useDataSetColumns';
import useUserStore from '@/store/userStore';
import { useState } from 'react';
// import { SidebarTrigger } from './ui/sidebar';

export default function SubHeader() {
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
            
            <div>
            <div className='text-lg font-semibold text-black'><span className='text-red-500 text-2xl font-bold mt-auto'>
            &#128075;
            </span>Welcome, Matt!</div>
            <div className='text-xs text-gray-500'>Here's the current updates for today.</div>

            </div>
          </div>

          {/* <div className='flex-1 max-w-md mx-4'>
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
          </div> */}
          {/* <Button
            variant='outline'
            className='bg-[#FFFFFF] border-[#3D494A]'
            onClick={() => {
              alert(search);
            }}
          >
            <Bot className='h-4 w-4' />
            Search with AI
          </Button> */}
        </div>

        <div className='flex items-center space-x-4'>
        <DatePicker/>
        <button type="button" onClick={()=>{}} className="p-2 px-4 bg-red-600 hover:bg-red-700 hover:underline text-white rounded font-bold whitespace-nowrap">Save</button>
        <img className="border rounded p-3" src={Vector} alt="three dots" />
        <img className="border rounded p-3" src={Dots} alt="three dots" />
        </div>
      </div>
    </header>
  );
}
