import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronDown, MoreHorizontal, Search } from 'lucide-react';
import { useState } from 'react';
import DataSourceConnection from './dataSource/dataSourceConnection';

const dataSourcesTypes = [
  { value: 'api', label: 'API Connection' },
  { value: 'upload', label: 'Upload' },
  { value: 'database', label: 'Database Connection' },
];

export default function DataSourcesComponent({
  dashboardId,
}: {
  dashboardId: string;
}) {
  const [isOpen, setIsOpen] = useState(true);

  const [dataSourceType, setDataSourceType] = useState('database');

  return (
    <Card className='w-full bg-secondary text-white border-[#3D494A]'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-xl font-bold'>
          <Collapsible>
            <CollapsibleTrigger
              onClick={() => setIsOpen(!isOpen)}
              className='flex items-center font-bold text-xl'
            >
              Data Sources <ChevronDown className='ml-2 h-4 w-4' />
            </CollapsibleTrigger>
          </Collapsible>
        </CardTitle>
        <div className='flex items-center space-x-2'>
          <div className='relative ml-4'>
            <Search className='absolute left-2 top-3 h-4 w-4 text-border-primary' />
            <Input
              placeholder='Search'
              className='pl-8 bg-[hsl(185,12%,20%)] border-none text-white placeholder-border-primary focus-visible:ring-0 focus-visible:ring-offset-0 '
            />
          </div>
          <Button className='bg-primary hover:bg-red-700'>
            Add Data Source
          </Button>
        </div>
      </CardHeader>
      <Collapsible open={isOpen}>
        <CollapsibleContent>
          <CardContent className='space-y-4'>
            <Select defaultValue='database' onValueChange={setDataSourceType}>
              <SelectTrigger className='w-fit p-0 text-base font-bold text-white bg-transparent ring-0 border-none focus-visible:ring-0 focus-visible:ring-offset-0'>
                <SelectValue
                  placeholder='Select connection type'
                  className='text-base font-bold '
                />
              </SelectTrigger>
              <SelectContent>
                {dataSourcesTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {dataSourceType === 'database' && (
              <DataSourceConnection dashboardId={dashboardId} />
            )}
          </CardContent>
          <CardFooter className='flex justify-between'>
            <Button
              variant='secondary'
              className='bg-[hsl(185,12%,20%)] text-white hover:bg-[hsl(185,12%,24%)]'
            >
              Advanced Settings
            </Button>
            <div className='flex items-center space-x-2'>
              <Button
                variant='outline'
                className='bg-white text-black hover:bg-gray-200'
              >
                Cancel
              </Button>
              <Button variant='outline' size='icon'>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </div>
          </CardFooter>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
