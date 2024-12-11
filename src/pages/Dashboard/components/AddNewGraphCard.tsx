import { Plus } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import useDataSetColumnsStore from '@/store/useDataSetColumns';
import { MultiColumnSelector } from '@/pages/Dashboard/components/MultiColumnSelector';
import { SingleQuestionSelector } from '@/pages/Dashboard/components/SingleQuestionSelector';
import { useState } from 'react';
import SelectChartType from '@/pages/Dashboard/components/SelectChartType';
import SingleTableSelector from '@/pages/Dashboard/components/SingleTableSelector';

const AddNewGraphCard = () => {
  const { columnsData, questions } = useDataSetColumnsStore();
  const [isQuestionSelectorOpen, setIsQuestionSelectorOpen] = useState(false);
  const [isChartDetailsGenerationOpen, setIsChartDetailsGenerationOpen] =
    useState({
      open: false,
      data: {},
    });

  const handleColumnSubmitted = () => {
    setIsQuestionSelectorOpen(true);
  };

  return (
    <>
      <Dialog
        open={isQuestionSelectorOpen}
        onOpenChange={setIsQuestionSelectorOpen}
      >
        <DialogContent className='sm:max-w-[600px] bg-primary-background backdrop-blur-sm text-white border border-[#3D494A]'>
          <DialogHeader>
            <DialogTitle className='text-white mb-2'>Questions</DialogTitle>
            <DialogDescription className='text-white'>
              Select the questions you want to use for this graph.
            </DialogDescription>
          </DialogHeader>

          <SingleQuestionSelector
            questions={questions}
            setIsChartDetailsGenerationOpen={setIsChartDetailsGenerationOpen}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={isChartDetailsGenerationOpen.open}
        onOpenChange={() =>
          setIsChartDetailsGenerationOpen((prev) => ({
            ...prev,
            open: !prev.open,
          }))
        }
      >
        <DialogContent className='sm:max-w-[600px] bg-primary-background backdrop-blur-sm text-white border border-[#3D494A]'>
          <DialogHeader>
            <DialogTitle className='text-white mb-2'>
              Select Chart Type
            </DialogTitle>
            <DialogDescription className='text-white'>
              Select the chart type you want to use for this graph.
            </DialogDescription>
          </DialogHeader>

          <SelectChartType data={isChartDetailsGenerationOpen.data} />
        </DialogContent>
      </Dialog>

      <div className='w-full bg-primary-background text-white border border-[#3D494A] rounded-lg'>
        <div className='flex flex-row items-center justify-between px-4 py-2 border-b border-[#3D494A]'>
          <h2 className='text-xl font-bold'>Add New graph</h2>
        </div>
        <Dialog>
          <div className='px-4 pb-2 flex items-center justify-center h-40 cursor-pointer'>
            <DialogTrigger asChild>
              <Plus className='h-16 w-16' />
            </DialogTrigger>
          </div>
          <DialogContent className='sm:max-w-[600px] bg-primary-background backdrop-blur-sm text-white border border-[#3D494A]'>
            <DialogHeader>
              <DialogTitle className='text-white'>Table & Columns</DialogTitle>
              <DialogDescription className='text-white'>
                Select the table and its columns you want to use for this graph.
              </DialogDescription>
            </DialogHeader>

            <SingleTableSelector />

            <MultiColumnSelector
              columns={columnsData.columns}
              handleColumnSubmitted={handleColumnSubmitted}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* <QuestionSelectorDialog
        open={isQuestionSelectorOpen}
        onOpenChange={setIsQuestionSelectorOpen}
        questions={questions}
        onQuestionSelect={handleQuestionSelect}
      />  */}
    </>
  );
};

export default AddNewGraphCard;
