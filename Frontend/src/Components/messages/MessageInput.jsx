import { useState, useContext, useRef } from 'react';
import { Paperclip, Send, X, Image } from 'lucide-react';
import useSendMessage from '../../hooks/useSendMessage';
import useSendFiles from '../../hooks/useSendFiles';
import { AppContext } from '../../Context/AppContext';

const MessageInput = () => {
    const [message, setMessage] = useState('');
    const [files, setFiles] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const { loading: messageLoading, sendMessage } = useSendMessage();
    const { loading: fileLoading, sendFiles } = useSendFiles();
    const { backendUrl } = useContext(AppContext);
    const inputRef = useRef(null);
    const fileInputRef = useRef(null);
    
    const loading = messageLoading || fileLoading;

    const handleFileChange = async (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length === 0) return;
        
        // Limit to 5 files
        const newFiles = [...files, ...selectedFiles].slice(0, 5);
        setFiles(newFiles);

        try {
            // Send files immediately on selection
            await sendFiles(selectedFiles);
            setFiles([]); // Clear files after sending
            inputRef.current?.focus();
        } catch (err) {
            console.error("Error sending files:", err);
            // Toast notification is handled in the hook
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if ((!message.trim() && files.length === 0) || loading) return;

        try {
            // If there are files that weren't sent on selection, send them now
            if (files.length > 0) {
                await sendFiles(files);
                setFiles([]);
            }
            
            // Only send text message if there's actual text
            if (message.trim()) {
                await sendMessage(message);
                setMessage('');
            }
            
            inputRef.current?.focus();
        } catch (err) {
            console.error("Error sending message:", err);
            // Toast notification is handled in the hooks
        }
    };

    const removeFile = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        if (droppedFiles.length > 0) {
            const newFiles = [...files, ...droppedFiles].slice(0, 5);
            setFiles(newFiles);
        }
    };

    const handleTyping = (e) => {
        setMessage(e.target.value);
        
        // Handle enter key press to send message
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handlePaste = (e) => {
        const clipboardItems = e.clipboardData.items;
        const images = Array.from(clipboardItems)
            .filter(item => item.type.indexOf('image') !== -1)
            .map(item => item.getAsFile());
            
        if (images.length > 0) {
            const newFiles = [...files, ...images].slice(0, 5);
            setFiles(newFiles);
        }
    };

    return (
        <div className="max-w-3xl mx-auto w-full">
            <form 
                onSubmit={handleSubmit} 
                className="relative" 
                onDrop={handleDrop} 
                onDragOver={(e) => e.preventDefault()}
            >
                {/* File Preview Area */}
                {files.length > 0 && (
                    <div className="mb-2 p-2 bg-gray-50 rounded-lg border border-gray-100 overflow-x-auto">
                        <div className="flex gap-2">
                            {files.map((file, index) => (
                                <div key={index} className="relative group min-w-[80px]">
                                    {file.type.startsWith('image/') ? (
                                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 relative">
                                            <img 
                                                src={URL.createObjectURL(file)} 
                                                alt={file.name}
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeFile(index)}
                                                className="absolute top-1 right-1 p-1 bg-white/80 rounded-full hover:bg-white"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="w-20 h-20 rounded-lg border border-gray-200 flex flex-col items-center justify-center bg-white p-1 text-center relative">
                                            <Paperclip className="w-4 h-4 text-gray-400 mb-1" />
                                            <span className="text-xs truncate w-full">{file.name.split('.').pop()}</span>
                                            <span className="text-[10px] text-gray-500 truncate w-full">
                                                {(file.size / 1024 < 1024) 
                                                    ? `${Math.round(file.size / 1024)}KB` 
                                                    : `${Math.round(file.size / 1024 / 1024 * 10) / 10}MB`}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => removeFile(index)}
                                                className="absolute top-1 right-1 p-1 bg-white/80 rounded-full hover:bg-white"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input Area */}
                <div className="flex items-center gap-2 w-full border border-gray-200 rounded-full bg-white px-3 py-1 shadow-sm hover:shadow transition-all">
                    {/* File Upload Button */}
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={`p-2 rounded-full transition-all ${
                            loading || files.length >= 5
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-gray-50'
                        }`}
                        disabled={loading || files.length >= 5}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*,.pdf,.doc,.docx"
                            disabled={loading || files.length >= 5}
                        />
                        <Image className="w-5 h-5 text-gray-400" />
                    </button>

                    {/* Message Input */}
                    <input
                        ref={inputRef}
                        type="text"
                        value={message}
                        onChange={handleTyping}
                        onKeyDown={handleTyping}
                        onPaste={handlePaste}
                        placeholder="Type a message..."
                        className={`flex-1 outline-none text-gray-800 placeholder-gray-400 py-2 bg-transparent ${
                            loading ? 'opacity-50' : ''
                        }`}
                        maxLength={500}
                        disabled={loading}
                    />

                    {/* Character Counter when typing */}
                    {message.length > 0 && (
                        <span className="text-xs text-gray-400 mr-1">
                            {message.length}/1000
                        </span>
                    )}

                    {/* Send Button */}
                    <button
                        type="submit"
                        disabled={loading || (!message.trim() && files.length === 0)}
                        className={`p-2 rounded-full ${
                            loading || (!message.trim() && files.length === 0)
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-blue-500 hover:bg-blue-50'
                        } transition-all`}
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MessageInput;