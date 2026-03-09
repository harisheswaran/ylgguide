'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ShopContext = createContext();

export function ShopProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [orderHistory, setOrderHistory] = useState([]);

    useEffect(() => {
        const savedCart = localStorage.getItem('ylg_shop_cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
        const savedOrders = localStorage.getItem('ylg_shop_orders');
        if (savedOrders) {
            setOrderHistory(JSON.parse(savedOrders));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('ylg_shop_cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        if (orderHistory.length > 0) {
            localStorage.setItem('ylg_shop_orders', JSON.stringify(orderHistory));
        }
    }, [orderHistory]);

    const addToCart = (product, quantity = 1) => {
        setCart(prev => {
            const existing = prev.find(item => item.product._id === product._id);
            if (existing) {
                return prev.map(item =>
                    item.product._id === product._id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { product, quantity }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.product._id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) {
            removeFromCart(productId);
            return;
        }
        setCart(prev => prev.map(item =>
            item.product._id === productId ? { ...item, quantity } : item
        ));
    };

    const clearCart = () => setCart([]);

    const addOrderToHistory = (orderId) => {
        setOrderHistory(prev => {
            if (prev.includes(orderId)) return prev;
            const updated = [orderId, ...prev];
            localStorage.setItem('ylg_shop_orders', JSON.stringify(updated));
            return updated;
        });
    };

    const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <ShopContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartTotal,
            cartCount,
            isCartOpen,
            setIsCartOpen,
            orderHistory,
            addOrderToHistory
        }}>
            {children}
        </ShopContext.Provider>
    );
}

export const useShop = () => useContext(ShopContext);
