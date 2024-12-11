import { CHARTS_DATA_STORE } from '@/config';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type chartDataTypes = {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chartContent: Record<string, any>;
};

interface ChartDataState {
  chartsData: chartDataTypes[];
  setChartsData: (chartData: chartDataTypes[]) => void;
  removeChart: (index: number) => void;
}

const useChartsDataStore = create(
  persist<ChartDataState>(
    (set) => ({
      chartsData: [],
      setChartsData: (chartsData) => set({ chartsData }),
      removeChart: (index) =>
        set((state) => ({
          chartsData: state.chartsData.filter((_, i) => i !== index),
        })),
    }),
    {
      name: CHARTS_DATA_STORE,
    }
  )
);

export default useChartsDataStore;
