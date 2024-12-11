import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Share2, Pin, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { CiFilter } from "react-icons/ci";
import DeleteChartButton from "../DeleteChartButton";
import useUpdateChartName from "@/api/hooks/useUpdateChartName";
import FilterChartDialog from "@/components/filter-chart-dialog";

const colorScheme = {
  empty: "#1a2b2b",
  level1: "#eeeeee",
  level2: "#595959",
  level3: "#c10104",
  level4: "#ffa6d2",
  level5: "#ff6666",
  level6: "#e50102",
  level7: "#3a2f2f",
  level8: "#ca3679",
  level9: "#cccccc",
};

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

const HeatMapv2 = ({
  chartData: initialChartData,
  pinned,
  onPin,
  compactMode = false,
}: {
  chartData: dataTypes;
  pinned?: boolean;
  onPin?: () => void;
  compactMode?: boolean;
}) => {
  const [chartData, setChartData] = useState(initialChartData);
  const [isEditing, setIsEditing] = useState(false);
  const [showFilterChartModal, setShowFilterChartModal] = useState(false);
  const [chartName, setChartName] = useState(chartData.chart_name || "Heatmap");
  const { mutate: updateChartName } = useUpdateChartName();

  const handleNameSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      updateChartName({
        dashboard_id: chartData.dashboard_id,
        chart_id: chartData._id,
        chart_name: chartName,
      });
      setIsEditing(false);
    }
  };

  const handleNameBlur = () => {
    if (chartName !== chartData.chart_name) {
      updateChartName({
        dashboard_id: chartData.dashboard_id,
        chart_id: chartData._id,
        chart_name: chartName,
      });
    }
    setIsEditing(false);
  };

  const dataRows = chartData?.data_rows || [];
  const uniqueRows = [
    ...new Set(dataRows.map((item) => item[chartData.x_axis_columns[0]])),
  ];
  const uniqueColumns = Object.keys(dataRows[0] || {}).filter(
    (key) => key !== chartData.x_axis_columns[0]
  );

  const dataMap = new Map();
  dataRows.forEach((row) => {
    uniqueColumns.forEach((col) => {
      dataMap.set(`${row[chartData.x_axis_columns[0]]}-${col}`, row[col] || 0);
    });
  });

  const maxValue = Math.max(...Array.from(dataMap.values()));

  const getBlockColor = (count: number) => {
    if (count === 0) return colorScheme.empty;
    const normalized = count / maxValue;
    if (normalized <= 0.1) return colorScheme.level1;
    if (normalized <= 0.2) return colorScheme.level2;
    if (normalized <= 0.3) return colorScheme.level3;
    if (normalized <= 0.4) return colorScheme.level4;
    if (normalized <= 0.5) return colorScheme.level5;
    if (normalized <= 0.6) return colorScheme.level6;
    if (normalized <= 0.7) return colorScheme.level7;
    if (normalized <= 0.8) return colorScheme.level8;
    return colorScheme.level9;
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
      <Card className="w-full bg-[#1a2b2b] text-white border border-[#3D494A]">
        <CardHeader className="flex flex-row items-center justify-between px-4 py-2 border-b border-[#3D494A]">
          <CardTitle
            className="text-lg font-bold text-white w-full"
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
          <div className="flex items-center gap-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 bg-secondary-background"
            >
              <RefreshCcw className="w-6 h-6" />
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
              dashboard_id={chartData.dashboard_id}
              chart_id={chartData._id}
              onDeleteSuccess={() => console.log("Deleted successfully")}
            />
          </div>
        </CardHeader>

        <div className="p-4">
          <div className="overflow-x-auto bg-transparent">
            <div className="min-w-max">
              <div
                className="grid"
                style={{
                  gridTemplateColumns: `200px repeat(${uniqueColumns.length}, 120px)`,
                }}
              >
                <div></div>
                {uniqueColumns.map((col) => (
                  <div key={col} className="text-center text-sm mb-2">
                    {col}
                  </div>
                ))}
              </div>

              {/* Scrollable container with fixed height */}
              <div className="max-h-[400px]  ">
                {uniqueRows.map((rowName) => (
                  <div
                    key={rowName}
                    className="grid gap-px bg-transparent my-2"
                    style={{
                      gridTemplateColumns: `200px repeat(${uniqueColumns.length}, 120px)`,
                    }}
                  >
                    <div className="text-sm py-2">{rowName}</div>
                    {uniqueColumns.map((col) => {
                      const count = dataMap.get(`${rowName}-${col}`);
                      return (
                        <div
                          key={`${rowName}-${col}`}
                          style={{
                            backgroundColor: getBlockColor(count),
                            border: count === 0 ? "1px solid #3D494A" : "none",
                          }}
                          className="h-10 relative group cursor-pointer transition-opacity duration-200 hover:opacity-80"
                        >
                          <div className="opacity-0 group-hover:opacity-100 absolute z-50 top-0 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-secondary-background text-white text-xs rounded">
                            {`${rowName} - ${col}: ${
                              typeof count === "number"
                                ? count.toLocaleString()
                                : count
                            }`}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default HeatMapv2;
