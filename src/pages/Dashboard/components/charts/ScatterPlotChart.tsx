import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Share2, Pin, RefreshCcw } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CiFilter } from 'react-icons/ci';
import DeleteChartButton from './DeleteChartButton';
import FilterChartDialog from '@/components/filter-chart-dialog';
import useUpdateChartName from '@/api/hooks/useUpdateChartName';

type DataTypes = {
  _id: string;
  chart_name: string;
  chart_type: string[];
  data_rows: Record<string, string | number>[];
  x_axis_columns: string[];
  y_axis_columns: string[];
  dashboard_id: string;
  pinned?: boolean;
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: Record<string, any>;
  }>;
}

const ScatterPlotChart = ({
  data,
  pinned,
  onPin,
  compactMode = false,
}: {
  data: DataTypes;
  pinned?: boolean;
  onPin?: () => void;
  compactMode?: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [chartName, setChartName] = useState(data.chart_name);
  const [chartData, setChartData] = useState(data);
  const [showFilterChartModal, setShowFilterChartModal] = useState(false);
  const { mutate: updateChartName } = useUpdateChartName();

  // Add jitter to prevent point overlap
  const addJitter = (value: number, amount: number = 0.2) => {
    return value + (Math.random() - 0.5) * amount;
  };

  const processData = () => {
    return chartData.data_rows.map(row => {
      const xValue = Number(row[chartData.y_axis_columns[0]]) || 0;
      const yValue = Number(row[chartData.y_axis_columns[1]]) || 0;
      
      return {
        name: row[chartData.x_axis_columns[0]],
        // Add jitter but keep original values for tooltip
        x: addJitter(xValue),
        y: addJitter(yValue),
        originalX: xValue,
        originalY: yValue,
      };
    });
  };

  const processedData = processData();

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#2a2f35] p-4 rounded-lg shadow-lg border border-gray-700">
          <p className="text-sm font-medium text-[#ccccccff] mb-1">{data.name}</p>
          <p className="text-sm text-[#ccccccff]">
            {`${chartData.y_axis_columns[0]}: ${data.originalX}`}
          </p>
          <p className="text-sm text-[#ccccccff]">
            {`${chartData.y_axis_columns[1]}: ${data.originalY}`}
          </p>
        </div>
      );
    }
    return null;
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
      <Card className="w-full bg-[#1a2b2b] border border-[#3D494A]">
        <CardHeader className="flex flex-row items-center justify-between px-2 py-1 border-b border-[#3D494A]">
          <CardTitle
            className={`text-${compactMode ? 'base' : 'lg'} font-bold text-white w-full`}
            onClick={() => setIsEditing(true)}
          >
            {isEditing ? (
              <Input
                value={chartName}
                onChange={(e) => setChartName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    updateChartName({
                      dashboard_id: data.dashboard_id,
                      chart_id: data._id,
                      chart_name: chartName,
                    });
                    setIsEditing(false);
                  }
                }}
                onBlur={() => {
                  if (chartName !== data.chart_name) {
                    updateChartName({
                      dashboard_id: data.dashboard_id,
                      chart_id: data._id,
                      chart_name: chartName,
                    });
                  }
                  setIsEditing(false);
                }}
                className="bg-transparent outline-none border-none ring-0 focus:ring-0 focus-visible:ring-offset-0 focus-visible:ring-0 focus:outline-none focus-visible:outline-none ring-transparent"
                autoFocus
              />
            ) : (
              <span className="cursor-pointer hover:text-gray-300">
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
                >
                  <RefreshCcw className="w-4 h-4" />
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
                  onClick={() => setShowFilterChartModal(true)}
                >
                  <CiFilter className="w-4 h-4" />
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

        <div className="p-4">
          <div className="w-full" style={{ height: compactMode ? '200px' : '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{
                  top: 20,
                  right: 30, // Increased right margin for y-axis label
                  bottom: 60, // Increased bottom margin for x-axis label
                  left: 60,  // Increased left margin for y-axis label
                }}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis
                  type="number"
                  dataKey="x"
                  name={chartData.y_axis_columns[0]}
                  stroke="#9ca3af"
                  tick={{ fill: '#9ca3af' }}
                  domain={[0, 2]}
                  ticks={[0, 1, 2]}
                  label={{
                    value: chartData.y_axis_columns[0].split('_')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' '),
                    position: 'bottom',
                    offset: 40,
                    fill: '#9ca3af'
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name={chartData.y_axis_columns[1]}
                  stroke="#9ca3af"
                  tick={{ fill: '#9ca3af' }}
                  domain={[0, 5]}
                  ticks={[0, 1, 2, 3, 4, 5]}
                  label={{
                    value: chartData.y_axis_columns[1].split('_')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' '),
                    angle: -90,
                    position: 'left',
                    offset: 40,
                    fill: '#9ca3af'
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Scatter
                  data={processedData}
                  fill="#6366f1"
                  opacity={0.8}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
    </>
  );
};

export default ScatterPlotChart;