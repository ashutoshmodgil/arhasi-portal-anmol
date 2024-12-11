import useDeleteDashboard from '@/api/hooks/useDeleteDashbaord';
import useUserStore from '@/store/userStore';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader } from './ui/dialog';

const DeleteDashboardModal = ({
  open,
  dashboard_id,
  onClose,
}: {
  open: boolean;
  dashboard_id: string;
  onClose: () => void;
}) => {
  const queryClient = useQueryClient();

  const user_id = useUserStore((state) => state.user.user_id);

  const { mutate: deleteDashboard, isPending } = useDeleteDashboard({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-dashboards', user_id] });
      onClose();
    },
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='bg-primary-background text-white'>
        <DialogHeader className='text-white'>Delete Dashboard</DialogHeader>
        <DialogDescription>
          Do you want to delete this dashboard?
        </DialogDescription>

        <DialogFooter>
          <Button variant='outline' className='text-white' onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant='default'
            className='bg-primary hover:bg-red-600'
            disabled={isPending}
            onClick={() => deleteDashboard(dashboard_id)}
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDashboardModal;
