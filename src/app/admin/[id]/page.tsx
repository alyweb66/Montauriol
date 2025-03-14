'use client';
import Header from '@/components/admin/header/header';
import LeftNavBar from '@/components/admin/leftNavBar/lefNavBar';
import { useState } from '@/components/ui';

// Admin Dashboard component
export default function AdminDashboard() {
  // State for Drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Function to toggle the Drawer
  const toggleDrawer = (open: boolean) => {
    setIsDrawerOpen(open);
  };

  return (
    <div className="min-h-screen bg-[image:var(--color-adminDashboardBg)] flex flex-col  h-full">
      <Header toggleDrawer={toggleDrawer} />
      <div className="flex-grow ">
        <LeftNavBar isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
      </div>
    </div>
  );
}
