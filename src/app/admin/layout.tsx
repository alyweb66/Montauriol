import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


import { ReactNode } from 'react';

// Lyout to return the children
export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <main className="h-full font-roboto " >
            {children}
        </main>
    )
}