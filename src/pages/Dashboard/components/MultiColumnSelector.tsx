import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import useGetUserQueryMutation from '@/api/hooks/useGetUserQueryMutation';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import useDataSetColumnsStore from '@/store/useDataSetColumns';

const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one item.',
  }),
});

type Column = {
  column_name: string;
  column_type: string;
};

export function MultiColumnSelector({
  columns,
  handleColumnSubmitted,
}: {
  columns: Column[];
  handleColumnSubmitted: () => void;
}) {
  const { mutateAsync: getUserQuery, isPending } = useGetUserQueryMutation();
  const { schema, setSelectedColumns, columnsData } = useDataSetColumnsStore();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: [],
    },
  });

  const handleSelectAll = () => {
    const allColumnNames = columns.map((column) => column.column_name);
    const currentValues = form.getValues('items');

    if (currentValues.length === columns.length) {
      form.setValue('items', []);
    } else {
      form.setValue('items', allColumnNames);
    }
  };

  const selectedCount = form.watch('items').length;

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setSelectedColumns(data.items);
    
    await getUserQuery({
      columns: data.items,
      datasource: 'bigquery',
      db: '',
      table_name: columnsData?.tableId || '',
      metadata: schema.metadata
    });
    
    handleColumnSubmitted();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <p className='text-white text-sm'>Columns</p>
        <div className='flex flex-row items-center justify-between'>
          <button
            type='button'
            onClick={handleSelectAll}
            className='text-sm font-normal text-white hover:text-primary'
          >
            {selectedCount === columns.length ? 'Unselect All' : 'Select All'}
          </button>
          <p className='text-sm font-normal text-white'>
            Selected {selectedCount} columns
          </p>
        </div>
        <FormField
          control={form.control}
          name='items'
          render={() => (
            <FormItem>
              {columns.map((column) => (
                <FormField
                  key={column.column_name}
                  control={form.control}
                  name='items'
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={column.column_name}
                        className='flex flex-row items-center justify-between space-x-3 space-y-0'
                      >
                        <FormLabel className='flex gap-2 items-center text-sm font-normal capitalize text-white'>
                          <p className='text-sm font-normal capitalize text-white'>
                            {column.column_name.replace(/_/g, ' ')}
                          </p>
                          <span className='text-xs font-normal text-border-primary'>
                            ({column.column_type})
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Checkbox
                            className='bg-white accent-primary data-[state=checked]:bg-primary'
                            checked={field.value?.includes(column.column_name)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([
                                    ...field.value,
                                    column.column_name,
                                  ])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== column.column_name
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex justify-end'>
          <Button
            variant='default'
            type='submit'
            disabled={isPending}
            className='bg-primary hover:bg-primary/80 text-white'
          >
            {isPending ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              'Add Columns'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}