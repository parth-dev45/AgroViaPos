
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Crate } from '@/types/pos';
import { mockCrates } from '@/data/mockData';

interface InventoryContextType {
    crates: Crate[];
    addCrate: (crate: Crate) => void;
    updateCrate: (crateId: string, updates: Partial<Crate>) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
    const [crates, setCrates] = useState<Crate[]>(() => {
        // Try to load from localStorage on initialization
        const saved = localStorage.getItem('inventory-crates');
        if (saved) {
            try {
                // We need to convert date strings back to Date objects
                const parsed = JSON.parse(saved);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return parsed.map((c: any) => ({
                    ...c,
                    expiryDate: new Date(c.expiryDate),
                    receivedDate: new Date(c.receivedDate),
                }));
            } catch (e) {
                console.error("Failed to parse inventory from local storage", e);
                return mockCrates;
            }
        }
        return mockCrates;
    });

    // Save to localStorage whenever crates change
    useEffect(() => {
        localStorage.setItem('inventory-crates', JSON.stringify(crates));
    }, [crates]);

    const addCrate = (crate: Crate) => {
        setCrates((prev) => [...prev, crate]);
    };

    const updateCrate = (crateId: string, updates: Partial<Crate>) => {
        setCrates((prev) =>
            prev.map((crate) => (crate.id === crateId ? { ...crate, ...updates } : crate))
        );
    };

    return (
        <InventoryContext.Provider value={{ crates, addCrate, updateCrate }}>
            {children}
        </InventoryContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useInventory = () => {
    const context = useContext(InventoryContext);
    if (context === undefined) {
        throw new Error('useInventory must be used within an InventoryProvider');
    }
    return context;
};
