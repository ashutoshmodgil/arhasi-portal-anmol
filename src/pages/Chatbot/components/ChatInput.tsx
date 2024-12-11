import { Button } from "@/components/ui/button";
import SingleTableSelector from "@/pages/Dashboard/components/SingleTableSelector";
import useDataSetColumnsStore, { SchemaData } from "@/store/useDataSetColumns";
import { Loader2, Mic, Send } from "lucide-react";
import React, { useRef, useState } from "react";
import ExpandedInputComponent from "./Extendedinput";

interface ChatBotRequest {
  user_query: string;
}

const ChatInput: React.FC<{
  handleUserPayload: (query: string) => void;
  isPending: boolean;
}> = ({ handleUserPayload, isPending }) => {
  const [input, setInput] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const sendMessage = (input: string) => {
    handleUserPayload(input); // Pass the string directly
  };

  const handleSendMessage = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput("");
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-4  bg-transparent w-full overflow-hidden mt-4 transition-all duration-200 ease-in-out"
    >
      <SingleTableSelector />

      <div className="flex items-center gap-4 w-full">
        {/* Input Component */}
        <ExpandedInputComponent
          value={input}
          setInput={setInput}
          handleSendMessage={handleSendMessage}
        />

        {/* Send Button */}
        <Button
          variant="secondary"
          className="w-14 h-12 p-1 bg-[#C10104] hover:bg-[#a30103] rounded-xl flex items-center justify-center shadow-sm"
          disabled={isPending}
          onClick={handleSendMessage}
        >
          {isPending ? (
            <Loader2 className="w-6 h-6 animate-spin text-white" />
          ) : (
            <Send className="w-6 h-6 text-white" />
          )}
        </Button>

        {/* Mic Button */}
        <Button
          variant="default"
          className="w-14 h-12 p-0 bg-white hover:bg-[#B4C0C2]/80 rounded-xl border border-[#7F8A8C]/20 flex items-center justify-center"
          onClick={() => console.log("Additional options")}
        >
          <Mic className="w-6 h-6 text-[#1E1E1E]" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;