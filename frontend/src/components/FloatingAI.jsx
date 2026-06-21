import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";

function FloatingAI() {
  const [open, setOpen] = useState(false);

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "👋 Hello! I'm ArogyaAI.\n\nHow can I help you today?",
    },
  ]);

  const chatEndRef = useRef(null);

  // Auto Scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // -----------------------------------
  // Send Message
  // -----------------------------------

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      sender: "user",

      text: message,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentMessage = message;

    setMessage("");

    setLoading(true);

    try {
      const response = await fetch(
        "https://arogyaai-backend-dic1.onrender.com/ai-chat",

        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            message: currentMessage,
          }),
        },
      );

      const data = await response.json();

      setMessages((prev) => [
        ...prev,

        {
          sender: "ai",

          text: data.reply,
        },
      ]);
    } catch (error) {
      console.log(error);

      toast.error("AI Assistant Offline");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {/* Floating AI Button */}

      <button
        onClick={() => setOpen(!open)}
        className="
      fixed
      bottom-6
      right-6
      w-16
      h-16
      rounded-full
      bg-gradient-to-r
      from-blue-600
      to-cyan-500
      text-white
      text-3xl
      shadow-2xl
      hover:scale-110
      hover:rotate-12
      transition-all
      duration-300
      z-50
      "
      >
        🤖
      </button>

      {/* Chat Window */}

      {open && (
        <div
          className="
        fixed
        bottom-24
        right-6
        w-[400px]
        h-[620px]
        bg-white
        rounded-3xl
        shadow-2xl
        overflow-hidden
        border
        flex
        flex-col
        z-50
        "
        >
          {/* Header */}

          <div
            className="
          bg-gradient-to-r
          from-blue-600
          to-cyan-500
          text-white
          p-5
          flex
          justify-between
          items-center
          "
          >
            <div>
              <h2 className="font-bold text-lg">🤖 ArogyaAI Assistant</h2>

              <p className="text-sm opacity-90">Your AI Healthcare Companion</p>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="
            text-2xl
            hover:text-red-200
            "
            >
              ✕
            </button>
          </div>

          {/* Messages */}

          <div
            className="
          flex-1
          overflow-y-auto
          bg-gray-100
          p-4
          space-y-4
          "
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`

                max-w-[80%]

                px-4

                py-3

                rounded-2xl

                whitespace-pre-wrap

                shadow

                ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-white text-gray-700 rounded-bl-sm"
                }

                `}
                >
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            ))}

            {/* Loading */}

            {loading && (
              <div className="flex justify-start">
                <div
                  className="
                bg-white
                px-4
                py-3
                rounded-2xl
                shadow
                "
                >
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"></div>

                    <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce delay-150"></div>

                    <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce delay-300"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef}></div>
          </div>

          {/* Input */}

          <div
            className="
          border-t
          p-4
          flex
          gap-2
          bg-white
          "
          >
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              placeholder="Ask anything about your health..."
              className="
            flex-1
            border
            rounded-xl
            px-4
            py-3
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
            "
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              className="
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-6
            rounded-xl
            transition
            "
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
export default FloatingAI;
