'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Wheel from '@uiw/react-color-wheel';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { hsvaToHex } from '@uiw/color-convert';

const ColorWheel = ({ hsva, setHsva }) => {
  return (
    <Wheel
      color={hsva}
      onChange={(color) => setHsva({ ...hsva, ...color.hsva })}
    />
  );
};

export default function WheelColorComponent() {
  const [hsva, setHsva] = useState({ h: 214, s: 43, v: 90, a: 1 });
  const [recentColors, setRecentColors] = useState([]);
  const [customColors, setCustomColors] = useState({
    option1: [],
    option2: [],
    option3: [],
  });
  const [buttonText, setButtonText] = useState('Select');
  const [themeColors, setThemeColors] = useState({
    background: '#1B1C1E',
    primary: '#FF6347', // example of branding color
    secondary: '#2A2D2E', // example of branding color
  });

  // Handle recent color selection and update
  const handleSelectColor = () => {
    const selectedColor = hsvaToHex(hsva);

    if (recentColors[0] !== selectedColor) {
      const updatedColors = [selectedColor, ...recentColors.filter(color => color !== selectedColor)];
      setRecentColors(updatedColors.slice(0, 4));
    }

    setButtonText('Select');
  };

  // Handle preview of color when clicked from recent colors
  const handlePreviewColorClick = (color) => {
    setHsva({ ...hsva, ...hexToHsva(color) });
    setButtonText('Confirm Selection');
  };

  // Handle updating custom options with the selected color
  const handleUpdateCustomColor = (color, option) => {
    setCustomColors((prevColors) => ({
      ...prevColors,
      [option]: color,
    }));
  };

  // Update theme colors
  const handleUpdateThemeColors = (color, key) => {
    setThemeColors((prevColors) => ({
      ...prevColors,
      [key]: color,
    }));
  };

  const hexToHsva = (hex) => {
    const hexToRgb = (hex) => {
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      } : null;
    };

    const rgb = hexToRgb(hex);
    const hsv = Wheel.RGBtoHSV(rgb.r, rgb.g, rgb.b);
    return { h: hsv.h, s: hsv.s, v: hsv.v, a: 1 };
  };

  return (
    <Card className="w-full sm:w-1/2 border-[#3D494A] bg-secondary text-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold flex items-center">
          Theme
          <ChevronDown className="ml-2 h-4 w-4" />
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="text-gray-400">
              Custom <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleUpdateCustomColor(recentColors[0], 'option1')}>Option 1</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleUpdateCustomColor(recentColors[1], 'option2')}>Option 2</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleUpdateCustomColor(recentColors[2], 'option3')}>Option 3</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="space-y-4">
        <ColorWheel hsva={hsva} setHsva={setHsva} />
        <div className="flex items-center justify-between bg-secondary-background rounded-md p-2">
          <div className="flex items-center space-x-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ background: hsvaToHex(hsva) }}
            ></div>
            <span>{hsvaToHex(hsva)}</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white">
                100% <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>75%</DropdownMenuItem>
              <DropdownMenuItem>50%</DropdownMenuItem>
              <DropdownMenuItem>25%</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">Theme</span>
          <div className="flex items-center space-x-1 relative">
            <div className="flex space-x-1">
              {recentColors.map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full cursor-pointer"
                  style={{ backgroundColor: color }}
                  onClick={() => handlePreviewColorClick(color)}
                ></div>
              ))}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 flex items-center p-0"
                >
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleUpdateThemeColors(hsvaToHex(hsva), 'background')}>Background</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdateThemeColors(hsvaToHex(hsva), 'primary')}>Primary</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdateThemeColors(hsvaToHex(hsva), 'secondary')}>Secondary</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-white bg-transparent border-gray-600 ml-1"
          onClick={handleSelectColor}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}
