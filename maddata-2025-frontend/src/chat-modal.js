// create chat modal comoponent that has input for answer and then calls an api to get the response and then displays it

import { useState } from "react";

import React from "react";

import { GoogleGenerativeAI } from "@google/generative-ai";
import P5Wrapper from "./p5-sketch";
    
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
      generateText(inputText + 
        "Please surround the code with [[[ and ]]] tags and the explanation with <<< and >>> tags." + 
        "it should return in the format similar to  (p) => { " +
        `
            let x = 50;
            let y = 50;

            p.setup = function() {
              let canvas = p.createCanvas(400, 400);
              canvas.parent(containerRef.current); // Attach to div with id="p5-container"
            }

            p.draw = function() {
              p.background(220);
              p.ellipse(x, y, 50, 50);
              x += 1; // Move the circle
            }
      }`
        ).then(story => {
       

        // parse out code and explanation 
        const regex_code = /\[\[\[(.*?)\]\]\]/s;
        const regex_expl = /\<\<\<(.*?)\>\>\>/s;
        const code_match = story.match(regex_code);
        const expl_match = story.match(regex_expl);


      
        
        setHistory(
            `{'role': 'user', content: ${inputText} }, {'role': 'asisstant', content: ${story}}`
        );
        setChatHistory([
            ...chatHistory,
            { sender: "user", message: inputText },
            { sender: "chatbot-code", message: code_match[1] },
            { sender: "chatbot-explanation", message: expl_match[1] }
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
          <div key={index}>
            <CodeOrExplanationComponent sender={msg.sender} message={msg.message} ></CodeOrExplanationComponent>;
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

function CodeOrExplanationComponent({sender, message}) {
    if (sender === "chatbot-code") {
        let container_id = "p5container" + Math.random().toString(36).substring(7);
        let test_code = `
            let x = 50;
            let y = 50;

            function setup() {
              let canvas = createCanvas(400, 400);
              canvas.parent("p5-container"); // Attach to div with id="p5-container"
            }

            function draw() {
              background(220);
              ellipse(x, y, 50, 50);
              x += 1; // Move the circle
            }`;
        return <div>
            <p>Code:</p>
            <P5Wrapper scriptContent={message} container_id={container_id}></P5Wrapper>
            </div>;
    }
    else {
        return <p>{message}</p>
    }
}

export default ChatModal;