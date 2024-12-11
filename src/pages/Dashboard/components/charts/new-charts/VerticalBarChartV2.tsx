import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CalendarIcon, RefreshCcw, Share2 } from 'lucide-react';
import { useState } from 'react';
import { CiFilter } from 'react-icons/ci';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import DeleteChartButton from '../DeleteChartButton'; // Import the Delete button component

type dataTypes = {
  dashboard_id: string;
  chart_name: string;
  chart_type: string[];
  data_rows: Record<string, string | number>[];
  x_axis_columns: string[];
  y_axis_columns: string[];
};

const CustomLegend = ({ y_axis_columns }: { y_axis_columns: string[] }) => (
  <div className='flex gap-6 mb-6'>
    <div className='flex items-center gap-2'>
      <div className='w-2 h-2 rounded bg-red-500'></div>
      <span className='text-sm text-gray-300'>{y_axis_columns[0]}</span>
    </div>
    <div className='flex items-center gap-2'>
      <div className='w-2 h-2 rounded bg-gray-400'></div>
      <span className='text-sm text-gray-300'>{y_axis_columns[1]}</span>
    </div>
  </div>
);

export default function HorizontalStackedBarChartV2({
  data,
}: {
  data: dataTypes;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [chartName, setChartName] = useState(data?.chart_name);

  const handleNameSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      console.log({ chartName });
      // TODO: Add API call to update chart name
    }
  };

  // Handle delete logic
  const handleDelete = () => {
    // Implement your delete logic here
    console.log('Chart deleted');
    // You can use a callback to notify the parent component or implement any other action here
  };

  return (
    <Card className='bg-primary-background text-white w-full border border-[#3D494A]'>
      <CardHeader className='flex flex-row items-center justify-between px-4 py-2 border-b border-[#3D494A]'>
        <CardTitle
          className='text-lg font-bold text-white w-full'
          onClick={() => setIsEditing(true)}
        >
          {isEditing ? (
            <Input
              value={chartName}
              onChange={(e) => setChartName(e.target.value)}
              onKeyDown={handleNameSubmit}
              onBlur={() => setIsEditing(false)}
              className='bg-transparent outline-none border-none  ring-0 focus:ring-0 focus-visible:ring-offset-0 focus-visible:ring-0 focus:outline-none focus-visible:outline-none ring-transparent'
              autoFocus
            />
          ) : (
            <span className='cursor-pointer hover:text-gray-300'>
              {chartName}
            </span>
          )}
        </CardTitle>
        <div className='flex items-center gap-x-2'>
          {/* Commented out the calendar button */}
          {/* <Button
            variant='ghost'
            className='bg-secondary-background text-white'
          >
            <CalendarIcon className='w-4 h-4 mr-2' />
            Aug,20 → Present
          </Button> */}
          <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 bg-secondary-background"
                >
                  <RefreshCcw className="w-4 h-4" />
                </Button>
          <Button
            variant='ghost'
            size='sm'
            className=' bg-secondary-background text-gray-400'
          >
            <Share2 className='w-4 h-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            className=' bg-secondary-background text-gray-400'
          >
            <CiFilter className='w-4 h-4'/>
          </Button>
          {/* Add Delete button */}
          <DeleteChartButton dashboard_id={data.dashboard_id} chart_id={data._id} onDeleteSuccess={() => console.log("Deleted successfully")} />
        </div>
      </CardHeader>
      <CardContent className='pt-4'>
        <CustomLegend y_axis_columns={data.y_axis_columns} />
        <div className='h-[300px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              layout='vertical'
              data={data.data_rows}
              margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray='3 3'
                stroke='#333'
                horizontal={false}
                vertical={true}
              />
              <XAxis
                type='number'
                axisLine={false}
                tick={{ fill: '#ffffff' }}
                tickFormatter={(value) => `${value}`}
              />
              <YAxis
                type='category'
                dataKey={data.x_axis_columns[0]}
                axisLine={false}
                tick={{ fill: '#ffffff' }}
              />
              <Tooltip
                labelClassName='text-black'
                cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
              />
              <Bar
                dataKey={data.y_axis_columns[0]}
                fill='#FF0000'
                stackId={'a'}
              />
              <Bar
                stackId={'a'}
                dataKey={data.y_axis_columns[1]}
                fill='#666'
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
