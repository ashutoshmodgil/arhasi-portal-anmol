import { ArrowLeft } from 'lucide-react';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import ChatInput from './components/ChatInput';
import { chatBotMessage } from '@/api/get-chatbot-response';
import useCreateNewChart from '@/api/hooks/useCreateNewChart';
import ArhasiAvatar from '@/assets/arhasichatbot.svg';
import UserAvatar from '@/assets/you.png';
import { toast } from '@/hooks/use-toast';
import useDataSetColumnsStore from '@/store/useDataSetColumns';
import { useMutation } from '@tanstack/react-query';
import { FaAngleDoubleRight } from 'react-icons/fa';
import BiaxialBarChart from '../Dashboard/components/charts/BiaxialBarChart';
import LineChartV1 from '../Dashboard/components/charts/LineChartv1';
import EmployeeRetentionChart2 from '../Dashboard/components/charts/new-charts/AreaChart2';
import GaugeChart from '../Dashboard/components/charts/new-charts/GaugeChart';
import HeatMapv2 from '../Dashboard/components/charts/new-charts/HeatMapv2';
import LineChartV2 from '../Dashboard/components/charts/new-charts/LineChartV2';
import PackedBubbleChart from '../Dashboard/components/charts/new-charts/PackedBubbleChart';
import ProgressChart2 from '../Dashboard/components/charts/new-charts/ProgressChart2';
import StackedBarChartV2 from '../Dashboard/components/charts/new-charts/StakedBarChartV2';
import TableChart from '../Dashboard/components/charts/new-charts/Tablechart';
import TreeMapChart from '../Dashboard/components/charts/new-charts/TreeMapChart';
import RollUpCharts from '../Dashboard/components/charts/new-charts/RollUp';
import PortfolioPieChart from '../Dashboard/components/charts/PieChart';
import AssetClassBreakdown from '../Dashboard/components/charts/VerticalBarChart';
import useGetDashboardById from '@/api/hooks/useGetDashboardById';

const FormattedMessage = ({ text }) => (
  <ReactMarkdown 
    className='text-white text-[16px] prose prose-invert max-w-none'
    components={{
      p: ({ children }) => <p className='mb-4 last:mb-0'>{children}</p>,
      ul: ({ children }) => <ul className='list-disc pl-6 mb-4'>{children}</ul>,
      li: ({ children }) => <li className='mb-2'>{children}</li>,
      strong: ({ children }) => <strong className='font-bold'>{children}</strong>
    }}
  >
    {text}
  </ReactMarkdown>
);

type ChatBotRequest = {
  user_query: string;
  tableId: string;
};

type chatResponse = {
  sql_query: string;
  data_rows: Record<string, string | number>[];
  chat: string;
  chart_type: string[];
  y_axis_columns: string[];
  x_axis_columns: string[];
  chart_name: string;
};

const ScrollContext = createContext<(() => void) | null>(null);

