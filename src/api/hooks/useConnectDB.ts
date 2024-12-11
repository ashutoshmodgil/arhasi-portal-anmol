import { useMutation } from '@tanstack/react-query';
import handleConnectDatabase from '../connect-db';
import { toast } from '@/hooks/use-toast';

const useConnectDB = () => {
  return useMutation({
    mutationKey: ['connect-db'],
    mutationFn: handleConnectDatabase,
    onSuccess: () => {
      toast({
        title: 'Database connected successfully',
      });
    },
  });
};

export default useConnectDB;
