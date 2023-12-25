import React, {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import "./chatbot.css";

const Chatbot: React.FC = () => {
  const [showChatbot, setShowChatbot] = useState<boolean>(false);
  const [userMessage, setUserMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<
    { sender: string; message: string }[]
  >([]);
  const chatboxRef = useRef<HTMLUListElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (showChatbot && chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [chatHistory, showChatbot]);

  const toggleChatbot = () => {
    setShowChatbot((prevShowChatbot) => !prevShowChatbot);
  };
  const generateResponse = async (): Promise<{ message: string }> => {
    const response = await new Promise<{ message: string }>((resolve) => {
      setTimeout(() => {
        resolve({ message: "Response from the chatbot!" });
        //show ai msg here
      }, 1000);
    });

    return response;
  };

  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleChat = async () => {
    if (!userMessage.trim()) return;
    setChatHistory((prevChatHistory) => [
      ...prevChatHistory,
      { sender: "user", message: userMessage },
    ]);

    setUserMessage("");

    //loadingg......
    setChatHistory((prevChatHistory) => [
      ...prevChatHistory,
      { sender: "bot", message: "Loading..." },
    ]);

    const { message } = await generateResponse();

    //removes loading.. and shows latest ai msg
    setChatHistory((prevChatHistory) => [
      ...prevChatHistory.slice(0, -1), 
      { sender: "bot", message },
    ]);


    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setUserMessage(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleChat();
    }
  };

  return (
    <section className="show-chatbot">
      <button className="chatbot_toggler" onClick={toggleChatbot}>
        {showChatbot ? (
          <span className="material-symbols-outlined">close</span>
        ) : (
          <span className="material-symbols-outlined">mode_comment</span>
        )}
      </button>
      {showChatbot && (
        <div className="chatbot">
          <header>
            <h2>ChatBot</h2>
            <span className="material-symbols-outlined">close</span>
          </header>
          <ul className="chatbox" ref={chatboxRef}>
            <li className="chat incoming">
              <span className="material-symbols-outlined">smart_toy</span>
              <p>uWu</p>
            </li>
            {chatHistory.map((chat, index) => (
              <li
                key={index}
                className={`chat ${
                  chat.sender === "bot" ? "incoming" : "outgoing"
                }`}
              >
                {chat.sender === "bot" && (
                  <span className="material-symbols-outlined">smart_toy</span>
                )}
                <p>{chat.message}</p>
              </li>
            ))}
          </ul>
          <div className="chat_input">
            <textarea
              placeholder="Enter a message..."
              spellCheck="false"
              required
              value={userMessage}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              ref={chatInputRef}
            />
            <span
              id="send-btn"
              className="material-symbols-rounded"
              onClick={handleChat}
            >
              send
            </span>
          </div>
        </div>
      )}
    </section>
  );
};

export default Chatbot;
