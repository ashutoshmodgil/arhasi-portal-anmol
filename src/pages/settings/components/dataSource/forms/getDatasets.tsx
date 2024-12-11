import { Button } from '@/components/ui/button';
import { Form, FormControl, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Controller, SubmitHandler, UseFormReturn } from 'react-hook-form';
import { GetDatasetsFormValues } from '../dataSourceConnection';

const GetDatasets = ({
  form,
  handleSubmit,
}: {
  form: UseFormReturn<GetDatasetsFormValues>;
  handleSubmit: SubmitHandler<GetDatasetsFormValues>;
}) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className='grid grid-cols-5 gap-4'>
          <Controller
            control={form.control}
            name='projectName'
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem className='col-span-2'>
                <FormControl>
                  <Input
                    {...field}
                    type='text'
                    placeholder='Enter your project name'
                    className=' bg-transparent border-border-primary focus-visible:ring-0 focus-visible:ring-offset-0  text-white'
                  />
                </FormControl>
                {/* <FormMessage /> */}
              </FormItem>
            )}
          />

          <Controller
            control={form.control}
            name='serviceAccountNumber'
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem className='col-span-2'>
                <FormControl>
                  <Input
                    {...field}
                    type='text'
                    placeholder='Enter your service account number'
                    className=' bg-transparent border-border-primary focus-visible:ring-0 focus-visible:ring-offset-0  text-white'
                  />
                </FormControl>
                {/* <FormMessage /> */}
              </FormItem>
            )}
          />

          <Button
            variant='outline'
            type='submit'
            className='bg-white text-black hover:bg-gray-200'
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default GetDatasets;
