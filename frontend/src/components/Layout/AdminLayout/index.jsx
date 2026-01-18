import Sidebar from '../components/Sidebar';
import { useState } from 'react';
import { DoubleRightOutlined } from '@ant-design/icons';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  return (
    <div>
      <button
        onClick={openSidebar}
        className={`${
          isSidebarOpen ? '-translate-x-8' : 'translate-x-0'
        } fixed top-1/2 transition transform ease-linear duration-500 bg-gray-200 text-blue-800 w-8 h-12 flex rounded-r-xl items-center justify-center active:bg-gray-300 focus:outline-none hover:bg-gray-200 hover:text-gray-800 z-10`}
      >
        <DoubleRightOutlined className="text-2xl" />
      </button>
      <Sidebar isSidebarOpen={isSidebarOpen} closeSidebar={closeSidebar} />
      <div
        className={`transition-all duration-500 h-screen ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}
      >
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
