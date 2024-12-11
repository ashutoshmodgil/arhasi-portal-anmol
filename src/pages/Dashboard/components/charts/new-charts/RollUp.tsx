import React from 'react';
import UserCard from '../../UserCard';

type dataTypes = {
  chart_name: string;
  chart_type: string[];
  dashboard_id?: string;
  data_rows: Record<string, number>[];
  datasource_id?: string;
  x_axis_columns: string[];
  y_axis_columns: string[];
  _id?: string;
  pinned?: boolean;
};

const RollUpCharts = ({ 
  data, 
  pinned, 
  onPin, 
  compactMode 
}: { 
  data: dataTypes; 
  pinned?: boolean;
  onPin?: () => void;
  compactMode?: boolean;
}) => {
  const dashboardId = data.dashboard_id!;
  const chartId = data._id!;

  return (
    <div className="space-y-4">
      {data.data_rows.map((row, index) => (
        <UserCard
          key={index}
          row={row}
          dashboardId={dashboardId}
          chartId={chartId}
          pinned={pinned}
          onPin={onPin}
          title={data.chart_name}
        />
      ))}
    </div>
  );
};

export default RollUpCharts;