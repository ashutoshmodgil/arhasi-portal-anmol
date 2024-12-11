import { DATA_SET_COLUMNS_STORE } from '@/config';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Schema = Record<string, string[]>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SampleRows = Record<string, any[]>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Metadata = Record<string, any>;

export type SchemaData = {
  schema: Schema;
  sample_rows: SampleRows;
  metadata: Metadata;
  datasource_id: string;
};

type ColumnsData = {
  datasetName: string;
  tableId: string;
  columns: {
    column_name: string;
    column_type: string;
  }[];
};

export type SqlGeneratedData = {
  sql_query: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data_rows: Array<any>;
};

interface ColumnsState {
  datasetNamesAccordingToDashboardId: Record<string, string>;

  selectedColumns: string[];
  datasetName: string;
  columnsData: ColumnsData;
  questions: string[];
  schema: SchemaData;
  sqlGeneratedData: SqlGeneratedData;
  setDatasetNamesAccordingToDashboardId: (
    datasetNames: Record<string, string>
  ) => void;

  setSelectedColumns: (setSelectedColumns: string[]) => void;
  setDataSourceColumns: (columnsData: ColumnsData) => void;
  setQuestions: (questions: string[]) => void;
  setSchema: (schema: SchemaData) => void;
  setSqlGeneratedData: (sqlGeneratedData: SqlGeneratedData) => void;
  emptyData: () => void;
}

const useDataSetColumnsStore = create(
  persist<ColumnsState>(
    (set) => ({
      datasetNamesAccordingToDashboardId: {},
      selectedColumns: [],
      datasetName: '',
      columnsData: {
        datasetName: '',
        tableId: '',
        columns: [
          {
            column_name: '',
            column_type: '',
          },
        ],
      },
      questions: [],
      schema: {
        schema: {},
        sample_rows: {},
        metadata: {},
        datasource_id: '',
      },
      sqlGeneratedData: {
        sql_query: '',
        data_rows: [],
      },
      setDatasetNamesAccordingToDashboardId: (
        datasetNamesAccordingToDashboardId
      ) => set({ datasetNamesAccordingToDashboardId }),

      setSelectedColumns: (selectedColumns) => set({ selectedColumns }),
      setDataSourceColumns: (columnsData) => set({ columnsData }),
      setQuestions: (questions) => set({ questions }),
      setSchema: (schema) => set({ schema }),
      setSqlGeneratedData: (sqlGeneratedData) => set({ sqlGeneratedData }),
      emptyData: () =>
        set({
          selectedColumns: [],
          datasetName: '',
          columnsData: {
            datasetName: '',
            tableId: '',
            columns: [],
          },
          questions: [],
          schema: {
            schema: {},
            sample_rows: {},
            metadata: {},
            datasource_id: '',
          },
          sqlGeneratedData: {
            sql_query: '',
            data_rows: [],
          },
        }),
    }),
    {
      name: DATA_SET_COLUMNS_STORE,
    }
  )
);

export default useDataSetColumnsStore;
