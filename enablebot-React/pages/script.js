import React, { useState, useEffect, useRef } from "react"
import Head from 'next/head';
import bot from '/Users/rebec/Git-Projects/Projects/Enable-React-Bot/enablebot-React/public/bot.png';
import user from '/Users/rebec/Git-Projects/Projects/Enable-React-Bot/enablebot-React/public/user.svg';

function Header() {
    return(
        <head>
            <title>New Enablebot</title>
        </head>
    );
}

function ChatStripe({ isAi, value, uniqueId }) {
    return (
      <div className={`wrapper ${isAi ? 'ai' : ''}`}>
        <div className="chat">
          <div className="profile">
            <img src={isAi ? bot : user} alt={isAi ? 'bot' : 'user'} />
          </div>
          <div className="message" id={uniqueId}>
            {value}
          </div>
        </div>
      </div>
    );
}


function HomePage() {
    const [prompt, setPrompt] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const handleChange = (e) => {
        setPrompt(e.target.value);
      };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const uniqueId = generateUniqueId();
        const uniqueId2 = generateUniqueId();

        const newUserMessage = { id: uniqueId2, value: prompt, isAi: false};
        const botMessage = { id: uniqueId, value: '', isAi: true};

        setChatHistory([...chatHistory, newUserMessage, botMessage]);
        
        setPrompt('');
        

        let response
        try{
        response = await fetch('Server', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
            });
        
        
        if (response.ok) {
            const data = await response.json();
            const parsedData = data.bot.trim(); 
    
            setChatHistory((prevHistory) => 
            prevHistory.map((message) => (message.id === uniqueId ? {...message, value: parsedData } : message))
         );
        } else { 
            alert('Something went wrong');
            }
        } catch (error) {
        console.error(error); 
        alert('An error occurred while fetching data.');
        }

        
    
        setLoading(false);
    };
return (
    <div>
      <Header />
      <form className="form" onSubmit={handleSubmit}>
      <textarea
          className="prompt"
          rows="1"
          cols="1" 
          placeholder="Ask EnableBot..."
          value={prompt}
          onChange={handleChange}
      ></textarea>
      <button type="submit">Submit</button>
    </form>
      {loading ? loadingComponent() : null} {/* Conditionally render loading component */}
      <div>
        {chatHistory.map((message) => (
          <ChatStripe key={message.id} isAi={message.isAi} value={message.value} uniqueId={message.id} />
        ))}
      </div>
    </div>
  );
}

function loadingComponent() {
    const loadingRef = useRef(null);

    useEffect(() => {
        const element = loadingRef.current;
        typeText(element, "Loading...");

        return () => clearInterval(loadInterval)
    }, []);
  return <div ref={loadingRef}>Loading</div>
}
function typeText(element, text){
    let index = 0; 
    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
        }else {
            clearInterval(interval);
        }
    }, 20);
}
let loadInterval;

function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}
export default HomePage;
export {Header};