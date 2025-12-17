import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AIChatbot from './components/AIChatbot';
import Dashboard from './pages/Dashboard';
import Investments from './pages/Investments';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import History from './pages/History';
import Wallet from './pages/Wallet';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/*" element={
          <ProtectedRoute>
              <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex-1 ml-72">
                  <Header />
                  <main className="p-10 pt-8">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/investments" element={<Investments />} />
                      <Route path="/wallet" element={<Wallet />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/history" element={<History />} />
                      <Route path="/profile" element={<Profile />} />
                    </Routes>
                  </main>
                </div>
                <AIChatbot />
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
  );
}

export default App;
