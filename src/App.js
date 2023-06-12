import { useEffect, useState } from "react";

const App = () => {
  const [value, setValue] = useState(null);
  const [message, setMessage] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);

  const getMessages = async () => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: value,
      }),
    };
    try {
      // makes request to backend server
      const response = await fetch(
        "http://localhost:8000/completions",
        options
      );
      const data = await response.json();
      // saves response object
      setMessage(data.choices[0].message);
    } catch (error) {
      console.error(error);
    }
  };

  // runs when a new message is received or current title changes
  useEffect(() => {
    if (!currentTitle && value && message) {
      // set title if current message and value have no value
      setCurrentTitle(value);
    }

    if (currentTitle && value && message) {
      setPreviousChats((previousChats) => [
        ...previousChats,
        // saving what is asked to ai in each conversation
        {
          title: currentTitle,
          role: "user",
          content: value,
        },
        // saving what is returned by the ai in each conversation
        {
          title: currentTitle,
          role: message.role,
          content: message.content,
        },
      ]);
    }
  }, [message, currentTitle]);

  // function to create new chat and reset all inputs
  const createNewChat = () => {
    setMessage(null);
    setValue(null);
    setCurrentTitle(null);
  };

  //  function to set current chat title
  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle);
    setMessage(null);
    setValue(null);
  };

  // fetches current chat based on active chat title
  const currentChat = previousChats.filter(
    (previousChat) => previousChat.title === currentTitle
  );

  // fetches all the unique chat titles
  const uniqueTitles = Array.from(
    new Set(previousChats.map((previousChat) => previousChat.title))
  );

  return (
    <div className="app">
      {/* sidebar */}
      <section className="side-bar">
        {/* button to create new chat */}
        <button onClick={createNewChat}>+ New chat</button>
        {/* list of previously saved chats */}
        <ul className="history">
          {/* dummy list element to preview styling */}
          {uniqueTitles.map((uniqueTitle, index) => (
            <li key={index} onClick={() => handleClick(uniqueTitle)}>
              {uniqueTitle}
            </li>
          ))}
        </ul>
        {/* name of creator */}
        <nav>
          <p>Made by Rohit</p>
        </nav>
      </section>
      {/* main chat section */}
      <section className="main">
        {/* title of app */}
        {!currentTitle && <h1>RoGPT</h1>}
        {currentTitle && <h1>{currentTitle}</h1>}
        <ul className="feed">
          {currentChat?.map((chatMessage, index) => (
            <li key={index}>
              <p className="role">{chatMessage.role}</p>
              <p>{chatMessage.content}</p>
            </li>
          ))}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input value={value} onChange={(e) => setValue(e.target.value)} />
            <div id="submit" onClick={getMessages}>
              Submit
            </div>
          </div>
          <p className="info">
            Free Research Preview. ChatGPT may produce inaccurate information
            about people, places, or facts. ChatGPT May 24 Version
          </p>
        </div>
      </section>
    </div>
  );
};

export default App;
