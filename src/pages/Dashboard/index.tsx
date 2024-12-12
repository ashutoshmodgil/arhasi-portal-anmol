import useGetDashboardCharts from '@/api/hooks/useGetDashboardCharts';
import useChartsDataStore from '@/store/useChartsData';
import { useParams } from 'react-router-dom';

import BiaxialBarChart from './components/charts/BiaxialBarChart';

import PortfolioPieChart from './components/charts/PieChart';

import ProgressBars2 from './components/charts/new-charts/ProgressChart2';

import AssetClassBreakdown from './components/charts/VerticalBarChart';
import LineChartV2 from './components/charts/new-charts/LineChartV2';
import StackedBarChartV2 from './components/charts/new-charts/StakedBarChartV2';

import LineChartV1 from './components/charts/LineChartv1';
import EmployeeRetentionChart2 from './components/charts/new-charts/AreaChart2';
import GaugeChart from './components/charts/new-charts/GaugeChart';
import HeatMapv2 from './components/charts/new-charts/HeatMapv2';
import PackedBubbleChart from './components/charts/new-charts/PackedBubbleChart';
import TableChart from './components/charts/new-charts/Tablechart';

// import { ModeToggle } from './mode-toggle';

import { useNavigate } from 'react-router-dom';

import useGetDashboardById from '@/api/hooks/useGetDashboardById';
import { useEffect } from 'react';
import ScatterPlotChart from './components/charts/ScatterPlotChart';
import TreemapChart from './components/charts/new-charts/TreeMapChart';
import SubHeader from './components/SubHeader';
import AccountOverview from './components/AccountOverview';
import MetricCard from './components/MetricCard';
import TeamAccessTable from './components/TeamAccessTable';

const Dashboard = () => {
  const navigate = useNavigate();

  const { chartsData } = useChartsDataStore();
  const { dashboard_id = '' } = useParams();

  const { data } = useGetDashboardCharts({
    dashboard_id,
  });

  const { mutate: getDashboardById, data: dashboardData } = useGetDashboardById(
    {}
  );

  useEffect(() => {
    if (dashboard_id) {
      getDashboardById({ dashboard_id });
    }
  }, [dashboard_id]);

  const renderChart = (type: string, index: number, chart: any) => {
    console.log({ type, index, chart });
    switch (type) {
      case 'line_chart':
        return <LineChartV1 key={index} data={chart} />;
      case 'area_chart':
        return <EmployeeRetentionChart2 key={index} data={chart} />;

      case 'packed_bubble_chart':
        return <PackedBubbleChart key={index} data={chart} />;
      case 'treemap_chart':
        return <TreemapChart key={index} data={chart} />;
      case 'scatter_plot':
        return <ScatterPlotChart key={index} data={chart} />;
      case 'table':
        return <TableChart key={index} data={chart} />;
      case 'dual_line_chart':
        return <LineChartV2 key={index} data={chart} />;
      case 'bar_chart':
        return <AssetClassBreakdown key={index} data={chart} />;

      case 'biaxial_bar_chart':
        return <BiaxialBarChart key={index} data={chart} />;
      case 'progress_chart':
        return <ProgressBars2 key={index} data={chart} />;
      case 'stacked_bar_chart':
        return <StackedBarChartV2 key={index} data={chart} />;
      case 'pie_chart':
        return <PortfolioPieChart key={index} data={chart} />;

      case 'heat_map':
        return <HeatMapv2 key={index} chartData={chart} />;
      case 'gauge_chart':
        return <GaugeChart key={index} data={chart} />;
      // case 'rollup_chart':
      //   return <RollUpCharts key={index} data={chart} />;
      default:
        return null;
    }
  };

  // Determine if AddNewGraphCard should be in left or right column based on the last chart's index
  const isAddNewGraphInLeftColumn = chartsData.length % 2 === 0;

  const metrics = [
    {
      title: "Savant Enterprise",
      subtitle: "AI Agent Deployment",
      percentage: "85.4%",
      description: "of storage used",
      fillPercentage: 85,
      growth: "1.12%",
      actionText: "Open Savant Enterprise",
      info: ""
    },
    {
      title: "RAPID Chat",
      subtitle: "AI-Powered Dialogue",
      percentage: "60.2%",
      description: "activity this month",
      fillPercentage: 60,
      growth: "1.12%",
      actionText: "Open RAPID Chat",
      info: "Savant Enterprise"
    },
    {
      title: "RAPID Insight",
      subtitle: "AI/BI Data Insights",
      percentage: "45.1%",
      description: "of data capacity used",
      fillPercentage: 45,
      growth: "1.12%",
      actionText: "Open RAPID Insights",
      info: "Savant Enterprise"
    }
  ];

  return (
    <div className='px-6'>
      <SubHeader />
      <div className="flex gap-4">
        <div className="w-[400px]">
          <AccountOverview />
        </div>
        <div className="grid grid-cols-3 gap-4 flex-1">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>
      </div>
      <div className='mt-4 w-[390px] max'>
      <TeamAccessTable />
      </div>
      
    </div>
    //       <Upgrade />

    //       <div className='grid grid-cols-4 gap-4'>
    //         {data?.data
    //           .filter((chart: any) => chart.chart_type[0] === 'rollup_chart')
    //           .map((chart: any, index: number) => (
    //             <RollUpCharts key={index} data={chart} />
    //           ))}
    //       </div>

    //       <div className='my-4 grid grid-cols-2 gap-x-4'>
    //         <div className='w-full col-span-1 space-y-4'>
    //           {data?.data
    //             .filter((_: any, index: number) => index % 2 === 0) // Left column charts
    //             .map((chart: { chart_type: string[] }, index: number) =>
    //               renderChart(chart.chart_type[0], index, chart)
    //             )}

    //           {/* Conditionally render AddNewGraphCard in left column */}
    //           {isAddNewGraphInLeftColumn && <AddNewGraphCard />}
    //         </div>

    //         <div className='w-full col-span-1 space-y-4'>
    //           <div className='flex w-full flex-col gap-4 lg:flex-row gap-x-4'></div>

    //           {data?.data
    //             .filter((_: any, index: number) => index % 2 !== 0) // Right column charts
    //             .map((chart: { chart_type: string[] }, index: number) =>
    //               renderChart(chart.chart_type[0], index, chart)
    //             )}

    //           {/* Conditionally render AddNewGraphCard in right column */}
    //           {!isAddNewGraphInLeftColumn && <AddNewGraphCard />}
    //         </div>
    //       </div>

    //       {/* Chat Bot */}
    //       <div className='fixed bottom-5 right-5 cursor-pointer z-50'>
    //   <div 
    //     className={dashboardData?.image ? 'h-12 w-12' : 'h-24 w-24'} 
    //     onClick={() => {
    //       navigate(PageRoutes.dashboardChatbot.replace(':dashboard_id', dashboard_id));
    //     }}
    //   >
    //     <img
    //       src={dashboardData?.image ? `data:image/png;base64,${dashboardData?.image}` : Chatbot}
    //       alt='logo'
    //       className='h-full w-full object-cover rounded-full'
    //     />
    //   </div>
    // </div>
    //     </div>
  );
};

export default Dashboard;
