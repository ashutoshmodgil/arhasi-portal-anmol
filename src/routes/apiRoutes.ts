export const API_ROUTES = {
  login: '/login',
  apiConnection: '/api_connections/',
  connectDb: '/db_connections/',
  dashboard: '/dashboards/',
  deleteDashboard: (user_id: string, dashboard_id: string) =>
    `/delete_dashboard?user_id=${user_id}&dashboard_id=${dashboard_id}`,
  getDatasets: '/bigquery/datasets',
  getDatasetsTables: (dataset: string) =>
    `/bigquery/datasets/${dataset}/tables`,
  getDatasetColumns: (tableId: string) =>
    `/bigquery/datasets/${tableId}/columns`,
  getUserQuery: '/get_user_query',
  getSchema: '/get_schema/',
  sqlGeneration: '/sql_generation',
  chartDetailsGeneration: '/chart_details_generation',
  getUserDashboards: (user_id: string) => `/dashboards/user/${user_id}`,
  getDashboardCharts: (dashboard_id: string) =>
    `/charts/dashboard/${dashboard_id}`,
  charts: '/charts/',
  dashboard_agent_chat: '/dashboard_agent_chat',
  deleteChart: (dashboard_id: string, chart_id: string) =>
    `/delete_chart?dashboard_id=${dashboard_id}&chart_id=${chart_id}`,
  updateDashboard: (dashboard_id: string, dashboard_name: string) =>
    `edit_dashboard_name?dashboard_id=${dashboard_id}&dashboard_name=${dashboard_name}`,

  uniqueColumns: '/unique_columns',
  uniqueColumnValues: '/unique_column_values',
  filterJsonData: '/filter_json_data',

  upload_image: (dashboard_id: string) =>
    `/upload-image?dashboard_id=${dashboard_id}`,
  get_dashboard_by_id: (dashboard_id: string) =>
    `/get_dashboard_by_id?dashboard_id=${dashboard_id}`,
  
editChartName: (dashboard_id: string, chart_id: string, chart_name: string) =>
  `/edit_chart_name?dashboard_id=${dashboard_id}&chart_id=${chart_id}&chart_name=${chart_name}`,
};
