import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ChevronDown, MoreHorizontal, Search } from 'lucide-react';
import { useState } from 'react';

const IntegrationCard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [integration1, setIntegration1] = useState(true);
  const [integration2, setIntegration2] = useState(false);

  return (
    <Card className='w-full bg-primary-background text-white border-[#3D494A]'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-6'>
        <CardTitle className='text-2xl font-normal'>
          <Collapsible>
            <CollapsibleTrigger
              onClick={() => setIsOpen(!isOpen)}
              className='flex items-center text-xl font-bold'
            >
              Integration <ChevronDown className='ml-2 h-4 w-4' />
            </CollapsibleTrigger>
          </Collapsible>
        </CardTitle>
        <div className='flex items-center space-x-2'>
          <div className='relative ml-4'>
            <Search className='absolute left-2 top-3 h-4 w-4 text-border-primary' />
            <Input
              placeholder='Search'
              className='pl-8 bg-[hsl(185,12%,20%)] border-none text-white placeholder-border-primary focus-visible:ring-0 focus-visible:ring-offset-0 '
            />
          </div>
          <Button className='bg-primary hover:bg-red-700'>
            New Connection
          </Button>
        </div>
      </CardHeader>
      <Collapsible open={isOpen}>
        <CollapsibleContent>
          <CardContent>
            <div className='mb-4 flex items-center gap-4'>
              <h3 className='text-base font-bold'>Enabled Integrations</h3>
              <ChevronDown className='h-4 w-4' />
            </div>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                  <div className='flex items-center gap-4'>
                    <span className='text-gray-400'>Lorem Ips</span>
                    <Switch
                      checked={integration1}
                      onCheckedChange={setIntegration1}
                      className='data-[state=checked]:bg-red-500'
                    />
                  </div>
                  <div className='flex items-center gap-4'>
                    <span className='text-gray-400'>Lorem Ips</span>
                    <Switch
                      checked={integration2}
                      onCheckedChange={setIntegration2}
                      className='data-[state=checked]:bg-red-500'
                    />
                  </div>
                </div>
                <Button variant='outline' size='icon'>
                  <MoreHorizontal className='h-4 w-4' />
                </Button>
              </div>
              <div className='flex gap-2'>
                <Input
                  placeholder='API Key'
                  className='bg-transparent border-border-primary focus-visible:ring-0 focus-visible:ring-offset-0  text-white'
                />
                <Input
                  placeholder='Credentials'
                  className='bg-transparent border-border-primary    focus-visible:ring-0 focus-visible:ring-offset-0  text-white'
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className='flex justify-between'>
            <Button
              variant='secondary'
              className='bg-[hsl(185,12%,20%)] text-white hover:bg-[hsl(185,12%,24%)]'
            >
              Test Connection
            </Button>
            <div className='flex items-center space-x-2'>
              <Button
                variant='outline'
                className='bg-white text-black hover:bg-gray-200'
              >
                Cancel
              </Button>
              <Button variant='outline' size='icon'>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </div>
          </CardFooter>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default IntegrationCard;
