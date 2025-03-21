import { IconButton, MenuIcon, LogoutIcon } from '@/components/ui';

type HeaderProps = {
  toggleDrawer: (open: boolean) => void;
};

// Header component
export default function Header({ toggleDrawer }: HeaderProps) {
  return (
    <header className="bg-adminDashboardNavBar z-10 h-16 shadow-md shadow-gray-500 flex items-center justify-between sm:justify-end w-full p-2">
      <div className="block sm:hidden ">
        <IconButton
          className="shadow-adminNavBarButton "
          aria-label="Ouvrir le menu"
          onClick={() => toggleDrawer(true)}
          style={{
            backgroundImage: 'var(--color-adminButton)',
            color: 'var(--color-textPrimary)',
          }}
        >
          <MenuIcon />
        </IconButton>
      </div>
      <IconButton
        className="shadow-adminNavBarButton"
        aria-label="Déconnexion"
        style={{
          backgroundImage: 'var(--color-adminButton)',
          color: 'var(--color-textPrimary)',
        }}
      >
        <LogoutIcon />
      </IconButton>
    </header>
  );
}
