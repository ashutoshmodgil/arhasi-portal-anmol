import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {  Pin, RefreshCcw, Share2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import useUpdateChartName from '@/api/hooks/useUpdateChartName';
import useRefreshChartData from '@/api/hooks/useRefreshChartData';
import { CiFilter } from 'react-icons/ci';
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Label,
} from 'recharts';
import DeleteChartButton from './DeleteChartButton'; // Make sure this path is correct
import FilterChartDialog from '@/components/filter-chart-dialog';

type dataTypes = {
  chart_name: string;
  _id: string;
  dashboard_id: string;
  chart_type: string[];
  datasource_id: string;
  data_rows: Record<string, string | number>[];
  x_axis_columns: string[];
  y_axis_columns: string[];
  pinned?: boolean;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className='bg-secondary-background p-3 rounded-lg border border-[#3D494A] shadow-lg'>
        <div className='text-white font-semibold mb-1'>{label}</div>
        {payload.map((entry: any, index: number) => (
          <div key={index} className='text-white'>
            {entry.name.replace(/_/g, ' ')}: {entry.value}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function LineChartV1({
  data,
  pinned,
  onPin,
  compactMode = false,
}: {
  data: dataTypes;
  pinned?: boolean;
  onPin?: () => void;
  compactMode?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [chartName, setChartName] = useState(data.chart_name);
  const { mutate: refreshChart, isPending: isRefreshing } = useRefreshChartData();
 

  const [chartData, setChartData] = useState(data);

  const [showFilterChartModal, setShowFilterChartModal] = useState(false);
  const { mutate: updateChartName } = useUpdateChartName();
  const handleNameSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      updateChartName({
        dashboard_id: data.dashboard_id,
        chart_id: data._id,
        chart_name: chartName,
      });
      setIsEditing(false);
    }
  };
  const handleNameBlur = () => {
    if (chartName !== data.chart_name) {
      updateChartName({
        dashboard_id: data.dashboard_id,
        chart_id: data._id,
        chart_name: chartName,
      });
    }
    setIsEditing(false);
  };
  // const handleDelete = () => {
  //   console.log('Chart deleted'); // Add your deletion logic here
  //   // For example, you could call an API to delete the chart
  // };

  const handleRefresh = () => {
    refreshChart(
      { chart_id: data._id },
      {
        onSuccess: (newData) => {
          setChartData(newData);
        },
      }
    );
  };

  const values = useMemo(
    () =>
      chartData.data_rows.map((item) =>
        Number(item[chartData.y_axis_columns[0]])
      ),
    [chartData]
  );

  const minValue = 0;
  const maxValue = useMemo(
    () => Math.ceil(Math.max(...values) * 1.05),
    [values]
  );

  const formatAxisLabel = (label: string) => {
    return label
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .trim();
  };

  const chartHeight = compactMode ? 250 : 400;
  const fontSize = compactMode ? 10 : 12;
  const padding = compactMode ? 3 : 6;
  const dotRadius = compactMode ? 6 : 8;

  const handleFilterChart = () => {
    setShowFilterChartModal(true);
  };

  console.log({ chartData });

  return (
    <>
      {showFilterChartModal && (
        <FilterChartDialog
          onClose={() => setShowFilterChartModal(false)}
          open
          dataRows={chartData.data_rows}
          chartId={chartData._id}
          setChartData={setChartData}
        />
      )}

      <Card className='w-full bg-primary-background text-white border border-[#3D494A]'>
        <CardHeader
          className={`flex flex-row items-center justify-between px-4 py-${
            compactMode ? 1 : 2
          } border-b border-[#3D494A]`}
        >
         
           <CardTitle
           className={`text-${
             compactMode ? 'base' : 'lg'
           } font-bold text-white w-full`}
           onClick={() => setIsEditing(true)}
         >
           {isEditing ? (
             <Input
               value={chartName}
               onChange={(e) => setChartName(e.target.value)}
               onKeyDown={handleNameSubmit}
               onBlur={handleNameBlur}
               className='bg-transparent outline-none border-none ring-0 focus:ring-0 focus-visible:ring-offset-0 focus-visible:ring-0 focus:outline-none focus-visible:outline-none ring-transparent'
               autoFocus
             />
           ) : (
             <span className='cursor-pointer hover:text-gray-300'>
               {chartName}
             </span>
           )}
         </CardTitle>
          <div className='flex items-center gap-x-2'>
            {!compactMode && (
              <>
                  <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 bg-secondary-background"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  <RefreshCcw className={`w-6 h-6 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-gray-400 bg-secondary-background'
                >
                  <Share2 className='w-4 h-4' />
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-gray-400 bg-secondary-background'
                  onClick={handleFilterChart}
                >
                  <CiFilter className='w-4 h-4' />
                </Button>
              </>
            )}
            {pinned ? (
              <Button
                variant='ghost'
                size='sm'
                className='text-gray-400 bg-secondary-background'
                onClick={onPin}
              >
                <Pin className='w-4 h-4' />
              </Button>
            ) : null}
            {/* Add Delete Button */}
            <DeleteChartButton
              dashboard_id={chartData.dashboard_id}
              chart_id={chartData._id}
              onDeleteSuccess={() => console.log('Deleted successfully')}
            />
          </div>
        </CardHeader>
        <CardContent className='p-1'>
          <div style={{ height: compactMode ? '250px' : '300px' }}>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart
                data={chartData.data_rows}
                margin={{
                  top: compactMode ? 5 : 10,
                  right: compactMode ? 5 : 10,
                  left: compactMode ? 5 : 10,
                  bottom: compactMode ? 50 : 60
                }}
              >
                <CartesianGrid strokeDasharray='3 3' stroke='#333' />
                <XAxis
                  dataKey={chartData.x_axis_columns[0]}
                  tick={{ fill: 'white', fontSize }}
                  axisLine={{ stroke: 'white' }}
                  tickLine={{ stroke: 'white' }}
                >
                  <Label
                    value={formatAxisLabel(chartData.x_axis_columns[0])}
                    position='insideBottom'
                    offset={compactMode ? -10 : -15}
                    fill='white'
                    style={{ fontSize: `${fontSize}px` }}
                  />
                </XAxis>
                <YAxis
                  domain={[minValue, maxValue]}
                  tick={{ fill: 'white', fontSize }}
                  axisLine={{ stroke: 'white' }}
                  tickLine={{ stroke: 'white' }}
                  tickFormatter={(value) => `${value}`}
                >
                  <Label
                    value={formatAxisLabel(chartData.y_axis_columns[0])}
                    position='insideLeft'
                    angle={-90}
                    offset={0}
                    fill='white'
                    style={{ fontSize: `${fontSize}px` }}
                  />
                </YAxis>
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type='monotone'
                  dataKey={chartData.y_axis_columns[0]}
                  stroke='#C10104'
                  strokeWidth={compactMode ? 1.5 : 2}
                  dot={{ fill: '#C10104', strokeWidth: compactMode ? 1.5 : 2 }}
                  activeDot={{ r: dotRadius }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
