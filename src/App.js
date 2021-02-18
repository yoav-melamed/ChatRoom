import React, { useState, useEffect, useRef } from 'react';
import CreateMessage from './components/CreateMessage';
import Messages from './components/Messages';

import socketIOClient from 'socket.io-client';

var socket = null;

const App = () => {
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');

  const myRef = useRef();

  useEffect(() => {
    if (socket === null) {
      socket = socketIOClient('http://localhost:4001');
    }

    socket.on('SET_USERNAME', username => {
      setUsername(username);
    });

    socket.on('CREATE_MESSAGE', messageObject => {
      setMessages([...messages, messageObject]);
      myRef.current.scrollTop = myRef.current.clientHeight;
    });
  }, [messages]);

  const handleCreateMessage = message => {
    message.user = username;
    socket.emit('SEND_MESSAGE', message);
  };

  const handleChangeMessageContent = e => {
    setMessageContent(e.target.value);
  };

  const handleFormSubmit = e => {
    e.preventDefault();

    const message = {
      content: messageContent,
    };

    setMessageContent('');
    handleCreateMessage(message);
  };

  return (
    <div className="chat">
      <Messages refProp={myRef} messages={messages} username={username} />
      <CreateMessage
        messageContent={messageContent}
        onChangeMessageContent={handleChangeMessageContent}
        onFormSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default App;
