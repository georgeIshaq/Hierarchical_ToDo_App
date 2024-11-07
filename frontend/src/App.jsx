// frontend/src/App.jsx

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/common/ProtectedRoute';
import TodoListsPage from './components/todos/TodoListsPage';
import TodoListPage from './components/todos/TodoListPage';
import Navbar from './components/common/Navbar';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Redirect /home to /lists */}
          <Route path="/home" element={<Navigate to="/lists" replace />} />

          {/* Protected Routes */}
          <Route
            path="/lists"
            element={
              <ProtectedRoute>
                <TodoListsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lists/:listId"
            element={
              <ProtectedRoute>
                <TodoListPage />
              </ProtectedRoute>
            }
          />

          {/* Redirect root and unknown routes to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
      </Router>
  );
}

export default App;