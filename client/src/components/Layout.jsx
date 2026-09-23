import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children, noSidebar = false }) => {
  const { currentUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const showSidebar = !noSidebar && !!currentUser;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        onMenuToggle={() => setSidebarOpen(o => !o)}
        menuOpen={sidebarOpen}
        hasSidebar={showSidebar}
      />
      <div className="flex flex-1">
        {showSidebar && <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />}
        <main className={`flex-1 ${showSidebar ? 'lg:ml-64' : ''} p-4 md:p-6 min-h-[calc(100vh-4rem)] animate-fade-in`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
