import { useMutation } from '@tanstack/react-query';
import handleCreateDashboard from '../create-dashboard';

type Props = {
  dashboard_name: string;
};

const useCreateDashboard = ({ onSuccess }: { onSuccess: () => void }) => {
  return useMutation({
    mutationFn: (props: Props) => handleCreateDashboard(props),
    onSuccess() {
      onSuccess();
    },
  });
};

export default useCreateDashboard;
