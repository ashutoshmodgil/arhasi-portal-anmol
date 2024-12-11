import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowUpDown, Pin, RefreshCcw, Share2 } from 'lucide-react';
import { useState } from 'react';
import { CiFilter } from 'react-icons/ci';
import DeleteChartButton from '../DeleteChartButton';
import FilterChartDialog from '@/components/filter-chart-dialog';
import useUpdateChartName from '@/api/hooks/useUpdateChartName';
import useRefreshChartData from '@/api/hooks/useRefreshChartData';

const TableChart = ({ data, pinned, onPin, compactMode = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [chartName, setChartName] = useState(data.chart_name);
  const [chartData, setChartData] = useState(data);
  const [showFilterChartModal, setShowFilterChartModal] = useState(false);
  const { mutate: refreshChart, isPending: isRefreshing } = useRefreshChartData();

  const tableHeight = compactMode ? 200 : 500;
  const padding = 1;
  const totalColumns = 1 + data.y_axis_columns.length;

  const getFontSize = () => {
    if (totalColumns <= 3) return 'text-[10px]';
    return 'text-[10px]';
  };

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

  const tableWrapperClass = totalColumns > 3 ? 'overflow-x-auto' : '';

  const formatColumnHeader = (text) => {
    return text
      .replace(/_/g, ' ')
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatCellValue = (value) => {
    return value === null || value === '' ? 'null' : String(value);
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
      <Card className='w-full bg-[#1a2b2b] text-white border border-[#3D494A]'>
        <CardHeader className='flex flex-row items-center justify-between px-4 py-2 border-b border-[#3D494A]'>
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
              onDeleteSuccess={() => console.log('Deleted successfully')}
            />
          </div>
        </CardHeader>
        <CardContent className='p-1'>
          <div className='rounded-md border border-[#3D494A]'>
            <div style={{ maxHeight: tableHeight }} className={`overflow-y-auto ${tableWrapperClass}`}>
              <table className='w-full'>
                <thead className='sticky top-0 z-10'>
                  <tr className='bg-[#D04848] text-[#E8F5E9]'>
                    <th className={`text-left p-${padding} font-semibold whitespace-nowrap ${getFontSize()}`}>
                      <div className='flex items-center gap-1'>
                        {formatColumnHeader(chartData.x_axis_columns[0])}
                        <ArrowUpDown className='h-2 w-2' />
                      </div>
                    </th>
                    {chartData.y_axis_columns.map((column, index) => (
                      <th key={index} className={`text-left p-${padding} font-semibold whitespace-nowrap ${getFontSize()}`}>
                        <div className='flex items-center gap-1'>
                          {formatColumnHeader(column)}
                          <ArrowUpDown className='h-2 w-2' />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {chartData.data_rows.map((row, index) => (
                    <tr key={index} className='border-t border-[#3D494A] hover:bg-[#2E7D32]/10 transition-colors'>
                      <td className={`p-${padding} whitespace-nowrap ${getFontSize()}`}>
                        {formatCellValue(row[chartData.x_axis_columns[0]])}
                      </td>
                      {chartData.y_axis_columns.map((column, colIndex) => (
                        <td key={colIndex} className={`p-${padding} whitespace-nowrap ${getFontSize()}`}>
                          {formatCellValue(row[column])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default TableChart;