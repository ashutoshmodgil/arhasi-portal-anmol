import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, RefreshCcw, Share2 } from 'lucide-react';
import {
  CartesianGrid,
  LabelList,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import DeleteChartButton from './DeleteChartButton';
import { CiFilter } from 'react-icons/ci';

interface ChartData {
  chart_name?: string;
  data_rows: Array<any>; // You can make this more specific based on your data structure
  x_axis_columns: string | string[];
  y_axis_columns: string | string[];
}

interface EnhancedPortfolioChartProps {
  data: ChartData;
  onDelete?: () => void;  // Ensure onDelete is passed in as a prop
  chartIndex?: number;
}

interface CustomizedLabelProps {
  x: number;
  y: number;
  stroke: string;
  value: number;
}

interface CustomizedAxisTickProps {
  x: number;
  y: number;
  payload: { value: string };
}

interface CustomLegendProps {
  payload: Array<{ color: string; value: string }>;
}

const CustomizedLabel: React.FC<CustomizedLabelProps> = (props) => {
  const { x, y, value } = props;

  return (
    <text
      x={x}
      y={y}
      dy={-4}
      fill='#fff'
      fontSize={10}
      textAnchor='middle'
      className='font-medium'
    >
      {`${value}%`}
    </text>
  );
};

const CustomizedAxisTick: React.FC<CustomizedAxisTickProps> = (props) => {
  const { x, y, payload } = props;

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor='end'
        fill='#999'
        transform='rotate(-35)'
        className='text-xs'
      >
        {payload.value}
      </text>
    </g>
  );
};

const CustomLegend: React.FC<CustomLegendProps> = ({ payload }) => {
  return (
    <div className='flex gap-6 mb-6 justify-center'>
      {payload.map((entry, index) => (
        <div key={`legend-${index}`} className='flex items-center gap-2'>
          <div
            className='w-2 h-2 rounded-full'
            style={{ backgroundColor: entry.color }}
          ></div>
          <span className='text-sm text-gray-300'>{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const EnhancedPortfolioChart: React.FC<EnhancedPortfolioChartProps> = ({ 
  data, 
  onDelete, // Ensure onDelete is used correctly
}) => {
  return (
    <Card className='w-full bg-primary-background border border-[#3D494A]'>
      <CardHeader className='flex flex-row items-center justify-between px-4 py-2 border-b border-[#3D494A]'>
        <CardTitle className='text-lg font-bold text-white'>
          {data.chart_name}
        </CardTitle>
        <div className='flex items-center gap-x-2'>
          {/* Commented out the "Aug,20 → Present" Button with CalendarIcon */}
          {/* <Button
            variant='ghost'
            size='sm'
            className='text-white bg-secondary-background '
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
            className=' text-gray-400 bg-secondary-background '
          >
            <Share2 className='w-4 h-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            className=' text-gray-400 bg-secondary-background '
          >
            <CiFilter className='w-4 h-4'/>
          </Button>
          {/* Render Delete Button only if onDelete is provided */}
          {onDelete && <DeleteChartButton onDelete={onDelete} />}
        </div>
      </CardHeader>
      <CardContent className='pb-0'>
        <div className='h-[400px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart
              data={data.data_rows}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid
                strokeDasharray='3 3'
                stroke='#333'
                vertical={false}
              />
              <XAxis
                dataKey={Array.isArray(data.x_axis_columns)
                  ? data.x_axis_columns[0]
                  : data.x_axis_columns}
                height={60}
                tick={<CustomizedAxisTick x={0} y={0} payload={{ value: '' }} />}
                axisLine={{ stroke: '#333' }}
              />
              <YAxis
                axisLine={{ stroke: '#333' }}
                tickFormatter={(value) => `${value}%`}
                domain={[0, 100]}
                tick={{ fill: '#999' }}
              />
              <Legend content={<CustomLegend payload={[]} />} />
              <Line
                type='monotone'
                dataKey={Array.isArray(data.y_axis_columns)
                  ? data.y_axis_columns[0]
                  : data.y_axis_columns}
                name={Array.isArray(data.y_axis_columns)
                  ? data.y_axis_columns[0]
                  : data.y_axis_columns}
                stroke='#C10104'
                strokeWidth={2}
              >
                <LabelList
                  content={<CustomizedLabel x={0} y={0} stroke='#a78bfa' value={0} />}
                />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedPortfolioChart;
