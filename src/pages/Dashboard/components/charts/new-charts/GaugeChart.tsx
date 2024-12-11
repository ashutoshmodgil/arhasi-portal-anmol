import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BotIcon, Pin, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { CiFilter } from "react-icons/ci";
import useRefreshChartData from "@/api/hooks/useRefreshChartData";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import DeleteChartButton from "../DeleteChartButton";
import useUpdateChartName from "@/api/hooks/useUpdateChartName";

type dataTypes = {
  chart_name: string;
  chart_type: string[];
  dashboard_id?: string;
  data_rows: Record<string, string | number>[];
  datasource_id?: string;
  x_axis_columns: string[];
  y_axis_columns: string[];
  _id?: string;
  pinned?: boolean;
};

export default function GaugeChart({
  data,
  pinned,
  onPin,
  compactMode = false,
}: {
  data: dataTypes;
  pinned?: boolean;
  compactMode?: boolean;
  onPin?: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [chartName, setChartName] = useState(data.chart_name);
  const [chartData, setChartData] = useState(data);

  const { mutate: refreshChart, isPending: isRefreshing } = useRefreshChartData();
  const { mutate: updateChartName } = useUpdateChartName();

  const handleRefresh = () => {
    if (!chartData._id) return;
    
    refreshChart(
      { chart_id: chartData._id },
      {
        onSuccess: (newData) => {
          setChartData(newData);
        },
      }
    );
  };

  const handleNameSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && chartData.dashboard_id && chartData._id) {
      updateChartName({
        dashboard_id: chartData.dashboard_id,
        chart_id: chartData._id,
        chart_name: chartName,
      });
      setIsEditing(false);
    }
  };

  const handleNameBlur = () => {
    if (chartName !== chartData.chart_name && chartData.dashboard_id && chartData._id) {
      updateChartName({
        dashboard_id: chartData.dashboard_id,
        chart_id: chartData._id,
        chart_name: chartName,
      });
    }
    setIsEditing(false);
  };

  // Extract percentage from data_rows using x_axis_columns
  const percentage = chartData.data_rows[0]?.[chartData.x_axis_columns[0]] ?? 0;
  const roundedPercentage = Math.round(Number(percentage) * 10) / 10;

  // Prepare data for the pie chart
  const gaugeData = [
    { value: roundedPercentage },
    { value: 100 - roundedPercentage },
  ];

  const COLORS = ["#C10205", "#2E393A"]; // Red for utilized, dark gray for remaining

  const calculatePosition = (percentage: number) => {
    const angleInRadians = Math.PI * (1 - percentage / 100);
    const radius = 80;
    const x = Math.cos(angleInRadians);
    const y = Math.sin(angleInRadians);

    return {
      left: 50 + (x * radius * 100) / (2 * 90),
      top: 65 - (y * radius * 100) / (2 * 90),
    };
  };

  const position = calculatePosition(roundedPercentage);
  const target = 95; // Define target based on context (could be made configurable)

  return (
    <Card className="w-full bg-primary-background text-white border-[#3a3a3a] rounded-lg overflow-hidden">
      <div className="border-b border-[#3a3a3a] p-4 flex flex-row justify-between items-center">
        <CardTitle
          className={`text-${compactMode ? "base" : "lg"} font-bold text-white w-full`}
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
        <div className="flex space-x-2">
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
            <BotIcon className="w-6 h-6" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 bg-secondary-background"
          >
            <CiFilter className="w-4 h-4" />
          </Button>
          {pinned && (
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 bg-secondary-background"
              onClick={onPin}
            >
              <Pin className="w-4 h-4" />
            </Button>
          )}
          <DeleteChartButton
            dashboard_id={chartData.dashboard_id ?? ""}
            chart_id={chartData._id ?? ""}
            onDeleteSuccess={() => console.log("Deleted successfully")}
          />
        </div>
      </div>
      <div className="flex justify-center flex-col gap-2 py-4 items-center">
        <span className="bg-[#453032] text-[#FF6666] text-sm px-3 rounded-full border border-[#A24C4C]">
          Target: {target}%
        </span>
      </div>
      <CardContent className="p-0">
        <div className="relative" style={{ width: "100%", height: "90px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={gaugeData}
                cx="50%"
                cy="100%"
                startAngle={180}
                endAngle={0}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={0}
                dataKey="value"
              >
                {gaugeData.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index]}
                    className="stroke-[#434C4E]"
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div
            className="absolute bg-white rounded-full flex items-center justify-center font-bold text-black"
            style={{
              width: "35px",
              height: "35px",
              top: `${position.top}%`,
              left: `${position.left}%`,
              transform: "translate(-50%, -50%)",
              fontSize: "13px",
            }}
          >
            {roundedPercentage}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
}