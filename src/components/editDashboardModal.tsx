import useUserStore from '@/store/userStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import useUpdateDashboard from '@/api/hooks/useUpdateDashboard';

const EditDashboardModal = ({
  open,
  onClose,
  dashboard_name,
  dashboard_id,
}: {
  open: boolean;
  onClose: () => void;
  dashboard_name: string;
  dashboard_id: string;
}) => {
  const queryClient = useQueryClient();

  const user_id = useUserStore.getState().user.user_id || '';
  const { mutate: updateDashboard, isPending } = useUpdateDashboard({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-dashboards', user_id] });
      onClose();
    },
  });

  const form = useForm<{
    dashboard_name: string;
  }>({
    defaultValues: {
      dashboard_name: dashboard_name,
    },
    resolver: zodResolver(
      z.object({
        dashboard_name: z.string().min(1, 'Dashboard name is required'),
      })
    ),
  });

  const onSubmit = (data: { dashboard_name: string }) => {
    updateDashboard({
      //   user_id: user.user_id as string,
      dashboard_id,
      dashboard_name: data.dashboard_name,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='bg-primary-background border-border-primary'>
        <DialogHeader className='text-white'>Create Dashboard</DialogHeader>
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
                {isPending ? 'Updating...' : 'Update'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDashboardModal;
