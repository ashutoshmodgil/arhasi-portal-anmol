import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CalendarIcon, Pin, RefreshCcw, Share2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import { CiFilter } from 'react-icons/ci';
import FilterChartDialog from '@/components/filter-chart-dialog';
import useUpdateChartName from '@/api/hooks/useUpdateChartName';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Label,
} from 'recharts';
import DeleteChartButton from './DeleteChartButton'; // Ensure the path is correct for the DeleteChartButton

type dataTypes = {
  _id: string;
  dashboard_id: string;
  chart_name: string;
  chart_type: string[];
  data_rows: Record<string, string | number>[];
  x_axis_columns: string[];
  y_axis_columns: string[];
  pinned?: boolean;
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active: boolean;
  payload: {
    value: number;
    name: string;
  }[];
  label: string;
}) => {
 
  if (active && payload && payload.length) {
    return (
      <div className='bg-[#2a2a2a] p-3 rounded-lg border border-[#3a3a3a] shadow-lg'>
        <div className='text-sm text-gray-300 font-semibold mb-2 border-b border-[#3a3a3a] pb-2'>
          {label}
        </div>
        <div className='flex justify-between items-center gap-2 mb-2'>
          <div className='text-sm text-gray-400'>{payload[0].name}</div>
          <div className='text-lg font-semibold text-white'>
            {payload[0].value}
          </div>
        </div>
        <div className='flex justify-between gap-2 items-center'>
          <div className='text-sm text-gray-400'>{payload[1].name}</div>
          <div className='text-white text-lg'>{payload[1].value}</div>
        </div>
      </div>
    );
  }
  return null;
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

const calculateAxisDomain = (data: Record<string, string | number>[], key: string) => {
  const values = data.map(item => Number(item[key]));
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const padding = (maxValue - minValue) * 0.1;
  return [Math.floor(minValue), Math.ceil(maxValue + padding)];
};

const generateTicks = (min: number, max: number, tickCount = 5) => {
  const step = (max - min) / (tickCount - 1);
  return Array.from({ length: tickCount }, (_, i) => Math.round(min + step * i));
};

const BiaxialBarChart = ({
  data,
  pinned,
  onPin,
  compactMode = false,
}: {
  data: dataTypes;
  pinned?: boolean;
  onPin?: () => void;
  compactMode?: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [chartName, setChartName] = useState(data?.chart_name);
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
  const handleFilterChart = () => {
    setShowFilterChartModal(true);
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

  const leftAxisConfig = useMemo(() => {
    const [min, max] = calculateAxisDomain(data.data_rows, data.y_axis_columns[0]);
    return { domain: [min, max], ticks: generateTicks(min, max) };
  }, [data.data_rows, data.y_axis_columns]);

  const rightAxisConfig = useMemo(() => {
    const [min, max] = calculateAxisDomain(data.data_rows, data.y_axis_columns[1]);
    return { domain: [min, max], ticks: generateTicks(min, max) };
  }, [data.data_rows, data.y_axis_columns]);

  const fontSize = compactMode ? 10 : 12;
  const chartHeight = compactMode ? 200 : 300;

  const handleDelete = () => {
    console.log("Chart deleted"); // Add your deletion logic here
    // For example, you could call an API to delete the chart
  };

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
    <Card className='bg-primary-background text-white w-full border border-[#3D494A]'>
      <CardHeader className={`flex flex-row items-center justify-between px-2 py-1 border-b border-[#3D494A]`}>
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
        <div className='flex items-center gap-1'>
          {!compactMode && (
            <>
              {/* The "Aug, 20 → Present" Button is commented out */}
              {/* <Button variant='ghost' className='bg-secondary-background text-white'>
                <CalendarIcon className='w-4 h-4 mr-2' />Aug,20 → Present
              </Button> */}
              <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 bg-secondary-background"
                >
                  <RefreshCcw className="w-4 h-4" />
                </Button>
              <Button variant='ghost' size='sm' className='bg-secondary-background text-gray-400'>
                <Share2 className='w-4 h-4' />
              </Button>
              <Button variant='ghost' size='sm' className='bg-secondary-background text-gray-400'
              onClick={handleFilterChart}>
                <CiFilter className='w-4 h-4'/>
              </Button>
            </>
          )}
          {pinned && (
            <Button variant='ghost' size='sm' className='text-gray-400 bg-secondary-background p-1' onClick={onPin}>
              <Pin className='w-3 h-3' />
            </Button>
          )}
          {/* Add Delete Button */}
          <DeleteChartButton dashboard_id={data.dashboard_id} chart_id={data._id} onDeleteSuccess={() => console.log("Deleted successfully")} />
        </div>
      </CardHeader>
      <CardContent className='p-1'>
        <div className='flex gap-2 mb-2'>
          {chartData.y_axis_columns.map((col, index) => (
            <div key={col} className='flex items-center gap-1'>
              <div className='w-2 h-2 rounded' style={{ backgroundColor: index === 0 ? '#FF0000' : '#666' }}></div>
              <span className='text-xs text-gray-300' style={{ fontSize }}>{col}</span>
            </div>
          ))}
        </div>
        <div style={{ height: chartHeight }}>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              data={chartData.data_rows}
              margin={{ 
                top: compactMode ? 5 : 10, 
                right: compactMode ? 25 : 30, 
                left: compactMode ? 25 : 30, 
                bottom: compactMode ? 5 : 10 
              }}
            >
              <CartesianGrid strokeDasharray='3 3' stroke='#333' horizontal vertical={false} />
              <XAxis
                dataKey={chartData.x_axis_columns[0]}
                axisLine={true}
                tick={{ fill: 'white', fontSize }}
              />
              <YAxis
                axisLine={true}
                tick={{ fill: 'white', fontSize }}
                ticks={leftAxisConfig.ticks}
                domain={leftAxisConfig.domain}
                tickFormatter={(value) => `${value}`}
                yAxisId='left'
              >
                {!compactMode && (
                  <Label
                    value={chartData.y_axis_columns[0]}
                    angle={-90}
                    position='insideLeft'
                    style={{ fill: 'white', fontSize }}
                  />
                )}
              </YAxis>
              <YAxis
                axisLine={true}
                tick={{ fill: 'white', fontSize }}
                orientation='right'
                ticks={rightAxisConfig.ticks}
                domain={rightAxisConfig.domain}
                tickFormatter={(value) => `${value}`}
                yAxisId='right'
              >
                {!compactMode && (
                  <Label
                    value={chartData.y_axis_columns[1]}
                    angle={90}
                    position='insideRight'
                    style={{ fill: 'white', fontSize }}
                  />
                )}
              </YAxis>
              <Tooltip content={<CustomTooltip label={chartData.x_axis_columns[0]} />} />
              <CustomLegend y_axis_columns={data.y_axis_columns} />
              <Bar
                dataKey={chartData.y_axis_columns[0]}
                fill='#FF0000'
                radius={5}
                barSize={compactMode ? 6 : 10}
                yAxisId='left'
              />
              <Bar
                dataKey={chartData.y_axis_columns[1]}
                fill='#666'
                radius={5}
                barSize={compactMode ? 6 : 10}
                yAxisId='right'
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
    </>
  );
};

export default BiaxialBarChart;
