'use client';

import { useState, useEffect } from 'react';

export default function BudgetTracker() {
    const [isOpen, setIsOpen] = useState(false);
    const [budget, setBudget] = useState(10000);
    const [expenses, setExpenses] = useState([]);
    const [newExpense, setNewExpense] = useState({ category: 'food', amount: '', note: '' });

    useEffect(() => {
        const saved = localStorage.getItem('travel_budget');
        if (saved) {
            const data = JSON.parse(saved);
            setBudget(data.budget || 10000);
            setExpenses(data.expenses || []);
        }
    }, []);

    const saveData = (newBudget, newExpenses) => {
        localStorage.setItem('travel_budget', JSON.stringify({
            budget: newBudget,
            expenses: newExpenses
        }));
    };

    const addExpense = () => {
        if (!newExpense.amount) return;

        const expense = {
            id: Date.now(),
            ...newExpense,
            amount: parseFloat(newExpense.amount),
            date: new Date().toLocaleDateString()
        };

        const updated = [expense, ...expenses];
        setExpenses(updated);
        saveData(budget, updated);
        setNewExpense({ category: 'food', amount: '', note: '' });
    };

    const deleteExpense = (id) => {
        const updated = expenses.filter(e => e.id !== id);
        setExpenses(updated);
        saveData(budget, updated);
    };

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const remaining = budget - totalSpent;
    const percentUsed = (totalSpent / budget) * 100;

    const categories = {
        food: { icon: '🍽️', label: 'Food', color: 'bg-orange-500' },
        hotel: { icon: '🏨', label: 'Hotel', color: 'bg-blue-500' },
        transport: { icon: '🚗', label: 'Transport', color: 'bg-green-500' },
        activities: { icon: '🎯', label: 'Activities', color: 'bg-purple-500' },
        shopping: { icon: '🛍️', label: 'Shopping', color: 'bg-pink-500' },
        other: { icon: '💰', label: 'Other', color: 'bg-gray-500' },
    };

    return (
        <>
            {/* Budget Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-40 right-6 z-40 p-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </button>

            {/* Budget Panel */}
            {isOpen && (
                <div className="fixed bottom-56 right-6 z-40 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 animate-fadeIn max-h-[70vh] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">💰</span>
                                <h3 className="font-semibold">Budget Tracker</h3>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Budget Overview */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Budget:</span>
                                <span className="font-semibold">₹{budget.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Spent:</span>
                                <span className="font-semibold">₹{totalSpent.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Remaining:</span>
                                <span className={`font-semibold ${remaining < 0 ? 'text-red-200' : ''}`}>
                                    ₹{remaining.toLocaleString()}
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                                <div
                                    className={`h-2 rounded-full transition-all ${percentUsed > 100 ? 'bg-red-400' : percentUsed > 80 ? 'bg-yellow-400' : 'bg-white'
                                        }`}
                                    style={{ width: `${Math.min(percentUsed, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {/* Add Expense */}
                        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                            <h4 className="text-sm font-semibold text-gray-900">Add Expense</h4>
                            <select
                                value={newExpense.category}
                                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            >
                                {Object.entries(categories).map(([key, cat]) => (
                                    <option key={key} value={key}>
                                        {cat.icon} {cat.label}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                placeholder="Amount (₹)"
                                value={newExpense.amount}
                                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                            <input
                                type="text"
                                placeholder="Note (optional)"
                                value={newExpense.note}
                                onChange={(e) => setNewExpense({ ...newExpense, note: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                            <button
                                onClick={addExpense}
                                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                            >
                                Add Expense
                            </button>
                        </div>

                        {/* Expenses List */}
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">Recent Expenses</h4>
                            {expenses.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-4">No expenses yet</p>
                            ) : (
                                <div className="space-y-2">
                                    {expenses.map(expense => (
                                        <div key={expense.id} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between">
                                            <div className="flex items-center gap-3 flex-1">
                                                <span className={`w-8 h-8 ${categories[expense.category].color} rounded-full flex items-center justify-center text-white text-sm`}>
                                                    {categories[expense.category].icon}
                                                </span>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {categories[expense.category].label}
                                                    </p>
                                                    {expense.note && (
                                                        <p className="text-xs text-gray-500">{expense.note}</p>
                                                    )}
                                                    <p className="text-xs text-gray-400">{expense.date}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold text-gray-900">
                                                    ₹{expense.amount}
                                                </span>
                                                <button
                                                    onClick={() => deleteExpense(expense.id)}
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
