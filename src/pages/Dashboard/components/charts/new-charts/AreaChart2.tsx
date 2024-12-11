import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Pin, RefreshCcw } from "lucide-react";
import { CiFilter } from "react-icons/ci";
import useRefreshChartData from "@/api/hooks/useRefreshChartData";
import { Input } from "@/components/ui/input";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Label,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import DeleteChartButton from "../DeleteChartButton";
import FilterChartDialog from "@/components/filter-chart-dialog";
import useUpdateChartName from "@/api/hooks/useUpdateChartName";

type dataTypes = {
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

export default function EmployeeRetentionChart2({
  data,
  pinned,
  onPin,
  compactMode = false,
}: {
  data: dataTypes;
  pinned?: boolean;
  onPin?: () => void;
  compactMode?: boolean;
}) {
  const [dateRange] = useState("Aug,20 → Present");
  const { mutate: refreshChart, isPending: isRefreshing } = useRefreshChartData();
  const [isEditing, setIsEditing] = useState(false);
  const [chartName, setChartName] = useState(data.chart_name);
  const [chartData, setChartData] = useState(data);
  const [showFilterChartModal, setShowFilterChartModal] = useState(false);

  const { mutate: updateChartName } = useUpdateChartName();
  const handleNameSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      updateChartName({
        dashboard_id: data.dashboard_id,
        chart_id: data._id,
        chart_name: chartName,
      });
      setIsEditing(false);
    }
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
    console.log("Chart deleted"); // Add your deletion logic here
  };

  // Transform the data for the chart
  const transformedChartData = chartData.data_rows.map((row) => ({
    date: row[chartData.x_axis_columns[0]],
    rate: Number(row[chartData.y_axis_columns[0]]),
  }));

  const values = transformedChartData.map((item) => item.rate);
  const minValue = 0;
  const maxValue = Math.ceil(Math.max(...values) * 1.05);
  const formatAxisLabel = (label: string) =>
    label
      .replace(/_/g, " ")
      .replace(/([A-Z])/g, " $1")
      .trim();

  const fontSize = compactMode ? 10 : 12;
  const dotRadius = compactMode ? 6 : 8;

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
      <Card className="w-full bg-primary-background text-white border border-[#3D494A]">
        <CardHeader className="flex flex-row items-center justify-between px-2 py-1 border-b border-[#3D494A]">
          <CardTitle
            className={`text-${
              compactMode ? "base" : "lg"
            } font-bold text-white w-full`}
            onClick={() => setIsEditing(true)}
          >
            {isEditing ? (
              <Input
                value={chartName}
                onChange={(e) => setChartName(e.target.value)}
                onKeyDown={handleNameSubmit}
                onBlur={handleNameBlur}
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
  onClick={handleRefresh}
  disabled={isRefreshing}
>
  <RefreshCcw className={`w-6 h-6 ${isRefreshing ? 'animate-spin' : ''}`} />
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
              dashboard_id={chartData.dashboard_id}
              chart_id={chartData._id}
              onDeleteSuccess={() => console.log("Deleted successfully")}
            />
          </div>
        </CardHeader>

        <CardContent className="p-1">
          <div style={{ height: compactMode ? "250px" : "300px" }}>
            <ChartContainer
              config={{
                rate: {
                  label: "Retention Rate",
                  color: "hsl(0, 100%, 50%)",
                },
              }}
              className="h-full w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={transformedChartData}
                  margin={{
                    top: compactMode ? 5 : 10,
                    right: compactMode ? 5 : 10,
                    left: compactMode ? 5 : 10,
                    bottom: compactMode ? 50 : 60,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "white", fontSize }}
                    axisLine={{ stroke: "white" }}
                    tickLine={{ stroke: "white" }}
                  >
                    <Label
                      value={formatAxisLabel(chartData.x_axis_columns[0])}
                      position="insideBottom"
                      offset={compactMode ? -10 : -15}
                      fill="white"
                      style={{ fontSize: `${fontSize}px` }}
                    />
                  </XAxis>
                  <YAxis
                    tick={{ fill: "white", fontSize }}
                    axisLine={{ stroke: "white" }}
                    tickLine={{ stroke: "white" }}
                    tickFormatter={(value) => `${value}`}
                    domain={[minValue, maxValue]}
                  >
                    <Label
                      value={formatAxisLabel(chartData.y_axis_columns[0])}
                      position="insideLeft"
                      angle={-90}
                      offset={0}
                      fill="white"
                      style={{ fontSize: `${fontSize}px` }}
                    />
                  </YAxis>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent formatter={(value) => `${value}`} />
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="rate"
                    stroke="#C10104"
                    fill="#C10104"
                    fillOpacity={0.2}
                    strokeWidth={compactMode ? 1.5 : 2}
                    dot={false}
                    activeDot={{ r: dotRadius }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
