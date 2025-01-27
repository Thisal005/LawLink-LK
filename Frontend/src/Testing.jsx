import React from 'react';
import './Test.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo">LawLink <span className="lk">LK</span></div>
      <ul className="menu">
        <li>Dashboard</li>
        <li>Create post</li>
        <li>Ask lexbot</li>
        <li>Settings</li>
      </ul>
      <div className="cases">
        <h4>MY CASES</h4>
        <ul>
          <li className="active">CASE NAME</li>
          <li>CASE NAME</li>
          <li>CASE NAME</li>
        </ul>
      </div>
    </div>
  );
};

const ChatBox = () => {
  return (
    <div className="chatbox">
      <div className="chat-header">
        <div className="user">DESHAN FERNANDO</div>
      </div>
      <div className="chat-content">
        <div className="message assistant">I can assist you with this. Could you provide more details? Survey reports, or any prior correspondence with your neighbor?</div>
        <div className="message user">I have the original deed and a recent survey report that shows boundary. I've spoken to my neighbor informally.</div>
        <div className="message assistant">Sending a formal legal notice to your neighbor requesting the removal of the encroachment.</div>
        <div className="message user">Yes, please. What information do you need from me to prepare the notice?</div>
        <div className="message assistant">A copy of your property deed and survey report. Any written communication or informal agreements you've had with your neighbor.</div>
      </div>
      <div className="chat-footer">
        <input type="text" placeholder="Type your message" className="input" />
        <button className="upload-button">📄 Upload</button>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <div className="app">
      <Sidebar />
      <ChatBox />
    </div>
  );
};

export default App;