import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CalendarIcon, Share2, Pin, RefreshCcw } from 'lucide-react';
import { useState } from 'react';
import { CiFilter } from 'react-icons/ci';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import DeleteChartButton from "../DeleteChartButton";
import FilterChartDialog from '@/components/filter-chart-dialog';
import useUpdateChartName from '@/api/hooks/useUpdateChartName';
import useRefreshChartData from '@/api/hooks/useRefreshChartData';

type DataTypes = {
  chart_name: string;
  dashboard_id: string;
  _id: string;
  chart_type: string[];
  data_rows: Record<string, string | number>[];
  x_axis_columns: string[];
  y_axis_columns: string[];
  pinned?: boolean;
};

const colorScheme = [
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

export default function StackedBarChartV2({
  data,
  pinned,
  onPin,
  compactMode = false,
  onDelete
}: {
  data: DataTypes;
  pinned?: boolean;
  onPin?: () => void;
  compactMode?: boolean;
  onDelete: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [chartName, setChartName] = useState(data.chart_name);
  const [chartData, setChartData] = useState(data);
  const [showFilterChartModal, setShowFilterChartModal] = useState(false);
  const { mutate: updateChartName } = useUpdateChartName();
  const { mutate: refreshChart, isPending: isRefreshing } = useRefreshChartData();

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

  function processData() {
    return chartData.data_rows.map(row => ({
      [chartData.x_axis_columns[0]]: row[chartData.x_axis_columns[0]],
      category: row[chartData.x_axis_columns[0]],
      ...Object.fromEntries(
        Object.entries(row)
          .filter(([key, value]) => key !== chartData.x_axis_columns[0] && Number(value) > 0)
      )
    }));
  }

  function getDataKeys(data: any[], xAxisKey: string) {
    return Array.from(
      new Set(
        data.flatMap(item =>
          Object.keys(item).filter(key => 
            key !== xAxisKey && 
            key !== 'category' &&
            data.some(row => Number(row[key]) > 0)
          )
        )
      )
    );
  }

  const processedData = processData();
  const uniqueCategories = [...new Set(processedData.map(d => d.category))];
  const dataKeys = getDataKeys(processedData, chartData.x_axis_columns[0]);
  const fontSize = compactMode ? 10 : 12;

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
      <Card className="bg-[#1a2b2b] text-white w-full border border-[#3D494A]">
        <CardHeader className={`flex flex-row items-center justify-between px-2 py-1 border-b border-[#3D494A]`}>
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
          <div className="flex items-center gap-1">
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
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-400 bg-secondary-background"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-400 bg-secondary-background"
                  onClick={handleFilterChart}
                >
                  <CiFilter className="w-4 h-4"/>
                </Button>
              </>
            )}
            {pinned && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-400 bg-secondary-background p-1" 
                onClick={onPin}
              >
                <Pin className="w-3 h-3" />
              </Button>
            )}
            <DeleteChartButton 
              dashboard_id={data.dashboard_id} 
              chart_id={data._id} 
              onDeleteSuccess={() => console.log("Deleted successfully")} 
            />
          </div>
        </CardHeader>

        <div className={`flex flex-wrap gap-2 px-2 py-1 border-b border-[#3D494A]`}>
          {uniqueCategories.map((category, index) => (
            <div key={index} className="flex items-center gap-1">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: colorScheme[index % colorScheme.length] }} 
              />
              <span className="text-xs" style={{ color: '#ccccccff', fontSize }}>
                {category}
              </span>
            </div>
          ))}
        </div>

        <CardContent className="p-1">
          <div style={{ height: compactMode ? '200px' : '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={processedData}
                margin={{ 
                  top: compactMode ? 5 : 10, 
                  right: compactMode ? 5 : 10, 
                  left: compactMode ? 5 : 10, 
                  bottom: compactMode ? 5 : 10 
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal vertical={false} />
                <XAxis
                  dataKey={chartData.x_axis_columns[0]}
                  tick={{ fill: '#ccccccff', fontSize }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fill: '#ccccccff', fontSize }}
                  tickFormatter={(value) => compactMode ? value.toString().slice(0, 4) : value.toString()}
                />
                <Tooltip
                  labelClassName="text-white"
                  cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                  contentStyle={{ backgroundColor: '#000', fontSize }}
                />
                {dataKeys.map((key, index) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={colorScheme[index % colorScheme.length]}
                    stackId="a"
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </>
  );
}