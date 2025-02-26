import React from 'react';
import { Check, Clock } from 'lucide-react';

const Message = () => {
  return (
    <div >
      
        {/* Messages container with scrollbar */}
       
          <div className="space-y-2 p-2">
            {/* First message cluster */}
            <div className="space-y-1">
              <div className="flex items-start">
                <div className="flex items-center space-x-2 bg-gray-100 rounded-2xl rounded-tl-none px-4 py-3 text-gray-600">
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>

              <div className="flex items-start group">
                <div className="max-w-[80%]">
                  <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-2 text-gray-800">
                    <p>
                      It's over Anakin, I have the high ground.         
                      I have the high ground.
                    </p>
                    
                  </div>
                  
                  <div className="flex items-center mt-1 space-x-2">
                    <span className="text-xs text-gray-500">10:42 AM</span>
                    <span className="text-xs text-gray-500">Read</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Second message cluster */}
            <div className="space-y-1">
              <div className="flex items-start justify-end group">
                <div className="max-w-[100%]">
                  <div className="bg-blue-500 rounded-2xl rounded-tr-none px-4 py-2 text-white">
                    <p>You underestimate my power!</p>
                  </div>
                  <div className="flex items-center justify-end mt-1 space-x-2">
                    <span className="text-xs text-gray-500">10:43 AM</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-gray-500">Delivered</span>
                      <div className="flex">
                        <Check className="w-3 h-3 text-blue-500" />
                        <Check className="w-3 h-3 text-blue-500 -ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start justify-end group">
                <div className="max-w-[100%]">
                  <div className="bg-blue-500 rounded-2xl rounded-tr-none px-4 py-2 text-white opacity-70">
                    <p>Don't try it!</p>
                  </div>
                  <div className="flex items-center justify-end mt-1 space-x-2">
                    <span className="text-xs text-gray-500">10:43 AM</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-gray-500">Sending</span>
                      <Clock className="w-3 h-3 text-gray-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      
    
  );
};

export default Message;