import useCreateDashboard from '@/api/hooks/useCreateDashboard';
import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader } from './ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { useQueryClient } from '@tanstack/react-query';
import useUserStore from '@/store/userStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

const CreateDashboardModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const queryClient = useQueryClient();

  const user_id = useUserStore.getState().user.user_id || '';
  const { mutate: createDashboard, isPending } = useCreateDashboard({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-dashboards', user_id] });
      setIsSuccess(true); // Set success state to true when creation is successful
    },
  });

  const [isSuccess, setIsSuccess] = useState(false); // Track if the creation was successful

  const form = useForm<{
    dashboard_name: string;
  }>( {
    defaultValues: {
      dashboard_name: '',
    },
    resolver: zodResolver(
      z.object({
        dashboard_name: z.string().min(1, 'Dashboard name is required'),
      })
    ),
  });

  const onSubmit = (data: { dashboard_name: string }) => {
    createDashboard({
      dashboard_name: data.dashboard_name,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='bg-primary-background border-border-primary'>
        <DialogHeader className='text-white'>
          {isSuccess ? 'Dashboard Created Successfully' : 'Create Dashboard'}
        </DialogHeader>

        {/* Display success message after dashboard is created */}
        {!isSuccess ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name='dashboard_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-white'>Dashboard Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Dashboard name'
                        {...field}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            form.handleSubmit(onSubmit)();
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className='mt-10'>
                <Button
                  variant='outline'
                  className='text-black bg-white'
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  className='text-white bg-primary hover:bg-primary'
                  variant='default'
                  disabled={isPending}
                >
                  {isPending ? 'Creating...' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="text-center">
            <p className="text-white">Your dashboard has been created successfully!</p>
            <DialogFooter className='mt-10'>
              <Button
                variant='outline'
                className='text-black bg-white'
                onClick={onClose}
              >
                Close
              </Button>
              <Button
                className='text-white bg-primary hover:bg-primary'
                onClick={() => {
                  setIsSuccess(false); // Reset success state
                  onClose();
                }}
              >
                Edit
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateDashboardModal;
