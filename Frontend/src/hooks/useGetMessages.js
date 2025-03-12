import { useState, useContext, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import useConversation from "../zustand/useConversation";
import { AppContext } from "../Context/AppContext";
import sodium from "libsodium-wrappers";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);
  const { messages, setMessages, selectedConversation } = useConversation();
  const { backendUrl, userData, lawyerData, privateKey, getPublicKey } = useContext(AppContext);

  // Keep a local cache of sent message plaintexts using messageId as key
  const [sentMessageCache] = useState(new Map());

  const decryptMessage = async (encryptedMessage, nonce, senderPublicKey, receiverPrivateKey) => {
    await sodium.ready;
    if (!senderPublicKey || !receiverPrivateKey || !encryptedMessage || !nonce) {
      throw new Error("Missing required parameters for decryption");
    }
    
    try {
      const decrypted = sodium.crypto_box_open_easy(
        sodium.from_hex(encryptedMessage),
        sodium.from_hex(nonce),
        sodium.from_hex(senderPublicKey),
        sodium.from_hex(receiverPrivateKey)
      );
      const decryptedText = sodium.to_string(decrypted);
      return decryptedText;
    } catch (err) {
      console.error("Decryption failed with error:", err);
      throw err;
    }
  };

  // Cache plaintext when sending a message
  const cachePlaintext = useCallback((messageId, plaintext) => {
    if (messageId && plaintext) {
      sentMessageCache.set(messageId, plaintext);
    }
  }, [sentMessageCache]);

  // Look for plaintext for a message
  const getPlaintext = useCallback((messageId) => {
    // First check in the local cache
    if (sentMessageCache.has(messageId)) {
      return sentMessageCache.get(messageId);
    }
    
    // Then check in the existing messages state
    const existingMsg = messages.find(m => m._id === messageId && m.messagePlaintext);
    return existingMsg?.messagePlaintext;
  }, [sentMessageCache, messages]);

  const getMessages = useCallback(
    async (forceRefresh = false) => {
      const currentUser = userData || lawyerData;
      if (!currentUser || !privateKey) {
        setError("You must be logged in to view messages");
        return [];
      }

      if (!selectedConversation) {
        setError("No conversation selected");
        return [];
      }

      const otherUserId = selectedConversation._id;
      const isOtherUserLawyer = selectedConversation.isLawyer;

      if (!otherUserId) {
        setError("Invalid conversation partner");
        return [];
      }

      if (!forceRefresh && lastFetch && Date.now() - lastFetch < 2000) {
        return Array.isArray(messages) ? messages : [];
      }

      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(`${backendUrl}/api/messages/${otherUserId}`, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });

        const data = res.data;
        setLastFetch(Date.now());

        if (data.success) {
          const messageArray = Array.isArray(data.data) ? data.data : [];
          const decryptedMessages = await Promise.all(
            messageArray.map(async (msg) => {
              const isOwnMessage = msg.senderId.toString() === currentUser._id.toString();

              // If it's our own message, first check if we have the plaintext stored
              if (isOwnMessage) {
                const plaintext = getPlaintext(msg._id);
                if (plaintext) {
                  return {
                    ...msg,
                    message: plaintext,
                    messagePlaintext: plaintext
                  };
                }
                
                // No plaintext found, try to decrypt
                if (msg.message && msg.nonce) {
                  try {
                    const senderPublicKey = await getPublicKey(
                      msg.senderId.toString(),
                      msg.senderId === lawyerData?._id
                    );
                    
                    if (senderPublicKey) {
                      const decryptedText = await decryptMessage(
                        msg.message,
                        msg.nonce,
                        senderPublicKey,
                        privateKey
                      );
                      
                      // Cache the decrypted text for future use
                      cachePlaintext(msg._id, decryptedText);
                      
                      return { 
                        ...msg, 
                        message: decryptedText,
                        messagePlaintext: decryptedText 
                      };
                    }
                  } catch (err) {
                    console.error("Self-message decryption error:", err);
                  }
                }
                
                // Fallback if all else fails
                return { ...msg, message: "[Message sent]" };
              }

              // For messages from others, decrypt as before
              if (msg.message && msg.nonce) {
                const senderPublicKey = await getPublicKey(
                  msg.senderId.toString(),
                  isOtherUserLawyer
                );
                if (!senderPublicKey) {
                  return { ...msg, message: "[Failed to decrypt: Missing sender key]" };
                }
                try {
                  const decryptedText = await decryptMessage(
                    msg.message,
                    msg.nonce,
                    senderPublicKey,
                    privateKey
                  );
                  return { ...msg, message: decryptedText };
                } catch (err) {
                  console.error("Decryption error for message", msg._id, err);
                  return { ...msg, message: "[Decryption failed]" };
                }
              }
              
              return msg;
            })
          );

          const pendingMessages = Array.isArray(messages)
            ? messages.filter((msg) => msg.isPending)
            : [];
          const serverMessageIds = new Set(decryptedMessages.map((msg) => msg._id));
          const filteredPendingMessages = pendingMessages.filter(
            (msg) => !serverMessageIds.has(msg._id)
          );

          const combinedMessages = [...decryptedMessages, ...filteredPendingMessages];
          combinedMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

          // Update the messages state with our combined decrypted messages
          setMessages(combinedMessages);
          return combinedMessages;
        } else {
          throw new Error("No messages found");
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        setError(error.response?.data?.error || "Failed to fetch messages");
        return Array.isArray(messages) ? messages : [];
      } finally {
        setLoading(false);
      }
    },
    [backendUrl, userData, lawyerData, privateKey, messages, setMessages, lastFetch, getPublicKey, selectedConversation, getPlaintext, cachePlaintext]
  );

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000");

    ws.onopen = () => {
      const userId = userData?._id || lawyerData?._id;
      if (userId) {
        ws.send(JSON.stringify({ type: "register", userId }));
      }
    };

    ws.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "message") {
        const { message: newMsg } = data;
        const currentUser = userData || lawyerData;
        const isOwnMessage = newMsg.senderId.toString() === currentUser._id.toString();

        let decryptedText;
        let messagePlaintext;

        if (isOwnMessage) {
          // For own messages, first check cached plaintext
          const plaintext = getPlaintext(newMsg._id);
          if (plaintext) {
            decryptedText = plaintext;
            messagePlaintext = plaintext;
          } else if (newMsg.nonce) {
            // Try to decrypt
            try {
              const senderPublicKey = await getPublicKey(
                newMsg.senderId.toString(), 
                newMsg.senderId === lawyerData?._id
              );
              
              if (senderPublicKey) {
                decryptedText = await decryptMessage(
                  newMsg.message,
                  newMsg.nonce,
                  senderPublicKey,
                  privateKey
                );
                messagePlaintext = decryptedText;
                
                // Cache the result
                cachePlaintext(newMsg._id, decryptedText);
              } else {
                decryptedText = "[Message sent]";
              }
            } catch (err) {
              console.error("WebSocket self-message decryption error:", err);
              decryptedText = "[Message sent]";
            }
          } else {
            decryptedText = "[Message sent]";
          }
        } else {
          // For messages from others
          decryptedText = "[Decrypting...]";
          if (newMsg.nonce) {
            const isSenderLawyer = newMsg.senderId === selectedConversation?._id && selectedConversation?.isLawyer;
            const senderPublicKey = await getPublicKey(
              newMsg.senderId.toString(),
              isSenderLawyer
            );
            if (senderPublicKey) {
              try {
                decryptedText = await decryptMessage(
                  newMsg.message,
                  newMsg.nonce,
                  senderPublicKey,
                  privateKey
                );
              } catch (err) {
                console.error("WebSocket decryption error:", err);
                decryptedText = "[Decryption failed]";
              }
            } else {
              decryptedText = "[Failed to decrypt: Missing sender key]";
            }
          }
        }
        
        const processedMessage = { 
          ...newMsg, 
          message: decryptedText,
          ...(messagePlaintext && { messagePlaintext })
        };
        
        setMessages((prev) => {
          // Check if this message already exists
          const existing = prev.find(m => m._id === newMsg._id);
          if (existing) {
            // Update existing message
            return prev.map(m => m._id === newMsg._id ? processedMessage : m)
              .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          }
          
          // Add new message
          return [...prev, processedMessage]
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        });
      }
    };

    ws.onerror = (error) => console.error("WebSocket error:", error);
    return () => ws.close();
  }, [userData, lawyerData, privateKey, setMessages, getPublicKey, selectedConversation, getPlaintext, cachePlaintext]);

  // When useSendMessage creates a new message, we need to handle the plaintext
  useEffect(() => {
    // Look for any new messages with plaintext
    messages.forEach(msg => {
      if (msg.messagePlaintext && msg._id) {
        cachePlaintext(msg._id, msg.messagePlaintext);
      }
    });
  }, [messages, cachePlaintext]);

  const safeMessages = Array.isArray(messages) ? messages : [];

  return { loading, error, messages: safeMessages, getMessages };
};

export default useGetMessages;