const Chatbot = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userQuery, setUserQuery] = useState('');
  const { columnsData } = useDataSetColumnsStore();
  const { dashboard_id = '' } = useParams();

  const [chatData, setChatData] = useState<{
    query: string;
    response: chatResponse;
  }[]>([]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ChatBotRequest) => await chatBotMessage(data),
    onSuccess: (data) => {
      setChatData((prev) => [
        ...prev,
        {
          query: userQuery,
          response: data,
        },
      ]);
    },
    onError: (error) => {
      toast({
        title: 'Error Occurred',
        description: error.message,
      });
    },
  });

  const handleUserPayload = (userQueryText: string) => {
    setUserQuery(userQueryText);
    mutate({
      user_query: userQueryText,
      tableId: columnsData.tableId,
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const { mutate: getDashboardById, data: dashboardData } = useGetDashboardById({});

  useEffect(() => {
    if (dashboard_id) {
      getDashboardById({ dashboard_id });
    }
  }, [dashboard_id]);

  useEffect(() => {
    if (chatData.length > 0) {
      setTimeout(scrollToBottom, 100);
    }
  }, [chatData, isPending]);

  return (
    <ScrollContext.Provider value={scrollToBottom}>
      <div className='w-full bg-primary-background'>
        <div className='max-w-3xl mx-auto flex flex-col w-full h-screen'>
          <div
            className='flex items-center gap-2 my-4 cursor-pointer'
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className='w-6 h-6 text-white' />
            <p className='text-xl font-bold text-white'>Back</p>
          </div>

          <div className='flex flex-col gap-4 h-full overflow-y-auto hide-scrollbar px-4 pt-8'>
            {chatData.map((chat, index) => {
              console.log(chat)
              return(
              <div key={index} className='flex flex-col w-full'>
                <div className='flex items-start gap-3 p-4'>
                  <img
                    src={UserAvatar}
                    alt='User'
                    className='w-8 h-8 rounded-full flex-shrink-0 object-cover'
                  />
                  <div className='flex-1 mt-1'>
                    <div className='flex items-center gap-2'>
                      <span className='font-semibold text-sm text-white'>You</span>
                      <span className='text-xs text-gray-400'>• now</span>
                    </div>
                    <div className='rounded-lg py-2'>
                      <p className='text-white'>{typeof chat.query === 'string' ? chat.query : chat.query?.user_query}</p>
                    </div>
                  </div>
                </div>

                <div className='flex border border-[#111111] bg-[#595959ff] rounded-lg p-4 items-start gap-3'>
                  <img
                    src={dashboardData?.image ? `data:image/png;base64,${dashboardData?.image}` : ArhasiAvatar}
                    alt='Arhasi'
                    className='w-8 h-8 rounded-full flex-shrink-0 object-contain'
                  />
                  <div className='flex-1 mt-1'>
                    <div className='flex items-center gap-2 mb-1'>
                      <span className='font-semibold text-sm text-white'>Arhasi's Chat</span>
                      <span className='text-xs text-gray-400'>• now</span>
                    </div>
                    <div className='py-2'>
                      <div className='rounded-md'>
                        <FormattedMessage text={chat.response.chat} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className='mt-3'>
                  <ChatResponseChartButton chat={chat} />
                </div>
              </div>
              )
})}

            {isPending && (
              <>
                <div className='flex items-start gap-3'>
                  <img
                    src={UserAvatar}
                    alt='User'
                    className='w-8 h-8 rounded-full flex-shrink-0 object-cover'
                  />
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-1'>
                      <span className='font-semibold text-sm text-white'>You</span>
                      <span className='text-xs text-gray-400'>• typing...</span>
                    </div>
                    <div className='rounded-lg p-3'>
                      <p className='text-white'>{userQuery}</p>
                    </div>
                  </div>
                </div>

                <div className='flex items-start gap-3'>
                  <img
                    src={dashboardData?.image ? `data:image/png;base64,${dashboardData?.image}` : ArhasiAvatar}
                    alt='Arhasi'
                    className='w-8 h-8 rounded-full flex-shrink-0 object-contain'
                  />
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-1'>
                      <span className='font-semibold text-sm text-white'>Arhasi's Chat</span>
                      <span className='text-xs text-gray-400'>• thinking...</span>
                    </div>
                    <div className='bg-[#1A2527] rounded-lg p-4 border border-[#3D494A]'>
                      <div className='flex flex-col gap-2 animate-pulse'>
                        <div className='h-4 bg-gray-300 rounded w-3/4'></div>
                        <div className='h-4 bg-gray-300 rounded w-1/2'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className='mt-auto p-4'>
            <ChatInput isPending={isPending} handleUserPayload={handleUserPayload} />
          </div>
        </div>
      </div>
    </ScrollContext.Provider>
  );
};

const ChatResponseChartButton = ({
  chat,
}: {
  chat: { query: string; response: chatResponse };
}) => {
  const [chartType, setChartType] = useState<string>('');
  const scrollToBottom = useContext(ScrollContext);
  const { dashboard_id = '' } = useParams();
  const { mutate: createNewChart } = useCreateNewChart(dashboard_id);
  const { schema } = useDataSetColumnsStore();

  const handleCreateNewChart = () => {
    createNewChart({
      ...chat.response,
      dashboard_id,
      datasource_id: schema.datasource_id,
      chart_type: [chartType],
    });
  };

  const chatChartStyles = {
    containerStyle: {
      padding: '0.5rem',
    },
    tooltipStyle: {
      fontSize: '0.875rem',
    },
  };

  const renderChart = (type: string, chart: any) => {
    const charts = {
      line_chart: LineChartV1,
      area_chart: EmployeeRetentionChart2,
      packed_bubble_chart: PackedBubbleChart,
      table: TableChart,
      progress_chart: ProgressChart2,
      dual_line_chart: LineChartV2,
      bar_chart: AssetClassBreakdown,
      biaxial_bar_chart: BiaxialBarChart,
      stacked_bar_chart: StackedBarChartV2,
      pie_chart: PortfolioPieChart,
      gauge_chart: GaugeChart,
      heat_map: HeatMapv2,
      treemap_chart: TreeMapChart,
      rollup_chart:RollUpCharts,
    };

    const ChartComponent = charts[type];
    if (!ChartComponent) return null;

    return (
      <div style={chatChartStyles.containerStyle}>
        <ChartComponent
          data={type === 'heat_map' ? { chartData: chart } : chart}
          pinned
          onPin={handleCreateNewChart}
          compactMode={true}
        />
      </div>
    );
  };

  const handleChartTypeClick = (type: string) => {
    setChartType(type);
    setTimeout(scrollToBottom, 100);
  };

  return (
    <div className='w-full flex flex-col gap-4'>
      <div className='w-full flex items-center gap-2'>
        <button className='text-[#eeeeeeff] text-lg flex flex-row items-center gap-1 pointer-events-none font-bold px-3 py-1.5 bg-none rounded-md'>
          <FaAngleDoubleRight fill='#fff' width={30} height={30} /> Chart Types
        </button>
        <div className='flex gap-2'>
          {chat?.response?.chart_type.map((type: string) => (
            <button
              key={type}
              onClick={() => handleChartTypeClick(type)}
              className={`capitalize text-sm px-4 py-2 my-2 font-semibold rounded-md border-2 ${
                chartType === type
                  ? 'bg-none border-red-700 border-[#eeeeeeff] text-white'
                  : 'bg-[#ccccccff] border-[#3D494A] text-[#3a2f2fff]'
              }`}
            >
              {type.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className='w-full'>{renderChart(chartType, chat.response)}</div>
    </div>
  );
};

export default Chatbot;