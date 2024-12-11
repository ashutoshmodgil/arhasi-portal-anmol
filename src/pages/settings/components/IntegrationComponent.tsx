import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ChevronDown, Search } from 'lucide-react';
import { useState } from 'react';

import RedisLogo from '@/assets/redis.png';
import Neo4jLogo from '@/assets/neo4j.png';
import GoogleCloudLogo from '@/assets/google-cloud.png';
import DatabricksLogo from '@/assets/data-bricks.png';
import AzureLogo from '@/assets/azure.png';
import AWSLogo from '@/assets/aws.png';

const integrations = [
  { name: 'Redis', icon: RedisLogo },
  {
    name: 'Google Cloud Platform',
    icon: GoogleCloudLogo,
  },
  { name: 'Neo4j', icon: Neo4jLogo },
  { name: 'AWS Cloud Platform', icon: AWSLogo },
  { name: 'Databricks', icon: DatabricksLogo },
  { name: 'Azure Cloud Platform', icon: AzureLogo },
];

export default function SelectIntegration() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Card className='w-full border-[#3D494A] bg-secondary text-white h-[250px]'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-2xl font-bold'>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className='flex items-center mr-16  focus:outline-none font-bold text-xl'
          >
            Select Integration <ChevronDown className=' h-4 w-4' />
          </button>
        </CardTitle>
        <div className='flex items-center space-x-2'>
          <div className='relative'>
            <Search className='absolute left-2 top-2.5 h-4 w-4 text-gray-500' />
            <Input
              placeholder='Search'
              className='pl-8 bg-[hsl(185,12%,20%)] border-none text-white placeholder-gray-500'
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                className='bg-[hsl(185,12%,20%)] border-none text-white'
              >
                All type <ChevronDown className='ml-2 h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Type 1</DropdownMenuItem>
              <DropdownMenuItem>Type 2</DropdownMenuItem>
              <DropdownMenuItem>Type 3</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      {isOpen && (
    <CardContent className='overflow-y-auto h-[120px] pt-2'>
    <div className='grid grid-cols-2 gap-2'>
      {integrations.map((integration, index) => (
        <div
          key={index}
          className='flex items-center justify-between bg-[hsl(185,12%,20%)] rounded-lg py-1.5 px-3'
        >
          <div className='flex items-center space-x-2'>
            <img
              src={integration.icon}
              alt={`${integration.name} icon`}
              className='w-6 h-6'
            />
            <span className='text-sm'>{integration.name}</span>
          </div>
          <Button variant='outline' size='sm' className='text-white text-xs px-2 py-0.5 h-6'>
            Details
          </Button>
        </div>
      ))}
    </div>
  </CardContent>
      )}
    </Card>
  );
}