"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type CartContextType = {
    cartCount: number;
    setCartCount: (count: number) => void;
    incrementCart: () => void;
    fetchCartCount: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartCount, setCartCount] = useState<number>(0);

    const fetchCartCount = async () => {
        try {
            const response = await fetch("/api/cart", { cache: "no-store" });
            if (!response.ok) {
                setCartCount(0);
                return;
            }

            const data = await response.json();

            if (Array.isArray(data)) {
                setCartCount(data.length);
            } else if (Array.isArray(data.orderItems)) {
                setCartCount(data.orderItems.length);
            } else {
                setCartCount(0);
            }
        } catch (error) {
            console.error("Error fetching cart count:", error);
            setCartCount(0);
        }
    };

    const incrementCart = () => {
        setCartCount((prev) => prev + 1);
    };

    // fetch hanya sekali di awal
    useEffect(() => {
        fetchCartCount();
    }, []);

    return (
        <CartContext.Provider value={{ cartCount, setCartCount, incrementCart, fetchCartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
