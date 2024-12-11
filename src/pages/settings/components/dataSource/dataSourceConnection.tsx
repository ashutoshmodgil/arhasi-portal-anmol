import { useGetDatasets } from '@/api/hooks/useGetDatasets';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, Globe } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import GetDatasets from './forms/getDatasets';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useDataSetColumnsStore from '@/store/useDataSetColumns';
import { toast } from '@/hooks/use-toast';

export type GetDatasetsFormValues = {
  projectName: string;
  serviceAccountNumber: string;
};

const DataSourceConnection = ({ dashboardId }: { dashboardId: string }) => {
  const [databaseType, setDatabaseType] = useState('postgresql');
  const {
    datasetNamesAccordingToDashboardId,
    setDatasetNamesAccordingToDashboardId,
  } = useDataSetColumnsStore();
  const { data: datasets } = useGetDatasets({
    enabled: true,
  });

  //   const { mutate: connectDB, isPending } = useConnectDB();

  const form1 = useForm<GetDatasetsFormValues>({
    defaultValues: {
      projectName: '',
      serviceAccountNumber: '',
    },
  });
  //   const form2 = useForm();
  //   const form3 = useForm();

  console.log({ databaseType });

  const handleSubmit = (data: GetDatasetsFormValues) => {
    console.log({ data });
  };

  //   const handleConnectDB = () => {
  //     connectDB({
  //       tableId: selectedTableId,
  //     });
  //   };

  const handleSelectDataset = (dataset: string) => {
    setDatasetNamesAccordingToDashboardId({
      ...datasetNamesAccordingToDashboardId,
      [dashboardId]: dataset,
    });

    toast({
      title: 'Dataset selected',
      description: 'Dataset selected successfully',
    });
  };

  return (
    <>
      <GetDatasets form={form1} handleSubmit={handleSubmit} />

      <div className='flex flex-col gap-2'>
        <p className='text-sm text-white'>
          Select the dataset you want to connect to
        </p>
        <Select onValueChange={handleSelectDataset}>
          <SelectTrigger className='text-base font-bold text-white w-full bg-transparent border-border-primary focus-visible:ring-0 focus-visible:ring-offset-0'>
            <SelectValue placeholder='Select dataset' />
          </SelectTrigger>
          <SelectContent>
            {datasets?.datasets.map((dataset: string) => (
              <SelectItem key={dataset} value={dataset}>
                {dataset}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* <Button
        variant='default'
        className='bg-primary text-white hover:bg-primary/80'
        onClick={handleConnectDB}
        disabled={isPending}
      >
        {isPending ? 'Connecting...' : 'Connect to database'}
      </Button> */}

      {/* <Input
            placeholder='Username and Password fields'
            className='bg-transparent border-border-primary focus-visible:ring-0 focus-visible:ring-offset-0  text-white'
        /> */}
      <div className='flex w-full gap-4'>
        <div className='flex items-center gap-2'>
          <h3 className='text-base font-bold'>Database Type</h3>
          <ChevronLeft className='h-4 w-4' />
        </div>
        <div className='flex items-center justify-between flex-1'>
          <RadioGroup
            defaultValue='postgresql'
            onValueChange={setDatabaseType}
            className='flex space-x-4 '
          >
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='mysql' id='mysql' />
              <Label htmlFor='mysql'>MySQL</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='postgresql' id='postgresql' />
              <Label htmlFor='postgresql'>PostgreSQL</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='sqlite' id='sqlite' />
              <Label htmlFor='sqlite'>SQLite</Label>
            </div>
          </RadioGroup>
          <Button variant='link' className='text-blue-500 p-0'>
            More
          </Button>
        </div>
      </div>

      <Separator
        orientation='horizontal'
        className='w-full bg-border-primary'
      />

      <div className='flex'>
        <div className='flex items-center '>
          <h3 className='text-base font-bold'>Persistence Settings</h3>
          <ChevronLeft className='h-4 w-4' />
        </div>
        <Separator orientation='vertical' className='h-full' />
        <div className='relative flex-1'>
          <Input
            placeholder='Lorem Ips'
            className='bg-transparent border-border-primary text-white pr-8 focus-visible:ring-0 focus-visible:ring-offset-0'
          />
          <Globe className='absolute right-2 top-2.5 h-4 w-4 text-gray-500' />
        </div>
      </div>
    </>
  );
};

export default DataSourceConnection;
