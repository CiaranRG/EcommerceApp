import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the type for a product
interface Product {
    id: number;
    name: string;
    quantity: number;
}

// Define the type for the context value
interface CartContextType {
    cart: Product[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
}

// Create the context with a default value
const CartContext = createContext<CartContextType | undefined>(undefined);

// Custom hook to use the cart context
export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

// Provider component props
interface CartProviderProps {
    children: ReactNode;
}

// Provider component
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cart, setCart] = useState<Product[]>([]);

    // Functions to manipulate the cart
    const addToCart = (product: Product) => {
        setCart([...cart, product]);
    };

    const removeFromCart = (productId: number) => {
        setCart(cart.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId: number, quantity: number) => {
        setCart(cart.map(item => item.id === productId ? { ...item, quantity } : item));
    };

    // Provide the cart data and functions to the rest of the app
    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity }}>
            {children}
        </CartContext.Provider>
    );
};
