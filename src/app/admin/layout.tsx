


import { ReactNode } from 'react';

// Lyout to return the children
export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <main className="h-full font-roboto " >
            {children}
        </main>
    )
}