import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import useConversation from "../zustand/useConversation";
import { AppContext } from "../Context/AppContext";
import sodium from "libsodium-wrappers";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();
  const { backendUrl, userData, lawyerData, privateKey, getPublicKey } = useContext(AppContext);

  const encryptMessage = async (message, senderPrivateKey, receiverPublicKey) => {
    await sodium.ready;
    const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);
    const encrypted = sodium.crypto_box_easy(
      message,
      nonce,
      sodium.from_hex(receiverPublicKey),
      sodium.from_hex(senderPrivateKey)
    );
    return {
      encrypted: sodium.to_hex(encrypted),
      nonce: sodium.to_hex(nonce),
    };
  };

  const sendMessage = async (messageText, files = []) => {
    if ((!messageText.trim() && files.length === 0) || loading) return;

    const currentUser = userData || lawyerData;
    if (!currentUser || !privateKey) {
      toast.error("You must be logged in to send messages");
      return;
    }

    const receiverId = userData ? "67c894b63412856749f2e91f" : "67c893b3db23727fa64b7550"; // Lawyer or Client ID
    const isReceiverLawyer = userData ? true : false;
    const receiverPublicKey = await getPublicKey(receiverId, isReceiverLawyer);

    if (!receiverPublicKey) {
      toast.error("Failed to fetch receiver's public key");
      return;
    }

    setLoading(true);

    try {
      let encryptedMessage = "";
      let nonce = "";
      if (messageText.trim()) {
        const { encrypted, nonce: messageNonce } = await encryptMessage(
          messageText,
          privateKey,
          receiverPublicKey
        );
        encryptedMessage = encrypted;
        nonce = messageNonce;
      }

      const formData = new FormData();
      formData.append("message", encryptedMessage);
      if (nonce) formData.append("nonce", nonce); // Optional: Send nonce if needed
      files.forEach((file) => {
        formData.append("documents", file);
      });

      const res = await axios.post(`${backendUrl}/api/messages/send/${receiverId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data.success) {
        // Add the plaintext message to the local state for the sender
        const newMessage = {
          ...res.data.data,
          message: messageText, // Display plaintext for sender
          isPending: false,
        };
        setMessages([...messages, newMessage]);
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return { loading, sendMessage };
};

export default useSendMessage;