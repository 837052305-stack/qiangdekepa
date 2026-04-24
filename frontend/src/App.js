import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ToolDetail from './pages/ToolDetail';
import ShareTool from './pages/ShareTool';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import ChatRooms from './pages/ChatRooms';
import CreateChatRoom from './pages/CreateChatRoom';
import ChatRoom from './pages/ChatRoom';
import Favorites from './pages/Favorites';
import './styles.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/tool/:id" element={<ToolDetail />} />
              <Route path="/share" element={<ShareTool />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/chat-rooms" element={<ChatRooms />} />
              <Route path="/chat-rooms/create" element={<CreateChatRoom />} />
              <Route path="/chat-room/:id" element={<ChatRoom />} />
              <Route path="/favorites" element={<Favorites />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
