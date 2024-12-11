import React, { useEffect, useRef } from 'react';

export default function ExpandedInputComponent({
  value,
  setInput,
  handleSendMessage,
}: {
  value: string;
  setInput: (value: string) => void;
  handleSendMessage: () => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = 'auto';

      // Calculate new height
      const newHeight = Math.min(textareaRef.current.scrollHeight, 160); // Max height of 10rem (160px)

      // Set the new height to the textarea
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  return (
    <div className='relative w-full  border bg-white rounded-lg overflow-hidden'>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        rows={1}
        className='w-full bg-transparent border-0 text-black placeholder-zinc-400 focus:outline-none focus:ring-0 resize-none pt-2 px-4'
        style={{
          minHeight: '4.5rem',
          maxHeight: '10rem',
        }}
        placeholder='Message to chat Assistant'
      />
    </div>
  );
}
