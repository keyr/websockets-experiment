import React, {useEffect, useState} from 'react';
import './App.css';
import {w3cwebsocket as W3CWebSocket} from 'websocket';

const client = new W3CWebSocket('ws://7b1d-2607-f470-6-1001-a81a-1b5d-16e0-6a16.ngrok.io');

const onMessageSend = (user, message) => {
  client.send(JSON.stringify({
    type: 'change',
    user: user,
    content: message
  }));
}

function App() {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    client.onopen = () => {
      console.log("WebSocket client has connected!");
    }
    client.onmessage = (message) => {
      console.log(message)
      const data = JSON.parse(message.data);
      setMessages(currentMessages => [...currentMessages, {user: data.data.user, content: data.data.content}]);
    }
  }, []);

  useEffect(() => {
    console.log(messages)
  }, [messages]);
  return (
    <div className="is-flex is-flex-direction-column">
      {messages.map(message => <div className="is-flex" key={message.content}><div className="has-text-weight-semibold">{`${message.user}: `}</div><div>{message.content}</div></div>)}
      <form className="mt-3" onSubmit={(event) => {
        event.preventDefault();
        const user = event.target.user.value;
        const message = event.target.message.value;
        onMessageSend(user, message);
      }}>
        <label className="label" htmlFor="user">Username: </label>
        <input className="input" type="text" id="user"/>
        <label className="label" htmlFor="message">Message: </label>
        <input className="input" type="text" id="message"/>
        <input className="button" type="submit" value="Submit"></input>
      </form>
    </div>
  );
}

export default App;
