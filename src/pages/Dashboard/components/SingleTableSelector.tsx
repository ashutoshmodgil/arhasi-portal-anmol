import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import useGetDatasetsTables from '@/api/hooks/useGetDatasettables';
import useDataSetColumnsStore from '@/store/useDataSetColumns';
import useGetDatasetColumns from '@/api/hooks/useGetDatasetColumns';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useParams } from 'react-router-dom';

const SingleTableSelector = () => {
  const [selectedTableId, setSelectedTableId] = useState('');
  const { dashboard_id = '' } = useParams();
  const { datasetNamesAccordingToDashboardId, setDataSourceColumns } =
    useDataSetColumnsStore();

  const datasetName = datasetNamesAccordingToDashboardId[dashboard_id];
  const { data: tables } = useGetDatasetsTables(datasetName);

  const {
    data: columns,
    isSuccess,
    isLoading,
  } = useGetDatasetColumns({
    tableId: selectedTableId,
  });

  const handleTableChange = (value: string) => {
    setSelectedTableId(value);
  };

  useEffect(() => {
    if (isSuccess && columns?.columns.length > 0) {
      setDataSourceColumns({
        datasetName,
        tableId: selectedTableId,
        columns: columns.columns,
      });
    }
  }, [isSuccess, columns]);

  const loading = isLoading;

  return (
    <div>
      {tables?.tables.length > 0 && (
        <div className='flex flex-col gap-2'>
          <p className='text-sm text-white'>
            Select the table you want to connect to
          </p>
          <Select onValueChange={handleTableChange}>
            <SelectTrigger
              disabled={loading}
              className='relative text-base font-bold text-white w-full bg-transparent border-border-primary focus-visible:ring-0 focus-visible:ring-offset-0'
            >
              <SelectValue placeholder='Select dataset table' />
              {loading && (
                <div className='absolute bg-primary-background right-2 top-[5px] z-50 rounded-full p-1'>
                  <Loader2 className='h-5 w-5 animate-spin' />
                </div>
              )}
            </SelectTrigger>
            <SelectContent>
              {tables?.tables.map(
                (table: { id: string; table_name: string }) => (
                  <SelectItem key={table.id} value={table.id}>
                    {table.table_name}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default SingleTableSelector;
