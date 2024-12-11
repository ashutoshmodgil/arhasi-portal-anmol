import React, { useEffect, useRef } from 'react';

interface ChatMessageProps {
  id: string;
  isUser: boolean;
  avatar: string;
  name: string | undefined;
  time: string;
  message: string;
  messageType: string;
  data?: any;
  suggestedQuestions?: string[];
  showTable: any[];
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  isUser,
  avatar,
  name,
  data,
  showTable,
}) => {
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Function to format button text by removing underscores and capitalizing
  const formatButtonText = (text: string) => {
    return text
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <>
      <div
        className={`flex flex-col justify-center items-start bg-white mb-4 max-w-3xl w-screen p-4 ${
          isUser ? '' : 'border bg-[#FAFAFA]'
        } `}
      >
        <div className='flex items-start justify-between max-w-full w-full'>
          {avatar ? (
            <img src={avatar} alt='' className='h-10 w-10 rounded-full mr-3' />
          ) : (
            <div className='flex items-center justify-center h-10 w-10 rounded-full bg-brand-primary text-white mr-3'>
              {name ? name.charAt(0).toUpperCase() : 'U'}
            </div>
          )}

          <div className='w-full rounded-lg prose prose-td:'>
            <div className='flex justify-between items-center mb-2'>
              <div className='flex justify-start gap-3 items-center'>
                <span className='font-bold text-[#1E1E1E]'>{name}</span>
                <svg
                  width='4'
                  height='4'
                  viewBox='0 0 4 4'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <circle cx='2' cy='2' r='2' fill='#94A3B8' />
                </svg>
              </div>
              {isUser && (
                <div>
                  <svg
                    width='40'
                    height='40'
                    viewBox='0 0 40 40'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <g filter='url(#filter0_d_349_776)'>
                      <rect
                        x='5.5'
                        y='3.5'
                        width='29'
                        height='29'
                        rx='3.5'
                        stroke='#7F8A8C'
                        strokeOpacity='0.2'
                        shapeRendering='crispEdges'
                      />
                      <path
                        d='M20.0002 11.0626C14.7974 11.0626 13.0627 12.7974 13.0627 18.0001C13.0627 23.2029 14.7974 24.9376 20.0002 24.9376C25.2029 24.9376 26.9377 23.2029 26.9377 18.0001'
                        stroke='#94A3B8'
                        strokeWidth='1.3'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                      <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M25.6464 12.2279V12.2279C24.9016 11.5686 23.7639 11.6376 23.1046 12.3824C23.1046 12.3824 19.8279 16.0836 18.6916 17.3684C17.5539 18.6524 18.3879 20.4261 18.3879 20.4261C18.3879 20.4261 20.2659 21.0208 21.3864 19.7548C22.5076 18.4888 25.8009 14.7696 25.8009 14.7696C26.4601 14.0249 26.3904 12.8871 25.6464 12.2279Z'
                        stroke='#94A3B8'
                        strokeWidth='1.3'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                      <path
                        d='M22.2567 13.3507L24.953 15.738'
                        stroke='#94A3B8'
                        strokeWidth='1.3'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </g>
                    <defs>
                      <filter
                        id='filter0_d_349_776'
                        x='0'
                        y='0'
                        width='40'
                        height='40'
                        filterUnits='userSpaceOnUse'
                        colorInterpolationFilters='sRGB'
                      >
                        <feFlood floodOpacity='0' result='BackgroundImageFix' />
                        <feColorMatrix
                          in='SourceAlpha'
                          type='matrix'
                          values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
                          result='hardAlpha'
                        />
                        <feOffset dy='2' />
                        <feGaussianBlur stdDeviation='2.5' />
                        <feComposite in2='hardAlpha' operator='out' />
                        <feColorMatrix
                          type='matrix'
                          values='0 0 0 0 0.117647 0 0 0 0 0.117647 0 0 0 0 0.117647 0 0 0 0.08 0'
                        />
                        <feBlend
                          mode='normal'
                          in2='BackgroundImageFix'
                          result='effect1_dropShadow_349_776'
                        />
                        <feBlend
                          mode='normal'
                          in='SourceGraphic'
                          in2='effect1_dropShadow_349_776'
                          result='shape'
                        />
                      </filter>
                    </defs>
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div ref={messageEndRef} />
      <div>
        {data &&
          showTable.length > 0 &&
          (showTable[0].GRAPH || showTable[0].TABLE) && (
            <div className='flex flex-col gap-5 justify-center items-center'>
              <div className='flex justify-center items-center gap-4'>
                <div className='flex justify-start items-center gap-3'>
                  <p className='text-brand-primary font-semibold text-[14px]'>
                    Quick Options
                  </p>
                  <svg
                    width='7'
                    height='11'
                    viewBox='0 0 7 11'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M0.45001 5.63012L5.12997 0.950073L6.19001 1.95007L2.56348 5.63012L6.19001 8.95007L5.12997 10.3101L0.45001 5.63012Z'
                      fill='#C10104'
                    />
                  </svg>
                </div>
                <div className='flex justify-start items-center gap-3'>
                  {showTable.map((item, index) => (
                    Object.entries(item).map(([key, value]) => {
                      if (value === true) {
                        return (
                          <button
                            key={index}
                            className='px-4 py-2 bg-white rounded-md border border-[#E2E8F0] text-sm hover:bg-gray-50'
                          >
                            {formatButtonText(key)}
                          </button>
                        );
                      }
                      return null;
                    })
                  ))}
                </div>
              </div>
            </div>
          )}
      </div>
    </>
  );
};

export default ChatMessage;