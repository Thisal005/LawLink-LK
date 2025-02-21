import { useContext } from "react";
import axios from "axios";
import { AppContext } from "../Context/AppContext";

const useSendMessage = () => {
    const { backendUrl, userData } = useContext(AppContext);

    const sendMessage = async (receiverId, message) => {
        try {
            const response = await axios.post(
                `${backendUrl}/api/messages/send/${receiverId}`,
                { message },
                { withCredentials: true }
            );
            return response.data; // Return the sent message
        } catch (error) {
            console.error("Error sending message:", error);
            throw error; // Re-throw the error for handling in the component
        }
    };

    const uploadFile = async (receiverId, file) => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await axios.post(
                `${backendUrl}/api/messages/upload/${receiverId}`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true,
                }
            );
            return response.data; // Return the uploaded file message
        } catch (error) {
            console.error("Error uploading file:", error);
            throw error; // Re-throw the error for handling in the component
        }
    };

    return { sendMessage, uploadFile };
};

export default useSendMessage;