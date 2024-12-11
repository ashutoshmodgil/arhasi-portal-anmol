import React, { useState } from 'react';
import useDeleteChart from '@/api/hooks/useDeleteChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useUpdateChartName from '@/api/hooks/useUpdateChartName';
import useRefreshChartData from '@/api/hooks/useRefreshChartData';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { MoreHorizontal, Users, Pin, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

type UserCardProps = {
  row: Record<string, number>;
  dashboardId: string;
  chartId: string;
  pinned?: boolean;
  onPin?: () => void;
  title?: string;
};

export default function UserCard({ row, dashboardId, chartId, pinned, onPin, title }: UserCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [chartName, setChartName] = useState(title);
  const [cardData, setCardData] = useState(row);
  
  const queryClient = useQueryClient();
  const value = Object.values(cardData)[0];
  
  const { mutate: updateChartName } = useUpdateChartName();
  const { mutate: refreshChart, isPending: isRefreshing } = useRefreshChartData();

  const handleNameSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      updateChartName({
        dashboard_id: dashboardId,
        chart_id: chartId,
        chart_name: chartName??"",
      });
      setIsEditing(false);
    }
  };

  const handleNameBlur = () => {
    if (chartName !== title) {
      updateChartName({
        dashboard_id: dashboardId,
        chart_id: chartId,
        chart_name: chartName??"",
      });
    }
    setIsEditing(false);
  };

  const handleRefresh = () => {
    refreshChart(
      { chart_id: chartId },
      {
        onSuccess: (newData) => {
          setCardData(newData.data_rows[0]); // Assuming the first row contains the data we need
        },
      }
    );
  };

  const { mutate: deleteChart } = useDeleteChart({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-charts', dashboardId] });
      toast({ title: 'Chart deleted successfully' });
    },
  });

  return (
    <Card className='w-full bg-primary-background text-white border-[#3D494A]'>
      <CardHeader className='flex flex-row items-start justify-between px-4 py-2 gap-2'>
        <CardTitle
          className='text-sm font-bold cursor-pointer flex-1 break-words'
          onClick={() => setIsEditing(true)}
        >
          {isEditing ? (
            <Input
              value={chartName}
              onChange={(e) => setChartName(e.target.value)}
              onKeyDown={handleNameSubmit}
              onBlur={handleNameBlur}
              className='bg-transparent outline-none border-none ring-0 focus:ring-0 focus-visible:ring-offset-0 focus-visible:ring-0'
              autoFocus
            />
          ) : (
            <span className='cursor-pointer hover:text-gray-300 inline-block whitespace-normal'>
              {chartName}
            </span>
          )}
        </CardTitle>
        <div className='flex items-center gap-x-2 flex-shrink-0'>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 bg-secondary-background"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
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
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreHorizontal className='h-4 w-4 text-zinc-400 cursor-pointer' />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => deleteChart({ dashboard_id: dashboardId, chart_id: chartId })}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className='px-4 pb-2'>
        <div className='flex items-center justify-between space-x-2'>
          <div className='flex items-center space-x-2'>
            <div className='rounded-full bg-[#2E393A] border border-[#434D4E] p-2'>
              <Users className='h-4 w-4 text-white' />
            </div>
            <p className='text-lg font-bold'>{value}</p>
          </div>
          <Select defaultValue='this-month'>
            <SelectTrigger className='w-28 p-0 h-6 border-[#A24C4C] bg-[#453032] text-[#FF6666] rounded-full px-2 outline-none ring-0 focus-visible:ring-0'>
              <SelectValue placeholder='Select period' className='font-semibold text-[10px]' />
            </SelectTrigger>
            <SelectContent className='bg-zinc-800 border-zinc-700 text-zinc-400'>
              <SelectItem value='this-month'>This Month</SelectItem>
              <SelectItem value='last-month'>Last Month</SelectItem>
              <SelectItem value='this-year'>This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}