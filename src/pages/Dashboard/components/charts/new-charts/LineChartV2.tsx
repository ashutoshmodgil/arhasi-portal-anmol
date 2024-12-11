import { Button } from '@/components/ui/button';
import { ChartTooltip } from '@/components/ui/chart';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useUpdateChartName from '@/api/hooks/useUpdateChartName';
import { Share2, Pin, RefreshCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { CiFilter } from 'react-icons/ci';
import DeleteChartButton from '../DeleteChartButton';
import FilterChartDialog from '@/components/filter-chart-dialog';

type DataTypes = {
  chart_name: string;
  chart_type: string[];
  dashboard_id: string;
  data_rows: Record<string, string | number>[];
  datasource_id: string;
  x_axis_columns: string[];
  y_axis_columns: string[];
  _id: string;
  pinned?: boolean;
};

export default function LineChartV2({
  data,
  pinned,
  onPin,
  compactMode = false,
}: {
  data: DataTypes;
  pinned?: boolean;
  onPin?: () => void;
  compactMode?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [chartName, setChartName] = useState(data.chart_name);
  const [showFilterChartModal, setShowFilterChartModal] = useState(false);
  const [chartData, setChartData] = useState(data); // Add state for chart data
  const { mutate: updateChartName } = useUpdateChartName();
  const fontSize = compactMode ? 10 : 12;
  const chartHeight = compactMode ? 200 : 300;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className='bg-[#2a2f35] p-4 rounded-lg shadow-lg border border-gray-700'>
          <p className='text-sm font-medium text-[#ccccccff] mb-1'>{label}</p>
          {payload.map((item: any, index: number) => (
            <div key={index} className='flex items-center gap-2'>
              <div
                className='w-2 h-2 rounded-full'
                style={{ backgroundColor: item.stroke }}
              />
              <p className='text-sm text-[#ccccccff]'>{item.dataKey}:</p>
              <p className='text-lg font-semibold text-white'>{item.value}</p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

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

  const handleFilterChart = () => {
    setShowFilterChartModal(true);
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
      <Card className='w-full bg-primary-background border border-[#3D494A]'>
        <CardHeader
          className='flex flex-row items-center justify-between px-2 py-1 border-b border-[#3D494A]'
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
          <div className='flex items-center gap-1'>
            {!compactMode && (
              <>
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
            {pinned && (
              <Button
                variant='ghost'
                size='sm'
                className='text-gray-400 bg-secondary-background p-1'
                onClick={onPin}
              >
                <Pin className='w-3 h-3' />
              </Button>
            )}
            <DeleteChartButton
              dashboard_id={data.dashboard_id}
              chart_id={data._id}
              onDeleteSuccess={() => console.log('Deleted successfully')}
            />
          </div>
        </CardHeader>

        <CardContent className='p-1'>
          <div className='flex gap-2 mb-2'>
            {chartData.y_axis_columns.map((col, index) => (
              <div key={col} className='flex items-center gap-1'>
                <div
                  className='w-2 h-2 rounded'
                  style={{
                    backgroundColor:
                      index === 1 ? 'hsl(0, 5%, 100%)' : 'hsl(0, 100%, 50%)',
                  }}
                />
                <span
                  className='text-xs'
                  style={{ color: '#ccccccff', fontSize }}
                >
                  {col}
                </span>
              </div>
            ))}
          </div>

          <div style={{ height: chartHeight }}>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart
                data={chartData.data_rows}
                margin={{
                  top: compactMode ? 5 : 10,
                  right: compactMode ? 20 : 30,
                  left: compactMode ? 20 : 30,
                  bottom: compactMode ? 5 : 20,
                }}
              >
                <CartesianGrid
                  strokeDasharray='3 3'
                  vertical={false}
                  stroke='rgba(255,255,255,0.1)'
                />
                <XAxis
                  dataKey={chartData.x_axis_columns[0]}
                  tick={{ fill: '#ccccccff', fontSize }}
                  label={
                    !compactMode
                      ? {
                          value: chartData.x_axis_columns[0],
                          style: { textAnchor: 'middle', fontSize },
                          position: 'bottom',
                          offset: 0,
                          fill: '#ccccccff',
                        }
                      : undefined
                  }
                />
                <YAxis
                  tick={{ fill: '#ccccccff', fontSize }}
                  tickFormatter={(value) => `${value}`}
                />
                <ChartTooltip
                  content={<CustomTooltip />}
                  contentStyle={{ fontSize }}
                />

                {chartData.y_axis_columns.map((key, index) => (
                  <Line
                    key={key}
                    type='monotone'
                    dataKey={key}
                    stroke={
                      index === 1 ? 'hsl(0, 5%, 100%)' : 'hsl(0, 100%, 50%)'
                    }
                    strokeWidth={compactMode ? 1.5 : 2}
                    dot={{
                      fill:
                        index === 1 ? 'hsl(0, 5%, 100%)' : 'hsl(0, 100%, 50%)',
                      r: compactMode ? 3 : 4,
                    }}
                    activeDot={{ r: compactMode ? 4 : 6 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </>
  );
}