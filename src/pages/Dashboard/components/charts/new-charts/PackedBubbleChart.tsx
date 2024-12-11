import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {  Share2, Pin, RefreshCcw } from "lucide-react";
import { CiFilter } from "react-icons/ci";
import * as d3 from "d3";
import { Input } from "@/components/ui/input";
import DeleteChartButton from "../DeleteChartButton"; // Import the Delete button component
import FilterChartDialog from '@/components/filter-chart-dialog';
import useUpdateChartName from "@/api/hooks/useUpdateChartName";

// Define the custom color scheme
const colorScheme = [
  '#eeeeee',
  '#595959',
  '#c10104',
  '#ffa6d2',
  '#ff6666',
  '#e50102',
  '#3a2f2f',
  '#ca3679',
  '#cccccc'
];

type dataTypes = {
  _id: string;
  chart_name: string;
  chart_type: string[];
  data_rows: Record<string, string | number>[];
  x_axis_columns: string[];
  y_axis_columns: string[];
  pinned?: boolean;
  dashboard_id: string;
};

export default function BubbleChart({
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
    const processed = [];
    const colorScale = (category: string) => {
      const index = chartData.data_rows.findIndex(row => row[chartData.x_axis_columns[0]] === category);
      return colorScheme[index % colorScheme.length];
    };

    const allValues = chartData.data_rows.flatMap((row) =>
      Object.entries(row)
        .filter(([key]) => key !== chartData.x_axis_columns[0])
        .map(([_, value]) => Number(value))
        .filter((value) => value > 0)
    );

    const minValue = allValues.length > 0 ? Math.min(...allValues) : 1;
    const maxValue = allValues.length > 0 ? Math.max(...allValues) : 5;

    const radiusScale = d3
      .scaleLinear()
      .domain([minValue, maxValue])
      .range(compactMode ? [7, 20] : [14, 40]) // Smaller bubbles in compact mode
      .clamp(true);

      chartData.data_rows.forEach((row) => {
      const category = row[chartData.x_axis_columns[0]] as string;
      const categoryColor = colorScale(category);

      Object.entries(row).forEach(([key, value]) => {
        const numValue = Number(value);
        if (key !== chartData.x_axis_columns[0] && numValue > 0) {
          processed.push({
            category: category,
            name: key.replace(/_/g, " ").replace(/\([^)]*\)/g, "").trim(),
            value: numValue,
            color: categoryColor,
            radius: radiusScale(numValue),
          });
        }
      });
    });

    return processed;
  };

  const processedData = processData();
  const uniqueCategories = [...new Set(processedData.map(d => d.category))];

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

  const handleDelete = () => {
    // Implement your delete logic here
    console.log("Chart deleted");
    // You can use a callback to notify the parent component or implement any other action here
  };

  useEffect(() => {
    if (!svgRef.current || !processedData.length) return;

    const width = 600;
    const height = compactMode ? 200 : 600;
    const centerX = width / 2;
    const centerY = height / 2;

    const simulation = d3
      .forceSimulation(processedData)
      .force("center", d3.forceCenter(centerX, centerY))
      .force("charge", d3.forceManyBody().strength(compactMode ? 2 : 5))
      .force(
        "collide",
        d3
          .forceCollide()
          .radius((d) => (d as any).radius + (compactMode ? 1 : 2))
          .strength(0.9)
      )
      .on("tick", ticked);

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const bubbles = svg
      .selectAll("g")
      .data(processedData)
      .join("g")
      .attr("class", "bubble-group")
      .style("cursor", "pointer");

    bubbles
      .append("circle")
      .attr("r", (d) => d.radius)
      .attr("fill", (d) => d.color)
      .attr("opacity", 0.8)
      .attr("stroke", "#fff")
      .attr("stroke-width", compactMode ? 0.5 : 1);

    const getFontSize = (radius: number) => {
      return Math.max(
        compactMode ? 6 : 10,
        Math.min(compactMode ? 8 : 14, radius * (compactMode ? 0.4 : 0.3))
      );
    };

    const wrapText = (text: string, radius: number) => {
      const maxLength = Math.floor(radius * (compactMode ? 0.3 : 0.4));
      if (text.length <= maxLength) return text;
      return `${text.slice(0, maxLength)}...`;
    };

    bubbles
      .append("text")
      .attr("dy", (d) => -d.radius * 0.2)
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .attr("font-size", (d) => getFontSize(d.radius))
      .style("opacity", 0)
      .text((d) => wrapText(d.name, d.radius * 2));

    bubbles
      .append("text")
      .attr("dy", (d) => d.radius * 0.2)
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .attr("font-size", (d) => getFontSize(d.radius) - (compactMode ? 1 : 2))
      .style("opacity", 0)
      .text((d) => wrapText(d.category, d.radius * 2));

    bubbles
      .append("text")
      .attr("dy", (d) => d.radius * 0.5)
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .attr("font-size", (d) => getFontSize(d.radius))
      .attr("font-weight", "bold")
      .style("opacity", 0)
      .text((d) => d.value);

    bubbles
      .on("mouseenter", function () {
        d3.select(this)
          .selectAll("text")
          .transition()
          .duration(200)
          .style("opacity", 1);
        d3.select(this)
          .select("circle")
          .transition()
          .duration(200)
          .attr("opacity", 1)
          .attr("stroke-width", compactMode ? 1 : 2);
      })
      .on("mouseleave", function () {
        d3.select(this)
          .selectAll("text")
          .transition()
          .duration(200)
          .style("opacity", 0);
        d3.select(this)
          .select("circle")
          .transition()
          .duration(200)
          .attr("opacity", 0.8)
          .attr("stroke-width", compactMode ? 0.5 : 1);
      });

    function ticked() {
      bubbles.attr(
        "transform",
        (d) => `translate(${(d as any).x},${(d as any).y})`
      );
    }

    return () => simulation.stop();
  }, [processedData, compactMode]);

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
        <div className="flex items-center gap-1">
          {!compactMode && (
            <>
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
            viewBox={`0 0 600 ${compactMode ? 200 : 600}`}
            preserveAspectRatio="xMidYMid meet"
          />
        </div>
      </CardContent>
    </Card>
    </>
  );
}
