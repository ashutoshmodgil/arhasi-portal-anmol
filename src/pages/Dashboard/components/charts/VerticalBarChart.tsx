import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Share2, Pin, RefreshCcw } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { CiFilter } from 'react-icons/ci';
import DeleteChartButton from './DeleteChartButton';
import FilterChartDialog from '@/components/filter-chart-dialog';
import useUpdateChartName from '@/api/hooks/useUpdateChartName';
import useRefreshChartData from '@/api/hooks/useRefreshChartData';

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

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className='bg-secondary-background p-3 rounded-lg border border-[#3D494A] shadow-lg'>
        <div className='flex gap-2 items-center'>
          <span className='text-white'>{label}</span>
          <span className='text-white font-semibold'>{payload[0].value}</span>
        </div>
      </div>
    );
  }
  return null;
};

const AssetClassBreakdown = ({
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
  const [dateRange] = useState('Aug,20 → Present');
  const [isEditing, setIsEditing] = useState(false);
  const [chartName, setChartName] = useState(data?.chart_name);
  const [chartData, setChartData] = useState(data);
  const [showFilterChartModal, setShowFilterChartModal] = useState(false);
  const { mutate: refreshChart, isPending: isRefreshing } = useRefreshChartData();

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

  const handleFilterChart = () => {
    setShowFilterChartModal(true);
  };

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

  if (!data?.data_rows || !data.x_axis_columns || !data.y_axis_columns) {
    return (
      <Card className='bg-[#1a2b2b] border border-[#3D494A] text-white w-full'>
        <CardContent className='flex items-center justify-center h-[250px]'>
          <p>No data available</p>
        </CardContent>
      </Card>
    );
  }

  const xAxisKey = data.x_axis_columns[0];
  const yAxisKey = data.y_axis_columns[0];
  const values = data.data_rows.map(item => Number(item[yAxisKey]));
  const minValue = 0;
  const maxValue = Math.ceil(Math.max(...values) * 1.05);

  const formatAxisLabel = (label: string) => {
    return label
      .replace(/_/g, ' ')
      .replace(/\([^)]*\)/g, '')
      .replace(/([A-Z])/g, ' $1')
      .trim();
  };

  const chartHeight = compactMode ? 250 : 400;
  const fontSize = compactMode ? 10 : 12;
  const barSize = compactMode ? 15 : 20;

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
      <Card className='bg-[#1a2b2b] border border-[#3D494A] text-white w-full'>
        <CardHeader className={`flex flex-row items-center justify-between px-4 py-${compactMode ? 1 : 2} border-b border-[#3D494A]`}>
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
                  <RefreshCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
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
                className='text-gray-400 bg-secondary-background'
                onClick={onPin}
              >
                <Pin className='w-4 h-4' />
              </Button>
            )}
            <DeleteChartButton
              dashboard_id={data.dashboard_id}
              chart_id={data._id}
              onDeleteSuccess={() => console.log("Deleted successfully")}
            />
          </div>
        </CardHeader>
        <CardContent className="p-1">
          <div style={{ height: `${chartHeight}px` }}>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart
                data={chartData.data_rows}
                margin={{ 
                  top: compactMode ? 10 : 20, 
                  right: compactMode ? 20 : 30, 
                  left: compactMode ? 40 : 50, 
                  bottom: compactMode ? 20 : 30 
                }}
                barSize={barSize}
              >
                <CartesianGrid strokeDasharray='3 3' stroke='#333' horizontal vertical={false} />
                <XAxis
                  dataKey={xAxisKey}
                  axisLine={{ stroke: 'white' }}
                  tickLine={{ stroke: 'white' }}
                  tick={{ fill: 'white', fontSize }}
                >
                  <Label
                    value={formatAxisLabel(xAxisKey)}
                    position="insideBottom"
                    offset={compactMode ? -10 : -15}
                    fill="white"
                    style={{ fontSize: `${fontSize}px` }}
                  />
                </XAxis>
                <YAxis
                  domain={[minValue, maxValue]}
                  axisLine={{ stroke: 'white' }}
                  tickLine={{ stroke: 'white' }}
                  tick={{ fill: 'white', fontSize }}
                  tickFormatter={(value) => `${value}`}
                >
                  <Label
                    value={formatAxisLabel(yAxisKey)}
                    position="insideLeft"
                    angle={-90}
                    offset={0}
                    fill="white" 
                    style={{ fontSize: `${fontSize}px` }}
                  />
                </YAxis>
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }} />
                <Bar 
                  dataKey={yAxisKey} 
                  fill='#C10104' 
                  radius={[compactMode ? 3 : 4, compactMode ? 3 : 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default AssetClassBreakdown;