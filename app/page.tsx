
'use client';

import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { useThemeContext } from './theme-context';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Send as SendIcon } from '@mui/icons-material';
import  InputAdornment  from '@mui/material/InputAdornment';
import Avatar  from '@mui/material/Avatar';


type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function NutritionChat() {
  const { toggleTheme, themeMode } = useThemeContext();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `¡Hola!, seré tu consejera nutricional. Por favor, proporciona los siguientes detalles sobre ti: 
      nombre, género (hombre/mujer), edad (años), peso (kg/lb), altura (cm/ft-in), nivel de actividad física (sedentario/ligero/moderado/intenso/muy intenso) y objetivo a alcanzar (mantenimiento/perder peso).` }
  ]);
  const [input, setInput] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };


  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const sendMessage = async () => {
    if (!input.trim()) return;

    // Añadir el mensaje del usuario a la conversación
    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');// Limpiar el textarea

    // Realizar la petición a OpenAI
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [...messages, userMessage] }),
    });

    const data = await response.json();

    if (data.response) {
      // Añadir la respuesta de OpenAI a la conversación
      const assistantMessage: Message = { role: 'assistant', content: data.response.content };
      setMessages((prev) => [...prev, assistantMessage]);
    }

     
  };

  return (
    <Container maxWidth="md" sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }} >
      
      <Box sx={{
        padding: '16px',
        position: 'sticky',
        width: 1,
        top: 0,
        display: 'flex',
        justifyContent: { xs: 'space-between', md: 'center' },
        alignItems: 'center',
        backgroundColor: 'background.default',
        boxShadow: .5,
        height: '110px',
        zIndex: 1,
      }}>

<Avatar
        src="/nutri.jpeg"
        alt="Asistente"
        sx={{ width: 80, height: 80,  margin: { xs: 0, md: '0 auto' }, }}
      />
         <IconButton   color="inherit" onClick={toggleTheme}>
          {themeMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>

      </Box>
      
      

      <Box sx={{ 
          flex: 1, 
          /* Altura del header */
          
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'dark' ? '#333' : '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'dark' ? '#888' : '#888',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: 'dark' ? '#555' : '#555',
        },

          padding: '16px',
         
         
          minHeight: '0',
          wordWrap: 'break-word',
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap',
         
        }}>
        <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.role === 'user' ? 'Tú' : 'Asistente'}:</strong> 
            <ReactMarkdown>{msg.content}</ReactMarkdown>
            <br />
            
          </div>
        ))}
      </div>

        {/* Div invisible para scroll automático */}
        <div ref={messagesEndRef} />
      </Box>

      <Box 
        sx={{ 
          padding: 2, 
       
          
          position: 'relative'
        }}
      >
        <TextField
        value={input}
        onChange={(e) => setInput(e.target.value)}
          fullWidth
          placeholder="Escribe tu mensaje..."
          variant="outlined"
          multiline
          minRows={3}
          sx={{ marginBottom: 2 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton color="primary" onClick={sendMessage} >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        
      </Box>
      
      
     
    </Container>
  );
}
