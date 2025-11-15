import { useState, useCallback } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import RegistrationPage from './pages/RegistrationPage';
import GroupsPage from './pages/GroupsPage';

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  return (
    <HashRouter>
      <div className="min-h-screen font-sans flex flex-col">
        <Header onMenuClick={toggleSidebar} />
        <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
        <main className="flex-grow transition-all duration-300 ease-in-out md:pl-64 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<RegistrationPage />} />
                <Route path="/groups" element={<GroupsPage />} />
            </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
}

export default App;