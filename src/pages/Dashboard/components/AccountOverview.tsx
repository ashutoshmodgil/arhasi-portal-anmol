import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

const AccountOverview = () => {
  return (
    <Card className="max-w-sm w-full">
      <CardHeader className="flex flex-row items-center justify-between py-1">
        <CardTitle className="text-lg font-semibold">Account Overview</CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </CardHeader>
      <hr/>
      <CardContent className="space-y-6 mt-2">
        <div className="space-y-2">
          <h3 className="text-md font-semibold">Enterprise Plan</h3>
          <p className="text-sm text-gray-500">
            Renewal Date → Nov 15, 2024
          </p>
          <div className="flex gap-3 mt-2">
            <Button variant="outline" size="sm" className='font-bold'>
              View History
            </Button>
            <Button variant="outline" size="sm" className='font-bold'>
              Manage Subscription
            </Button>
          </div>
        </div>
        <hr/>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-md font-semibold">Billing Status</h3>
            <span className="border rounded-full px-2 shadow text-sm text-black font-semibold">Active</span>
          </div>
          <p className="text-sm text-gray-500">
            Next Invoice → $299 on Nov 15, 2024
          </p>
          <div className="flex gap-3 mt-2">
            <Button variant="outline" size="sm" className='font-bold'>
              Payment History
            </Button>
            <Button variant="outline" size="sm" className='font-bold'>
              Update Billing
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountOverview;