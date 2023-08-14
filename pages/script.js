import { useState } from "react"
import Head from "next/head";


function Header() {
    return(
        <div>
            <head>
                <title>New Enablebot</title>
            </head>
        </div>

    );
}

function HomePage() {
    const [prompt, setPrompt] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("prompt Submitted: ", prompt);
        
        //Can do API things here

        setPrompt('');
    };
    const handleChange = (e) => {
        setPrompt(e.target.value);
    };
    return( 
        <div>
            <form className="form" onSubmit={handleSubmit}>
                <textarea
                    className="prompt"
                    rows="1"
                    cols="1" 
                    placeholder="Ask EnableBot..."
                    value = {prompt}
                    onChange = {handleChange}
                ></textarea>
                <button type="submit"></button>
            </form>
        </div>
    );
}
export default HomePage;
export {Header};