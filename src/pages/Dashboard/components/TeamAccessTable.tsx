import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import You from '@/assets/you.png';

const TeamAccessTable = () => {
  const teamMembers = [
    { id: 1, name: 'Alex J', avatar: You, view: 'full', edit: 'none', admin: 'none' },
    { id: 2, name: 'Jhon D', avatar: You, view: 'full', edit: 'partial', admin: 'none' },
    { id: 3, name: 'Isa Chin', avatar: You, view: 'partial', edit: 'none', admin: 'none' },
    { id: 4, name: 'Alex Smith', avatar: You, view: 'full', edit: 'full', admin: 'full' },
    { id: 5, name: 'Raymond', avatar: You, view: 'partial', edit: 'none', admin: 'none' },
    { id: 6, name: 'Alex J', avatar: You, view: 'full', edit: 'partial', admin: 'partial' },
    { id: 7, name: 'Alex J', avatar: You, view: 'full', edit: 'none', admin: 'none' },
  ];

  const AccessDot = ({ type }:any) => {
    const colors = {
      full: 'bg-green-500',
      partial: 'bg-yellow-500',
      none: 'bg-gray-200'
    };

    return (
      <div className={`w-2 h-2 rounded-full ${colors[type]} mx-auto`} />
    );
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="flex flex-row items-center justify-between py-2">
        <CardTitle className="text-lg font-semibold">Team & Access Management</CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </CardHeader>
<hr/>
      <CardContent>
        <div className="mb-4 flex items-center gap-4 mt-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm text-gray-600">Full</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="text-sm text-gray-600">Partial</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-200" />
            <span className="text-sm text-gray-600">None</span>
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4 font-medium text-gray-600">Team Member</th>
                <th className="text-center py-2 px-4 font-medium text-gray-600">View</th>
                <th className="text-center py-2 px-4 font-medium text-gray-600">Edit</th>
                <th className="text-center py-2 px-4 font-medium text-gray-600">Admin</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member) => (
                <tr key={member.id} className="border-b last:border-b-0">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-sm">{member.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <AccessDot type={member.view} />
                  </td>
                  <td className="py-3 px-4">
                    <AccessDot type={member.edit} />
                  </td>
                  <td className="py-3 px-4">
                    <AccessDot type={member.admin} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamAccessTable;