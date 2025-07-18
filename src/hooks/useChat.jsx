import { createContext, useContext, useEffect, useState } from "react";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const chat = async (message) => {
    setLoading(true);
    
    // Agregar mensaje del usuario al historial inmediatamente
    const userMessage = { role: 'user', content: message };
    setMessageHistory(prev => [...prev, userMessage]);
    
    try {
      const data = await fetch(`${backendUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      const response = await data.json();
      
      console.log("Respuesta del servidor:", response); // Debug
      
      // La respuesta viene como { messages: [...] }
      const resp = response.messages || [];
      
      // Procesar cada mensaje del bot para el historial
      const botMessages = resp.map(msg => ({
        role: 'bot',
        content: msg.text || msg.content || msg.message || JSON.stringify(msg)
      }));
      
      if (botMessages.length > 0) {
        setMessageHistory(prev => [...prev, ...botMessages]);
      }
      
      // Mantener el sistema original para el avatar 3D
      setMessages((messages) => [...messages, ...resp]);
      
    } catch (error) {
      console.error("Error en chat:", error);
      setMessageHistory(prev => [...prev, { role: 'bot', content: 'Error al procesar la respuesta' }]);
    }
    
    setLoading(false);
  };

  const [messages, setMessages] = useState([]); // Para el sistema del avatar
  const [messageHistory, setMessageHistory] = useState([]); // Para el historial del chat
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);
  
  const onMessagePlayed = () => {
    setMessages((messages) => messages.slice(1));
  };

  useEffect(() => {
    if (messages.length > 0) {
      setMessage(messages[0]);
    } else {
      setMessage(null);
    }
  }, [messages]);

  return (
    <ChatContext.Provider
      value={{
        chat,
        message,
        messages,
        messageHistory, // Nuevo: historial separado
        onMessagePlayed,
        loading,
        cameraZoomed,
        setCameraZoomed,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};