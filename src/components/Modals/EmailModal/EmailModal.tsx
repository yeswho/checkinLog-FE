import React, { useState } from "react";
import PrintableBillComponent from "../../../components/Print/PrintableBill";
import { PrintableBill } from "../../../types/billing";
import { Tabs, Tab } from "@nextui-org/react";

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (emailData: { to: string; subject: string; text: string }) => Promise<void>;
  bill: PrintableBill;
  initialTo?: string;
  initialSubject?: string;
  initialText?: string;
}

const EmailModal: React.FC<EmailModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  bill,
  initialTo = "",
  initialSubject = "",
  initialText = "",
}) => {
  const [to, setTo] = useState(initialTo);
  const [subject, setSubject] = useState(initialSubject);
  const [text, setText] = useState(initialText);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("compose");

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onSubmit({ to, subject, text });
      onClose();
    } catch (error) {
      console.error("Error sending email:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-3xl overflow-hidden border border-gray-200 dark:border-gray-800">
        {/* Header */}
        <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Send Email</h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Tabs */}
        <Tabs 
          selectedKey={activeTab} 
          onSelectionChange={(key) => setActiveTab(key as string)}
          className="px-6 pt-4"
          variant="underlined"
          classNames={{
            tab: "data-[hover=true]:text-primary dark:data-[hover=true]:text-primary-400",
            tabContent: "group-data-[selected=true]:text-primary dark:group-data-[selected=true]:text-primary-400",
            cursor: "bg-primary",
            tabList: "border-b border-gray-200 dark:border-gray-800"
          }}
        >
          <Tab key="compose" title="Compose Email">
            <div className="p-4 pt-6">
              <div className="space-y-5">
                {/* To field */}
                <div className="flex items-center">
                  <label className="w-20 font-medium text-gray-700 dark:text-gray-300">To:</label>
                  <input
                    type="email"
                    className="flex-1 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="recipient@example.com"
                  />
                </div>
                
                {/* Subject field */}
                <div className="flex items-center">
                  <label className="w-20 font-medium text-gray-700 dark:text-gray-300">Subject:</label>
                  <input
                    type="text"
                    className="flex-1 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter subject"
                  />
                </div>
                
                {/* Message field */}
                <div>
                  <textarea
                    className="w-full h-64 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none resize-none px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Write your message here..."
                  />
                </div>
              </div>
            </div>
          </Tab>
          <Tab key="preview" title="Bill Preview">
            <div className="p-4 max-h-96 overflow-auto bg-gray-50 dark:bg-gray-800 rounded-lg mt-4 border border-gray-200 dark:border-gray-700">
              <PrintableBillComponent bill={bill} />
            </div>
          </Tab>
        </Tabs>
        
        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 flex justify-end space-x-3 border-t border-gray-200 dark:border-gray-800 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 font-medium transition-colors duration-200"
          >
            Discard
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-4 py-2 bg-primary hover:bg-primary-600 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-lg text-white font-medium transition-colors duration-200 flex items-center"
          >
            {isLoading ? (
              <>
                <span className="mr-2">Sending</span>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </>
            ) : (
              "Send"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailModal;