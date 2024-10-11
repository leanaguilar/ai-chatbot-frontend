import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, TextField, IconButton, Paper, Chip, Container, Grid } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy'; // Robot icon
import axios from 'axios';

const Chatbot = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);  // Track loading state
  const chatBoxRef = useRef(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false); // Track if the user is manually scrolling

  // Function to handle sending a message
  const handleSendMessage = async (msg) => {
    const textToSend = msg || message;
    setMessage('');

    if (textToSend.trim() !== '') {
      const updatedHistory = [...chatHistory, { role: 'user', content: textToSend }];
      setChatHistory(updatedHistory);

      setLoading(true);  // Set loading state to true

      try {
        const response = await axios.post('http://localhost:5000/getResponse', {
          message: textToSend,
        });

        // Update the chat history with the bot's response
        setChatHistory((prevHistory) => [
          ...prevHistory,
          { role: 'bot', content: response.data.response },
        ]);

        setIsUserScrolling(false); // Reset scrolling flag
      } catch (error) {
        console.error('Error fetching response:', error);
      } finally {
        setLoading(false);  // Reset loading state
      }
    }
  };

  // Auto-scroll functionality (only when the user is not manually scrolling)
  useEffect(() => {
    if (chatBoxRef.current && !isUserScrolling) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight; // Scroll to the bottom
    }
  }, [chatHistory, isUserScrolling]);

  // Function to handle "Enter" key press
  const handleKeyPress = async (event) => {
    if (event.key === 'Enter' && !loading) {
      event.preventDefault(); // Prevent form submission
      handleSendMessage();
    }
  };

  // Function to handle clicking a predefined question
  const handlePredefinedQuestionClick = (question) => {
    if (!loading) { // Disable clicks when loading
      handleSendMessage(question);
    }
  };

  // Detect if the user is manually scrolling
  const handleUserScroll = () => {
    if (chatBoxRef.current) {
      const isScrolledToBottom = chatBoxRef.current.scrollTop + chatBoxRef.current.clientHeight >= chatBoxRef.current.scrollHeight - 10;
      setIsUserScrolling(!isScrolledToBottom); // Set the flag if the user is not scrolled to the bottom
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        padding: 2,
        backgroundColor: '#f4f4f9',
      }}
    >
      {/* Chat Area */}
      <Box
        ref={chatBoxRef}
        onScroll={handleUserScroll} // Track user scrolling
        sx={{
          width: '100%',
          flexGrow: 1,
          overflowY: 'auto', // Enable scroll bar when content exceeds height
          backgroundColor: '#fff',
          p: 2,
          borderRadius: 2,
          boxShadow: 1,
          maxHeight: '70vh', // Limit the height to allow for scrolling
          display: 'flex',
          flexDirection: 'column',
          /* Custom scroll bar styling */
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f1f1f1',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#888',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#555',
          },
        }}
      >
        <Paper
          elevation={1}
          sx={{
            p: 2,
            mb: 2,
            borderRadius: '15px',
            backgroundColor: '#f0f0f0',
            textAlign: 'left',
          }}
        >
          <Typography variant="body1">
            👋 Hi! I'm SavinaAtaiBot, an AI chatbot trained on face yoga. Ask me everything you want!
          </Typography>
        </Paper>

        {/* Chat History Display */}
        {chatHistory.map((msg, index) => (
          <Paper
            key={index}
            elevation={1}
            sx={{
              p: 1,
              mb: 1,
              borderRadius: '15px',
              backgroundColor: msg.role === 'user' ? '#d1e7dd' : '#f8d7da',
              textAlign: msg.role === 'user' ? 'right' : 'left',
            }}
          >
            <Typography variant="body2">{msg.content}</Typography>
          </Paper>
        ))}

        {/* Waiting for response message with animation */}
        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ my: 2 }}>
            <SmartToyIcon fontSize="small" sx={{ mr: 1 }} /> {/* Robot icon */}
            <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>Bot is thinking</Typography>
            <Box sx={{ ml: 1, display: 'flex', alignItems: 'center' }}>
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </Box>
          </Box>
        )}

        {/* Suggested Questions */}
        <Grid container spacing={1} sx={{ mb: 2 }}>
          {['Who is Savina Atai?', 'What is face yoga?', 'Where does face yoga come from?'].map((suggestion, index) => (
            <Grid item key={index}>
              <Chip
                label={suggestion}
                variant="outlined"
                sx={{ borderRadius: 5, cursor: 'pointer' }}
                onClick={() => handlePredefinedQuestionClick(suggestion)}
                disabled={loading} // Disable predefined questions when loading
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Message Input Area */}
      <Box
        component="form"
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          mt: 2,
          p: 1,
          borderRadius: 2,
          boxShadow: 1,
          backgroundColor: '#fff',
        }}
      >
        <TextField
          variant="standard"
          placeholder="Write your message"
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          InputProps={{
            disableUnderline: true,
            sx: { ml: 1 },
          }}
          disabled={loading} // Disable input while waiting for a response
        />
        <IconButton color="primary" onClick={() => handleSendMessage()} disabled={loading}>
          <SendIcon />
        </IconButton>
      </Box>

      {/* Adding CSS for the wave dots animation */}
      <style>{`
        .dot {
          width: 6px;
          height: 6px;
          background-color: #666;
          border-radius: 50%;
          margin: 0 2px;
          display: inline-block;
          animation: wave 1.2s infinite ease-in-out both;
        }

        .dot:nth-child(1) {
          animation-delay: -0.32s;
        }

        .dot:nth-child(2) {
          animation-delay: -0.16s;
        }

        @keyframes wave {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
      `}</style>
    </Container>
  );
};

export default Chatbot;
