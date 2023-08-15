import React, { useState, useEffect, useRef } from "react"
import Head from 'next/head';

const bot = "enablebot-React/public/bot.png"
const user = "enablebot-React/public/user.png"

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
      function LoadingComponent() {
        const loadingRef = useRef(null);
    
        useEffect(() => {
            const element = loadingRef.current;
            typeText(element, "Loading...");
    
            return () => clearInterval(loadInterval)
        }, []);
      return <div ref={loadingRef}>Loading</div>
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const uniqueId = generateUniqueId();
        const uniqueId2 = generateUniqueId();

        const newUserMessage = { id: uniqueId2, value: prompt, isAi: false};
        const botMessage = { id: uniqueId, value: '', isAi: true};

        setChatHistory([...chatHistory, newUserMessage, botMessage]);
        console.log(chatHistory)
        setPrompt('');
        

        let response
        try{
        response = await fetch('/api/server', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
            });
        console.log(response)
        
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
      <div className="container mx-auto p-4">
        <Head>
          <title>New Enablebot</title>
        </Head>
        <form className="form flex flex-col items-center" onSubmit={handleSubmit}>
          <textarea 
            className="prompt border p-2 resize-none"
            rows="1"
            cols="1"
            placeholder="Ask EnableBot..."
            value={prompt}
            onChange={handleChange}
          ></textarea>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-2" src="enablebot-React/public/send-message.png" >Submit</button>
        </form>
        {loading ? <LoadingComponent /> : null}
        <div className="mt-4">
          {chatHistory.map((message) => (
            <ChatStripe key={message.id} isAi={message.isAi} value={message.value} uniqueId={message.id} />
          ))}
        </div>
      </div>
    );
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