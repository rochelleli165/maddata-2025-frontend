// create chat modal comoponent that has input for answer and then calls an api to get the response and then displays it

import { useState } from "react";

import React from "react";

import { GoogleGenerativeAI } from "@google/generative-ai";
    
const genAI = new GoogleGenerativeAI("AIzaSyDPvEGpuaIgytJiK0cgAjUpuRTEOKvVPJg"); // Replace YOUR_API_KEY with your actual API key
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


const ChatModal = () => {
  const [inputText, setInputText] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [history, setHistory] = useState("");

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

async function generateText(prompt) {
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
}

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Add user message to chat history
    setChatHistory([...chatHistory, { sender: "user", message: inputText }]);
    setInputText("");

    // Make request to your API to get ChatGPT response
    try {

      const params = new URLSearchParams({ question: inputText });
      generateText(inputText + "Please surround the code with [[[ and ]]] tags and the explanation with <<< and >>> tags. Do not generate anything else.").then(story => {
        //console.log(story);

        // parse out code and explanation 
        const regex_code = /\[\[\[(.*?)\]\]\]/s;
        const regex_expl = /\<\<\<(.*?)\>\>\>/s;
        const code_match = story.match(regex_code);
        const expl_match = story.match(regex_expl);
        if (code_match && code_match[1]) {
          console.log("Code: ", code_match[1]);
        }
        if (expl_match && expl_match[1]) {
          console.log("Explanation: ", expl_match[1]);
        }

        // const code = story.match(/\[\[\[(.*?)\]\]\]/);
        // const explanation = story.match(/<<<(.*?)>>>/);
        // print out code to log 
        
        setHistory(
            `{'role': 'user', content: ${inputText} }, {'role': 'asisstant', content: ${story}}`
        );
        setChatHistory([
            ...chatHistory,
            { sender: "user", message: inputText },
            { sender: "chatbot", message: story },
          ]);
     });

    
     
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <main>
      <div className="chat-window">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
             <h1>{msg.message}</h1>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="form">
        <input
          placeholder="Type your message..."
          value={inputText}
          clearOnEscape
          onChange={handleInputChange}
        />
        <div style={{paddingBottom:'8px'}}></div>
        <button>Submit</button>
      </form>
    </main>
  );
};

export default ChatModal;