import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Share2, Pin, RefreshCcw } from "lucide-react";
import { CiFilter } from "react-icons/ci";
import * as d3 from "d3";
import { Input } from "@/components/ui/input";
import DeleteChartButton from "../DeleteChartButton"; // Import the Delete button component
import FilterChartDialog from '@/components/filter-chart-dialog';
import useUpdateChartName from "@/api/hooks/useUpdateChartName";

const colorScheme = [
  '#eeeeee', '#595959', '#c10104', '#ffa6d2', '#ff6666',
  '#e50102', '#3a2f2f', '#ca3679', '#cccccc'
];

type dataTypes = {
  _id: string;
  dashboard_id: string;
  chart_name: string;
  chart_type: string[];
  data_rows: Record<string, string | number>[];
  x_axis_columns: string[];
  y_axis_columns: string[];
  pinned?: boolean;
};

export default function TreemapChart({
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
  const [isEditing, setIsEditing] = useState(false);
  const [chartName, setChartName] = useState(data.chart_name);
  const svgRef = useRef<SVGSVGElement>(null);
  const [chartData, setChartData] = useState(data);
  const [showFilterChartModal, setShowFilterChartModal] = useState(false);
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
  const handleFilterChart = () => {
    setShowFilterChartModal(true);
  };

 

  const processData = () => {
    const hierarchicalData = {
      name: "root",
      children: [] as any[],
    };

    const getColor = (category: string) => {
      const index = uniqueCategories.indexOf(category);
      return colorScheme[index % colorScheme.length];
    };

    chartData.data_rows.forEach((row) => {
      const category = row[chartData.x_axis_columns[0]] as string;
      const values = Object.entries(row).filter(([key, value]) => 
        key !== chartData.x_axis_columns[0] && typeof value === 'number' && value > 0
      );

      const categoryNode = hierarchicalData.children.find(n => n.name === category) || {
        name: category,
        color: getColor(category),
        children: [],
      };

      if (!hierarchicalData.children.includes(categoryNode)) {
        hierarchicalData.children.push(categoryNode);
      }

      values.forEach(([key, value]) => {
        categoryNode.children.push({
          name: key.replace(/_/g, " ").replace(/\([^)]*\)/g, "").trim(),
          value: value,
          color: getColor(category),
        });
      });
    });

    return hierarchicalData;
  };

  const uniqueCategories = [...new Set(chartData.data_rows.map(row => row[chartData.x_axis_columns[0]]))];
  
  const HorizontalLegend = () => (
    <div className={`flex flex-wrap gap-2 px-2 py-1 border-b border-[#3D494A]`}>
      {uniqueCategories.map((category, index) => (
        <div key={index} className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" 
               style={{ backgroundColor: colorScheme[index % colorScheme.length] }} />
          <span className="text-xs text-gray-300" 
                style={{ fontSize: compactMode ? 8 : 12 }}>
            {category}
          </span>
        </div>
      ))}
    </div>
  );

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 600;
    const height = compactMode ? 200 : 600;
    const hierarchicalData = processData();

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const root = d3.hierarchy(hierarchicalData)
      .sum(d => (d as any).value)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    d3.treemap()
      .size([width, height])
      .paddingTop(compactMode ? 8 : 28)
      .paddingRight(compactMode ? 2 : 7)
      .paddingInner(compactMode ? 1 : 3)
      (root);

    const cell = svg
      .selectAll("g")
      .data(root.leaves())
      .join("g")
      .attr("transform", d => `translate(${d.x0},${d.y0})`);

    cell.append("rect")
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .attr("fill", d => (d.parent as any).data.color)
      .attr("opacity", 0.8)
      .attr("stroke", "#fff")
      .attr("stroke-width", compactMode ? 0.5 : 1)
      .on("mouseover", function() {
        d3.select(this)
          .attr("opacity", 1)
          .attr("stroke-width", compactMode ? 1 : 2);
      })
      .on("mouseout", function() {
        d3.select(this)
          .attr("opacity", 0.8)
          .attr("stroke-width", compactMode ? 0.5 : 1);
      });

    const getFontSize = (d: any) => {
      const area = (d.x1 - d.x0) * (d.y1 - d.y0);
      return Math.min(compactMode ? 8 : 14, 
             Math.max(compactMode ? 6 : 10, 
             area / (compactMode ? 5000 : 3000)));
    };

    cell.append("text")
      .attr("x", 2)
      .attr("y", compactMode ? 8 : 16)
      .attr("fill", "white")
      .attr("font-size", d => `${getFontSize(d)}px`)
      .text(d => d.data.name);

    cell.append("text")
      .attr("x", 2)
      .attr("y", compactMode ? 16 : 30)
      .attr("fill", "white")
      .attr("font-size", d => `${getFontSize(d)}px`)
      .attr("font-weight", "bold")
      .text(d => d.value);

  }, [chartData, compactMode]);

  // Handle delete logic
  const handleDelete = () => {
    // Implement your delete logic here
    console.log("Chart deleted");
    // You can use a callback to notify the parent component or implement any other action here
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
      <CardHeader className="flex flex-row items-center justify-between px-2 py-1 border-b border-[#3D494A]">
        <CardTitle 
          className={`${compactMode ? 'text-sm' : 'text-lg'} font-bold text-white w-full`} 
          onClick={() => setIsEditing(true)}>
          {isEditing ? (
            <Input
              value={chartName}
              onChange={(e) => setChartName(e.target.value)}
              onKeyDown={handleNameSubmit}
              onBlur={() => setIsEditing(false)}
              className="bg-transparent outline-none border-none ring-0 focus:ring-0 focus-visible:ring-offset-0 focus-visible:ring-0"
              autoFocus
            />
          ) : (
            <span className="cursor-pointer hover:text-gray-300">{chartName}</span>
          )}
        </CardTitle>
        <div className="flex items-center gap-1">
          {!compactMode && (
            <>
              {/* Commented out the calendar button */}
              {/* <Button variant="ghost" size="sm" className="text-white bg-secondary-background">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Aug,20 → Present
              </Button> */}
              <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 bg-secondary-background"
                >
                  <RefreshCcw className="w-4 h-4" />
                </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 bg-secondary-background">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 bg-secondary-background"
              onClick={handleFilterChart}>
                <CiFilter className="w-4 h-4" />
              </Button>
            </>
          )}
          {pinned && (
            <Button variant="ghost" size="sm" 
                    className="text-gray-400 bg-secondary-background p-1" 
                    onClick={onPin}>
              <Pin className="w-3 h-3" />
            </Button>
          )}
          {/* Add Delete button */}
          <DeleteChartButton dashboard_id={data.dashboard_id} chart_id={data._id} onDeleteSuccess={() => console.log("Deleted successfully")} />

        </div>
      </CardHeader>
      <HorizontalLegend />
      <CardContent className="p-1">
        <div style={{ height: compactMode ? '200px' : '600px' }}>
          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            className="text-white"
          />
        </div>
      </CardContent>
    </Card>
    </>
  );
}
