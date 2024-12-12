import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MoreHorizontal, ArrowUpRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

const MetricCard = ({ 
  title = "Savant Enterprise",
  subtitle = "AI Agent Deployment",
  percentage = "85.4%",
  description = "of storage used",
  fillPercentage = 85,
  growth = "1.12%",
  actionText = "Open Savant Enterprise",
  info = "Savant Enterprise"
}) => {
  return (
    <Card className="h-[185px] w-full">
      <CardContent className="p-0">
        <div className="flex items-center justify-between py-1 px-1">
          <div className="space-y-0">
            <h3 className="text-sm font-semibold">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            {info && (
              <div className="flex items-center gap-1 text-gray-400">
                <Info className="h-2 w-2" />
                <span className="text-xs font-semibold">{info}</span>
              </div>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>
<hr/>
        <div className="space-y-1 mb-3 p-3">
          <p className="text-xs text-gray-500">{subtitle}</p>
          <div className="flex items-center gap-3">
            <span className="text-xl font-semibold">{percentage}</span>
            <div className="flex gap-1 ml-auto">
            <div className=" relative flex items-center text-green-500 text-xs">
              ↑{growth}
            </div>
            <div className="relative h-8 w-4 bg-gray-100 rounded-full overflow-hidden ml-auto">
              <div 
                className="absolute bottom-0 w-full bg-red-500 rounded-full transition-all duration-500"
                style={{ 
                  height: `${fillPercentage}%`,
                  backgroundColor: fillPercentage > 70 ? '#DC2626' : fillPercentage > 40 ? '#F87171' : '#FCA5A5'
                }}
              />
            </div>
            </div>
            
          </div>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
<hr/>
        <button className="flex items-center text-xs text-gray-500 hover:text-gray-700 transition-colors justify-between px-3 py-2 w-full bg-[#B4C0C20F]">
          <div>{actionText}</div>
          <ArrowUpRight className="h-4 w-4 ml-1" />
        </button>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
