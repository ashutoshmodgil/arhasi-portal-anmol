import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2 } from 'lucide-react';
import useDataSetColumnsStore from '@/store/useDataSetColumns';
import useChartDetailGenerationMutation from '@/api/hooks/useChartDetailGenerationMutation';
import { SetStateAction, Dispatch } from 'react';

const FormSchema = z.object({
  item: z.string({
    message: 'You have to select at least one item.',
  }),
});

type Questions = string[];

export function SingleQuestionSelector({
  questions,
  setIsChartDetailsGenerationOpen,
}: {
  questions: Questions;
  setIsChartDetailsGenerationOpen: Dispatch<
    SetStateAction<{
      open: boolean;
      data: any;
    }>
  >;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      item: '',
    },
  });

  const { mutateAsync: chartDetailsGenerationMutation, isPending } =
    useChartDetailGenerationMutation();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const store = useDataSetColumnsStore.getState();
    
    const chartDetails = await chartDetailsGenerationMutation({
      payload: {
        user_query: data.item,
        columns: store.selectedColumns,
        datasource: 'bigquery',
        db: '',
        table_name: store.columnsData?.tableId || '',
      },
    });

    if (chartDetails) {
      setIsChartDetailsGenerationOpen({
        open: true,
        data: chartDetails,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormItem>
          <FormField
            control={form.control}
            name='item'
            render={({ field }) => {
              return (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className='flex flex-col space-y-1 text-white'
                    >
                      {questions.map((question) => (
                        <FormItem
                          key={question}
                          className='flex items-center space-x-3 space-y-0'
                        >
                          <FormControl>
                            <RadioGroupItem
                              className='text-primary bg-white'
                              value={question}
                            />
                          </FormControl>
                          <FormLabel className='font-normal leading-5'>
                            {question}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              );
            }}
          />
          <FormMessage />
        </FormItem>

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
              'Select Question'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}