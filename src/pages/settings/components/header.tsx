import { ArrowLeft, ChevronDown, Link, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate, useParams } from 'react-router-dom';

interface IProps{
  handleUploadImage:()=>void;
}
export default function SettingsHeader(props:IProps) {
  const navigate = useNavigate();
  const { dashboard_id = '' } = useParams();
  const handleGoBack = () => {
    navigate(`/dashboard/${dashboard_id}`);
  };
  return (
    <header className='flex items-center justify-between py-2'>
      <div className='flex items-center space-x-4'>
        <Button
          variant='outline'
          size='sm'
          className='text-white bg-[#1A2527] border-[#3D494A]'
          onClick={handleGoBack}
        >
          <ArrowLeft className='mr-2 h-4 w-4 text-border-primary' />
          Go Back
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='sm' className='text-white'>
              Dashboard Settings
              <ChevronDown className='ml-2 h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Option 1</DropdownMenuItem>
            <DropdownMenuItem>Option 2</DropdownMenuItem>
            <DropdownMenuItem>Option 3</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className='flex items-center space-x-2'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='outline'
              size='sm'
              className='bg-[#1A2527] text-white border-[#3D494A]'
            >
              Layout
              <ChevronDown className='ml-2 h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Layout 1</DropdownMenuItem>
            <DropdownMenuItem>Layout 2</DropdownMenuItem>
            <DropdownMenuItem>Layout 3</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant='outline'
          size='sm'
          className='bg-[#1A2527]  text-white border-[#3D494A]'
        >
          + Custom Settings
        </Button>
        <Button onClick={()=>{props.handleUploadImage()}}size='sm' className='bg-primary hover:bg-red-700 text-white'>
          Save
        </Button>
        <Button
          variant='outline'
          size='icon'
          className='text-border-primary bg-[#1A2527] border-[#3D494A]'
        >
          <Link className='h-4 w-4' />
        </Button>
        <Button
          variant='outline'
          size='icon'
          className='text-border-primary bg-[#1A2527] border-[#3D494A]'
        >
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </div>
    </header>
  );
}
