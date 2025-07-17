import { useRef } from "react";
import { useChat } from "../hooks/useChat";

export const UI = ({ hidden }) => {
  const input = useRef();
  const { chat, loading, cameraZoomed, setCameraZoomed, message, messages = [] } = useChat();

  const sendMessage = () => {
    const text = input.current.value;
    if (!loading && !message && text.trim()) {
      chat(text.trim());
      input.current.value = "";
    }
  };

  if (hidden) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-10 pointer-events-none">
      {/* Logo arriba izquierda */}
      <div className="absolute top-4 left-4 backdrop-blur-md bg-white bg-opacity-50 p-4 rounded-lg pointer-events-auto">
        <img src="https://www.usc.edu.co/wp-content/uploads/2023/05/logo-USC.png.webp" alt="USC Logo" className="h-20" />
        <h1 className="font-black text-xl">-</h1>
        <p>By JägerOwl</p>
      </div>

      {/* Caja scroll de mensajes a la izquierda */}
      <div className="absolute bottom-28 left-4 w-[400px] max-w-full h-[300px] overflow-y-auto p-4 rounded-md bg-white bg-opacity-40 backdrop-blur-md pointer-events-auto text-sm space-y-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={`p-2 rounded ${msg.role === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'}`}>
            <strong>{msg.role === 'user' ? 'Tú' : 'Bot'}:</strong> {msg.content}
          </div>
        ))}
      </div>

      {/* Input de texto debajo del historial */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 pointer-events-auto w-[400px] max-w-full">
        <input
          className="w-full placeholder:text-gray-800 placeholder:italic p-4 rounded-md bg-opacity-50 bg-white backdrop-blur-md"
          placeholder="Escribe un mensaje..."
          ref={input}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button
          disabled={loading || message}
          onClick={sendMessage}
          className={`bg-blue-900 hover:bg-blue-800 text-white p-4 px-6 font-semibold uppercase rounded-md ${
            loading || message ? "cursor-not-allowed opacity-30" : ""
          }`}
        >
          Enviar
        </button>
      </div>

      {/* Botones a la derecha, centrados verticalmente */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 pointer-events-auto">
        <button
          onClick={() => setCameraZoomed(!cameraZoomed)}
          className="bg-blue-900 hover:bg-blue-800 text-white p-4 rounded-md"
        >
          {/* ícono de zoom */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d={cameraZoomed
              ? "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6"
              : "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"}
            />
          </svg>
        </button>

        <button
          onClick={() => {
            const body = document.querySelector("body");
            body.classList.toggle("greenScreen");
          }}
          className="bg-blue-900 hover:bg-blue-800 text-white p-4 rounded-md"
        >
          {/* ícono pantalla verde */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </button>
      </div>
    </div>
  );
};