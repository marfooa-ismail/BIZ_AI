


import React, { useState } from 'react';
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: "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",
    dangerouslyAllowBrowser: true,
});

const BusinessChat = () => {
    const [chat, setChat] = useState([
        { sender: 'model', text: "Welcome to Business Chatboard! 🚀 Ask me about finance, startups, or investments." },
        { sender: 'model', text: "I'm here to provide expert insights on business strategies. How can I help you today?" }
    ]);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendMessage = async () => {
        if (!userInput.trim()) return;

        const userMessage = { sender: 'user', text: userInput.trim() };
        setChat(prev => [...prev, userMessage]);
        setUserInput('');
        setLoading(true);

        try {
            const completion = await groq.chat.completions.create({
                messages: [
                    { role: "system", content: "You are a business consultant providing expert insights on finance, startups, and investments." },
                    { role: "user", content: userInput.trim() }
                ],
                model: "llama3-8b-8192",
                temperature: 0.7,
                max_tokens: 200,
                top_p: 1,
            });

            const modelResponse = completion.choices[0]?.message?.content || "I'm unable to process your request at the moment.";
            setChat(prev => [...prev, { sender: 'model', text: modelResponse }]);
        } catch (error) {
            console.error('Error in chat completion:', error);
            setChat(prev => [...prev, { sender: 'model', text: "I encountered an error. Please try again." }]);
        }

        setLoading(false);
    };

    return (
        <div className="chat-container flex flex-col h-screen bg-gray-900 text-black">

            {/* Chat Header */}
            <div className="chat-header bg-blue-600 text-black p-4 text-center shadow-lg">
                <h1 className="text-2xl font-bold">Business Chatboard</h1>
            </div>

            {/* Chat Messages */}
            <div className="chat-box flex-1 overflow-y-auto p-4">
                {chat.map((message, index) => (
                    <div key={index} className={`message-wrapper ${message.sender} my-2`}>
                        <div className={`message-content flex ${message.sender === 'model' ? 'justify-start' : 'justify-end'}`}>
                            {message.sender === 'model' && (
                                <div className="bot-avatar mr-2">📈</div>
                            )}
                            <div className={`message p-3 rounded-lg 
                                ${message.sender === 'user' ? 'bg-black text-black' : 'bg-blue-500 text-black'}`}>
                                {message.text}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ✅ Stylish Input & Button */}
            <div className="input-container bg-gray-800 p-4 flex items-center rounded-full mx-4 mb-4">
                <input
                    type="text"
                    className="flex-1 p-4 bg-gray-900 border border-gray-700 rounded-full text-black text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Ask about business, finance, or investments..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    style={{ height: "60px" }}  // **Increased Height**
                />
                <button
                    className="ml-3 bg-blue-600 text-black  px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
                    onClick={handleSendMessage}
                    disabled={loading}
                    style={{ height: "60px", minWidth: "110px" }} // **Increased Height & Rounded**
                >
                    {loading ? "Sending..." : "Send"}
                </button>
            </div>
        </div>
    );
};

export default BusinessChat;





