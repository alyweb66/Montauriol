'use client';

import { Button, Drawer, useState } from '@/components/ui';

type LeftNavBarProps = {
  isDrawerOpen: boolean;
  toggleDrawer: (open: boolean) => void;
};

export default function LeftNavBar({
  isDrawerOpen,
  toggleDrawer,
}: LeftNavBarProps) {
  // State
  const [selectedLabel, setSelectedLabel] = useState('Actualité');
  
  // Nav items
  const navItems = [
    { label: 'Actualité' },
    { label: 'Email' },
    { label: 'PLU' },
  
  ];

  // Nav content
  const NavContent = () => (
    <nav 
    className="flex flex-col  p-2 bg-adminDashboardNavBar   text-textPrimary w-full"
    aria-label='Navigation principale'
    >
      {navItems.map((item) => (
        <button
          key={item.label}
          type='button'
          onClick={() => setSelectedLabel(item.label)}
          className={`py-2 px-4 rounded-lg mt-1 transition-all duration-400 ease-in-out  ${item.label === selectedLabel ? 'shadow-adminNavBarButton bg-[image:var(--color-adminButton)] ' : 'hover:bg-[image:var(--color-hoverAdminButton)] hover:shadow-adminNavBarButton'} transition-colors`}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );

  return (
    <div className="h-full z-10 sm:shadow-lg sm:shadow-gray-500 ">
      <div className="hidden z-10 sm:flex w-50 h-full ">
        <NavContent />
      </div>

      {/* Drawer MUI for mobile */}
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={() => toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            top: '3.8rem', // Start at the bottom of the header
            height: 'calc(100% - 3.8rem)', // Height reduced by the height of the header
          },
        }}
      >
        <div className="w-64 h-full bg-adminDashboardNavBar ">
          <NavContent />
        </div>
      </Drawer>
    </div>
  );
}
