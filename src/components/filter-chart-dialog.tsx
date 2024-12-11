import useUniqueColumns from '@/api/hooks/filter-charts/unique-columns';
import useUniqueColumnsValues from '@/api/hooks/filter-charts/unique-columns-value';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader } from './ui/dialog';
import useFilterJSONData from '@/api/hooks/filter-charts/filterJsonData';
import { Checkbox } from '@/components/ui/checkbox';

const ChartFieldFormSchema = z.object({
  chart_field: z.string({
    message: 'You have to select at least one item.',
  }),
});

const ChartValueFormSchema = z.object({
  chart_value: z
    .array(z.union([z.string(), z.number()]), {
      required_error: 'You have to select at least one item.',
    })
    .min(1, 'You have to select at least one item.'),
});

const FilterChartDialog = ({
  open,
  onClose,
  dataRows,
  chartId,
  setChartData,
}: {
  open: boolean;
  onClose: () => void;
  dataRows: Record<string, string | number>[];
  chartId: string;
  setChartData: (args: any) => void;
}) => {
  const {
    mutate: mutateUniqueColumns,
    data: uniqueColumns,
    isPending: isUniqueColumnsPending,
  } = useUniqueColumns();

  const {
    mutate: mutateUniqueColumnsValues,
    data: uniqueColumnValues,
    isPending: isUniqueColumnValuesPending,
  } = useUniqueColumnsValues();

  const { mutate: mutateFilterJSONData, data: filteredData } =
    useFilterJSONData();

  useEffect(() => {
    mutateUniqueColumns({
      data_rows: dataRows,
    });
  }, [dataRows, mutateUniqueColumns]);

  const onSubmitUniqueColumns = (chart_field: string) => {
    mutateUniqueColumnsValues({
      data_rows: dataRows,
      field_to_filter: chart_field,
    });
  };

  const onSubmitUniqueColumnsValues = (chart_value: (string | number)[]) => {
    mutateFilterJSONData({
      data_rows: uniqueColumnValues.data_rows,
      field_to_filter: uniqueColumnValues.field_to_filter,
      values_to_filter: chart_value,
      chart_id: chartId,
    });
  };

  useEffect(() => {
    if (filteredData) {
      setChartData(filteredData);
      onClose();
    }
  }, [filteredData]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='bg-primary-background border-border-primary max-h-[80vh] flex flex-col [&>button>svg]:text-white'>
        <DialogHeader className='text-white'>Filter</DialogHeader>

        {uniqueColumnValues?.unique_values?.length > 0 ? (
          <UniqueColumnValuesForm
            uniqueColumnValues={uniqueColumnValues}
            isUniqueColumnValuesPending={isUniqueColumnValuesPending}
            onSubmitUniqueColumnsValues={onSubmitUniqueColumnsValues}
            onClose={onClose}
          />
        ) : (
          <UniqueColumnForm
            uniqueColumns={uniqueColumns}
            isUniqueColumnsPending={isUniqueColumnsPending}
            onSubmitUniqueColumns={onSubmitUniqueColumns}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

const UniqueColumnForm = ({
  uniqueColumns,
  isUniqueColumnsPending,
  onSubmitUniqueColumns,
  onClose,
}: {
  uniqueColumns: any;
  isUniqueColumnsPending: boolean;
  onSubmitUniqueColumns: (chart_field: string) => void;
  onClose: () => void;
}) => {
  const form = useForm<z.infer<typeof ChartFieldFormSchema>>({
    resolver: zodResolver(ChartFieldFormSchema),
    defaultValues: {
      chart_field: '',
    },
  });

  const onSubmit = (data: { chart_field: string }) => {
    onSubmitUniqueColumns(data.chart_field);
  };

  return (
    <>
      {isUniqueColumnsPending ? (
        <p className='text-white'>Loading...</p>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
            <FormItem className="flex-grow overflow-hidden">
              <FormField
                control={form.control}
                name='chart_field'
                render={({ field }) => {
                  return (
                    <FormItem className="h-full">
                      <FormControl>
                        <div className="max-h-[40vh] overflow-y-auto pr-4">
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className='flex flex-col space-y-1 text-white'
                          >
                            {uniqueColumns?.unique_fields?.map(
                              (field: string) => (
                                <FormItem
                                  key={field}
                                  className='flex items-center space-x-3 space-y-0'
                                >
                                  <FormControl>
                                    <RadioGroupItem
                                      className='text-primary bg-white'
                                      value={field}
                                    />
                                  </FormControl>
                                  <FormLabel className='font-normal leading-5'>
                                    {field}
                                  </FormLabel>
                                </FormItem>
                              )
                            )}
                          </RadioGroup>
                        </div>
                      </FormControl>
                    </FormItem>
                  );
                }}
              />

              <FormMessage />
            </FormItem>

            <DialogFooter className='mt-4'>
              <Button
                type='button'
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
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      )}
    </>
  );
};

const UniqueColumnValuesForm = ({
  uniqueColumnValues,
  isUniqueColumnValuesPending,
  onSubmitUniqueColumnsValues,
  onClose,
}: {
  uniqueColumnValues: any;
  isUniqueColumnValuesPending: boolean;
  onSubmitUniqueColumnsValues: (chart_value: (string | number)[]) => void;
  onClose: () => void;
}) => {
  const form = useForm<z.infer<typeof ChartValueFormSchema>>({
    resolver: zodResolver(ChartValueFormSchema),
    defaultValues: {
      chart_value: [],
    },
  });

  const onSubmit = (data: { chart_value: (string | number)[] }) => {
    onSubmitUniqueColumnsValues(data.chart_value);
  };

  return (
    <>
      {isUniqueColumnValuesPending ? (
        <p className='text-white'>Loading...</p>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
            <FormItem className="flex-grow overflow-hidden">
              <FormField
                control={form.control}
                name='chart_value'
                render={({ field }) => {
                  return (
                    <FormItem className="h-full">
                      <FormControl>
                        <div className="max-h-[40vh] overflow-y-auto pr-4">
                          <div className='flex flex-col space-y-1 text-white'>
                            {uniqueColumnValues?.unique_values?.map(
                              (value: string | number) => (
                                <FormItem
                                  key={value}
                                  className='flex items-center space-x-3 space-y-0'
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(value)}
                                      onCheckedChange={(checked) => {
                                        const updatedValues = checked
                                          ? [...(field.value || []), value]
                                          : field.value?.filter(
                                              (v: string | number) => v !== value
                                            ) || [];
                                        field.onChange(updatedValues);
                                      }}
                                      className='text-primary bg-white'
                                    />
                                  </FormControl>
                                  <FormLabel className='font-normal leading-5'>
                                    {value}
                                  </FormLabel>
                                </FormItem>
                              )
                            )}
                          </div>
                        </div>
                      </FormControl>
                    </FormItem>
                  );
                }}
              />

              <FormMessage />
            </FormItem>

            <DialogFooter className='mt-4'>
              <Button
                type='button'
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
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      )}
    </>
  );
};

export default FilterChartDialog;