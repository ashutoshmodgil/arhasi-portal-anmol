import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pin, CalendarIcon, RefreshCcw } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { CiFilter } from 'react-icons/ci';
import DeleteChartButton from "../DeleteChartButton"; // Import the Delete button component
import useUpdateChartName from '@/api/hooks/useUpdateChartName';

type DataRow = Record<string, string | number>;

type DataTypes = {
  _id: string;
  dashboard_id: string;
  chart_name: string;
  chart_type: string[];
  data_rows: DataRow[];
  x_axis_columns: string[];
  y_axis_columns: string[];
  pinned?: boolean;
};

const ProgressBars = ({
  data,
  pinned,
  onPin,
  compactMode = false,
}: {
  data: DataTypes;
  pinned?: boolean;
  compactMode?: boolean;
  onPin?: () => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [chartName, setChartName] = useState(data.chart_name);
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

 

  const handleDelete = () => {
    // Implement your delete logic here
    console.log("Chart deleted");
    // You can use a callback to notify the parent component or implement any other action here
  };

  return (
    <Card className="w-full bg-primary-background text-white border border-[#3D494A]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 border-b border-[#3D494A]">
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
        <div className="flex space-x-3">
          {/* Commented out the calendar button */}
          {/* <Button variant="ghost" size="sm" className="text-white bg-secondary-background">
            <CalendarIcon className="w-4 h-4 mr-2" />
            Oct, 2024
          </Button> */}
          <Button variant="ghost" size="sm" className="text-gray-400 bg-secondary-background">
            <RefreshCcw className="w-6 h-6" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 bg-secondary-background">
            <CiFilter className="w-4 h-4" />
          </Button>
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
          {/* Add Delete button */}
          <DeleteChartButton dashboard_id={data.dashboard_id} chart_id={data._id} onDeleteSuccess={() => console.log("Deleted successfully")} />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="p-6 space-y-4">
          {data.data_rows.map((item, index) => {
            const xLabel = data.x_axis_columns[0];
            const yLabel = data.y_axis_columns[0];
            const xValue = item[xLabel];
            const yValue = item[yLabel];

            return (
              <div key={index}>
                <div className="flex justify-between text-white mb-2">
                  <span className="text-[#9EA9AB]">{xValue}</span>
                  <span className="font-medium">{`${Math.round(Number(yValue))}%`}</span>
                </div>
                <div className="relative w-full h-4 bg-gray-700 rounded-full">
                  <div
                    className="absolute h-4 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(Number(yValue), 100)}%`,
                      backgroundColor: '#D04848',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressBars;
