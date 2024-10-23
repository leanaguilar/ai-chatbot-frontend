import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Box, Typography, TextField, IconButton, Chip, Container, Paper, Grid } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';

// Chatbot component
const Chatbot = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const chatBoxRef = useRef(null);

  // Handle sending message
  const handleSendMessage = () => {
    if (message.trim()) {
      const newMsg = { role: 'user', content: message };
      setChatHistory([...chatHistory, newMsg]);
      setMessage('');
      // Simulate bot response (in actual implementation, call an API)
      setLoading(true);
      setTimeout(() => {
        setChatHistory(prev => [...prev, { role: 'bot', content: 'Bot response...' }]);
        setLoading(false);
      }, 1000);
    }
  };

  // Predefined question click handler
  const handlePredefinedQuestionClick = (suggestion) => {
    setMessage(suggestion);
    handleSendMessage();
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
        onScroll={() => {}}
        sx={{
          width: '100%',
          flexGrow: 1,
          overflowY: 'auto',
          backgroundColor: '#fff',
          p: 2,
          borderRadius: 2,
          boxShadow: 1,
          maxHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          '&::-webkit-scrollbar': { width: '8px' },
          '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1', borderRadius: '10px' },
          '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '10px' },
        }}
      >
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

        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ my: 2 }}>
            <SmartToyIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">Bot is thinking</Typography>
          </Box>
        )}

        <Grid container spacing={1} sx={{ mb: 2 }}>
          {['Who is Savina Atai?', 'What is face yoga?', 'Where does face yoga come from?'].map((suggestion, index) => (
            <Grid item key={index}>
              <Chip
                label={suggestion}
                variant="outlined"
                sx={{ borderRadius: 5 }}
                onClick={() => handlePredefinedQuestionClick(suggestion)}
                disabled={loading}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Message Input */}
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mt: 2, p: 1, borderRadius: 2, boxShadow: 1 }}>
        <TextField
          variant="standard"
          placeholder="Write your message"
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          InputProps={{ disableUnderline: true, sx: { ml: 1 } }}
        />
        <IconButton color="primary" onClick={handleSendMessage} disabled={loading}>
          <SendIcon />
        </IconButton>
      </Box>
    </Container>
  );
};

// Mount React app to DOM
ReactDOM.render(<Chatbot />, document.getElementById('root'));
