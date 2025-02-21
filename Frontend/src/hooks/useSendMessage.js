import axios from 'axios';
import { useContext } from 'react';
import { AppContext } from '../Context/AppContext';

const useSendMessage = () => {
  const { backendUrl } = useContext(AppContext);

  const sendMessage = async (receiverId, message) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/messages/send/${receiverId}`,
        { message },
        { withCredentials: true } // Include credentials
      );
      return response.data; // Return the sent message
    } catch (error) {
      console.error('Error sending message:', error);
      throw error; // Re-throw the error for handling in the component
    }
  };

  return { sendMessage };
};

export default useSendMessage;