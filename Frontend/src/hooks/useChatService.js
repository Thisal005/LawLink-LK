import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import useSocket from './useSocket';
import { getMessages, sendMessage, uploadFile } from '../utills/api';

export const useChatService = (receiverId, caseId) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  const { socket, newMessage } = useSocket(user?._id);

  // Fetch messages function
  const fetchMessages = useCallback(async () => {
    if (!receiverId || !user) return;
    
    try {
      setIsLoading(true);
      const response = await getMessages(receiverId);
      setMessages(response);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setIsLoading(false);
    }
  }, [receiverId, user]);

  // Listen for new messages from socket
  useEffect(() => {
    if (newMessage) {
      // Check if message belongs to current conversation
      if (
        (newMessage.senderId === receiverId && newMessage.receiverId === user?._id) ||
        (newMessage.senderId === user?._id && newMessage.receiverId === receiverId)
      ) {
        setMessages(prev => [...prev, newMessage]);
      }
    }
  }, [newMessage, receiverId, user]);
  
  // Send text message
  const sendTextMessage = async (message) => {
    if (!receiverId || !user || !message.trim()) return;
    
    // Generate a temporary ID for optimistic UI update
    const tempId = Date.now().toString();
    const tempMessage = {
      _id: tempId,
      senderId: user._id,
      receiverId,
      caseId: caseId || null,
      message,
      createdAt: new Date().toISOString(),
      status: 'sent',
      isTemp: true
    };
    
    // Add to messages for immediate UI feedback
    setMessages(prev => [...prev, tempMessage]);
    
    try {
      setIsSending(true);
      const sentMessage = await sendMessage(receiverId, { message, caseId });
      
      // Replace temp message with actual message from server
      setMessages(prev => 
        prev.map(msg => (msg._id === tempId ? sentMessage : msg))
      );
      
      setIsSending(false);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Mark message as failed
      setMessages(prev => 
        prev.map(msg => 
          msg._id === tempId 
            ? { ...msg, status: 'failed' } 
            : msg
        )
      );
      
      setIsSending(false);
    }
  };

  // Upload file
  const uploadFileMessage = async (file) => {
    if (!receiverId || !user || !file) return;
    
    try {
      setIsUploading(true);
      
      const formData = new FormData();
      formData.append('file', file);
      if (caseId) {
        formData.append('caseId', caseId);
      }
      
      const uploadedMessage = await uploadFile(receiverId, formData);
      setMessages(prev => [...prev, uploadedMessage]);
      
      setIsUploading(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      setIsUploading(false);
    }
  };

  return {
    messages,
    isLoading,
    isSending,
    isUploading,
    sendTextMessage,
    uploadFileMessage,
    fetchMessages
  };
};