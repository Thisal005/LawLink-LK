import React, { useState } from 'react';
import { Paperclip, Send } from 'lucide-react';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle message submission here
    console.log('Message:', message);
    console.log('Files:', files);
    setMessage('');
    setFiles([]);
  };

  const removeFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };
  return (
    <div className="max-w-3xl  mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        {/* File Preview Area */}
      

        {files.length > 0 && (
          <div className="mb-0.5 p-2 bg-gray-50/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-gray-600 mb-1 bg-white px-10 py-1 rounded-lg shadow-xs"
              >
                <Paperclip className="w-4 h-4 text-gray-400" />
                <span className="truncate flex-1">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-all"
                >
                  <svg
                    className="w-10 h-4 text-gray-500 hover:text-gray-700"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
  
        {/* Input Area */}
        <div className="flex items-center gap-3 w-full border border-gray-200 rounded-3xl bg-white p-2 shadow-sm hover:shadow-md hover:border-gray-300 transition-all">
          {/* File Upload Button */}
          <label className="cursor-pointer p-3 hover:bg-gray-50 rounded-xl transition-all group">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx"
            />
            <Paperclip className="w-5 h-7 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </label>
  
          {/* Message Input */}
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            style={{height: '30px'}}
            className="flex-1 outline-none text-gray-800 placeholder-gray-400 text-sm py-3 bg-transparent"
          />
  
          {/* Send Button */}
          <button
            type="submit"
            disabled={!message && files.length === 0}
            className="p-3 rounded-xl  hover:bg-blue-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <Send className="w-5 h-5 text-blue-500 group-hover:text-blue-600 transition-colors" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;