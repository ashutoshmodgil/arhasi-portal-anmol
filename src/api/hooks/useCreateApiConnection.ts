import { useMutation } from '@tanstack/react-query';

import handleCreateNewAPIConnection from '../create-api-connection';

type Props = {
  user_id: string;
  url: string;
  headers?: object;
  parameters?: object;
};

const useCreateApiConnection = () => {
  return useMutation({
    mutationFn: (props: Props) => handleCreateNewAPIConnection(props),
  });
};

export default useCreateApiConnection;
