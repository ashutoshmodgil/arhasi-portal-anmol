import useCreateNewChart from '@/api/hooks/useCreateNewChart';
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
import useChartsDataStore from '@/store/useChartsData';
import useDataSetColumnsStore from '@/store/useDataSetColumns';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { z } from 'zod';

const FormSchema = z.object({
  item: z.string({
    message: 'You have to select at least one item.',
  }),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SelectChartType = ({ data }: { data: any }) => {
  const { dashboard_id = '' } = useParams();
  const { setChartsData } = useChartsDataStore();

  const { schema } = useDataSetColumnsStore();

  const { mutate: createNewChart } = useCreateNewChart(dashboard_id);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      item: '',
    },
  });

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    const newChartData = {
      ...data,
      chart_type: [values.item],
      dashboard_id,
      datasource_id: schema.datasource_id,
    };
console.log(data)
    createNewChart(newChartData);

    setChartsData([
      ...useChartsDataStore.getState().chartsData,
      { ...newChartData, type: values.item },
    ]);
  };

  // Ensure chart_type is always an array for mapping
  const chartTypes = Array.isArray(data.chart_type)
    ? data.chart_type
    : [data.chart_type];

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
                      className='flex flex-col space-y-1 text-white '
                    >
                      {chartTypes.map((chart: string) => (
                        <FormItem
                          key={chart}
                          className='flex items-center space-x-3 space-y-0 '
                        >
                          <FormControl>
                            <RadioGroupItem
                              className='text-primary bg-white'
                              value={chart}
                            />
                          </FormControl>
                          <FormLabel className='font-normal leading-5'>
      {chart.replace(/_/g, '     ')}
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
            className='bg-primary hover:bg-primary/80 text-white'
          >
            Select Chart Type
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SelectChartType;
