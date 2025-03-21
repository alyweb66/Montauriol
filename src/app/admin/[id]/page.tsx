'use client';
import Header from '@/components/admin/header/header';
import LeftNavBar from '@/components/admin/leftNavBar/lefNavBar';
import { useState } from '@/components/ui';
import Tiptap from '@/components/tiptap/tiptap';

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
      <div className="flex h-full ">
        <LeftNavBar isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
        <section className="w-full h-full flex justify-center items-center bg-[image:var(--color-adminDashboardBg)] ">
          <div className='bg-white p-4 rounded-lg shadow-xl w-3xl max-h-80'>
            <Tiptap />
          </div>
     
        </section>
      </div>
    </div>
  );
}
