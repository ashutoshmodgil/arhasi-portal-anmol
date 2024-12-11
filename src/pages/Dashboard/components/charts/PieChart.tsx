import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Share2, Pin, RefreshCcw } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { CiFilter } from 'react-icons/ci';
import { Input } from '@/components/ui/input';
import DeleteChartButton from './DeleteChartButton';
import FilterChartDialog from '@/components/filter-chart-dialog';
import useUpdateChartName from '@/api/hooks/useUpdateChartName';
import useRefreshChartData from '@/api/hooks/useRefreshChartData';

const COLORS = [
  '#eeeeee',
  '#595959',
  '#c10104',
  '#ffa6d2',
  '#ff6666',
  '#e50102',
  '#3a2f2f',
  '#ca3679',
  '#cccccc'
];

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

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className='bg-secondary-background p-3 rounded-lg border border-[#3D494A] shadow-lg'>
        <div className='text-white font-semibold mb-1'>{data.name}</div>
        <div className='text-white'>
          Value: {data.value}
        </div>
      </div>
    );
  }
  return null;
};

const PortfolioPieChart = ({
  data: initialData,
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
  const [chartName, setChartName] = useState(initialData?.chart_name || 'Default Chart Name');
  const [showFilterChartModal, setShowFilterChartModal] = useState(false);
  const [chartData, setChartData] = useState(initialData);
  const { mutate: refreshChart, isPending: isRefreshing } = useRefreshChartData();

  const { mutate: updateChartName } = useUpdateChartName();
  
  const handleNameSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      updateChartName({
        dashboard_id: initialData.dashboard_id,
        chart_id: initialData._id,
        chart_name: chartName,
      });
      setIsEditing(false);
    }
  };

  const handleNameBlur = () => {
    if (chartName !== initialData.chart_name) {
      updateChartName({
        dashboard_id: initialData.dashboard_id,
        chart_id: initialData._id,
        chart_name: chartName,
      });
    }
    setIsEditing(false);
  };

  const handleRefresh = () => {
    refreshChart(
      { chart_id: initialData._id },
      {
        onSuccess: (newData) => {
          setChartData(newData);
        },
      }
    );
  };

  if (!chartData?.data_rows) {
    return (
      <Card className='bg-primary-background border border-[#3D494A] text-white'>
        <CardContent className='flex items-center justify-center' style={{ height: compactMode ? 200 : 400 }}>
          <p>No data available</p>
        </CardContent>
      </Card>
    );
  }

  const labelField = chartData.x_axis_columns[0];
  const valueField = chartData.y_axis_columns[0];
  const transformedChartData = chartData.data_rows.map((item, index) => ({
    name: item[labelField],
    value: Number(item[valueField]),
    color: COLORS[index % COLORS.length],
  }));

  const outerRadius = compactMode ? 80 : 120;
  const innerRadius = compactMode ? 40 : 60;
  const fontSize = compactMode ? 10 : 12;
  const chartHeight = compactMode ? 200 : 300;

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
      <Card className='bg-primary-background border border-[#3D494A] text-white'>
        <CardHeader className={`flex flex-row items-center justify-between px-4 ${compactMode ? 'py-1' : 'py-2'} border-b border-[#3D494A]`}>
          <CardTitle
            className={`text-${compactMode ? 'base' : 'lg'} font-bold text-white w-full`}
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
          <div className='flex items-center gap-2'>
            {!compactMode && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 bg-secondary-background"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  <RefreshCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
                <Button variant='ghost' size='sm' className='bg-secondary-background text-gray-400'>
                  <Share2 className='w-4 h-4' />
                </Button>
                <Button 
                  variant='ghost' 
                  size='sm' 
                  className='bg-secondary-background text-gray-400'
                  onClick={() => setShowFilterChartModal(true)}
                >
                  <CiFilter className='w-4 h-4'/>
                </Button>
              </>
            )}
            {pinned && (
              <Button variant='ghost' size='sm' className='text-gray-400 bg-secondary-background' onClick={onPin}>
                <Pin className='w-4 h-4' />
              </Button>
            )}
            <DeleteChartButton 
              dashboard_id={chartData.dashboard_id} 
              chart_id={chartData._id} 
              onDeleteSuccess={() => console.log("Deleted successfully")} 
            />
          </div>
        </CardHeader>

        <div className={`flex flex-wrap gap-2 p-4 border-b border-[#3D494A]`}>
          {transformedChartData.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-sm text-gray-300" style={{ fontSize }}>{entry.name}</span>
            </div>
          ))}
        </div>

        <CardContent className="p-1">
          <div style={{ height: chartHeight }}>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie
                  data={transformedChartData}
                  dataKey='value'
                  nameKey='name'
                  cx='50%'
                  cy='50%'
                  outerRadius={outerRadius}
                  innerRadius={innerRadius}
                  paddingAngle={2}
                >
                  {transformedChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke='rgba(0,0,0,0.2)'
                      strokeWidth={compactMode ? 0.5 : 1}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default PortfolioPieChart;