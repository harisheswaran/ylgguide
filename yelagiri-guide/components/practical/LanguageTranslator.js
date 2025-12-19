'use client';

import { useState } from 'react';

export default function LanguageTranslator() {
    const [isOpen, setIsOpen] = useState(false);
    const [inputText, setInputText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [sourceLang, setSourceLang] = useState('en');
    const [targetLang, setTargetLang] = useState('ta');

    const languages = [
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
        { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
        { code: 'te', name: 'Telugu', flag: '🇮🇳' },
        { code: 'kn', name: 'Kannada', flag: '🇮🇳' },
    ];

    const commonPhrases = [
        { en: 'Hello', ta: 'வணக்கம்', hi: 'नमस्ते' },
        { en: 'Thank you', ta: 'நன்றி', hi: 'धन्यवाद' },
        { en: 'How much?', ta: 'எவ்வளவு?', hi: 'कितना?' },
        { en: 'Where is...?', ta: 'எங்கே...?', hi: 'कहाँ है...?' },
        { en: 'Help!', ta: 'உதவி!', hi: 'मदद!' },
        { en: 'Water', ta: 'தண்ணீர்', hi: 'पानी' },
        { en: 'Food', ta: 'உணவு', hi: 'खाना' },
        { en: 'Hotel', ta: 'ஹோட்டல்', hi: 'होटल' },
    ];

    const handleTranslate = () => {
        // Mock translation (in production, use Google Translate API)
        const phrase = commonPhrases.find(p => p.en.toLowerCase() === inputText.toLowerCase());
        if (phrase) {
            setTranslatedText(phrase[targetLang] || phrase.ta);
        } else {
            setTranslatedText('Translation not available. Try common phrases.');
        }
    };

    const handlePhraseClick = (phrase) => {
        setInputText(phrase.en);
        setTranslatedText(phrase[targetLang] || phrase.ta);
    };

    return (
        <>
            {/* Translator Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-20 right-6 z-40 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
                <span className="text-xl">🌐</span>
                <span className="text-sm font-medium hidden md:inline">Translate</span>
            </button>

            {/* Translator Panel */}
            {isOpen && (
                <div className="fixed top-32 right-6 z-40 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 animate-fadeIn">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🌐</span>
                            <h3 className="font-semibold">Language Translator</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="p-4 space-y-4">
                        {/* Language Selection */}
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-xs text-gray-600 mb-1 block">From</label>
                                <select
                                    value={sourceLang}
                                    onChange={(e) => setSourceLang(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                                >
                                    {languages.map(lang => (
                                        <option key={lang.code} value={lang.code}>
                                            {lang.flag} {lang.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-gray-600 mb-1 block">To</label>
                                <select
                                    value={targetLang}
                                    onChange={(e) => setTargetLang(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                                >
                                    {languages.map(lang => (
                                        <option key={lang.code} value={lang.code}>
                                            {lang.flag} {lang.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Input */}
                        <div>
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Type or select a phrase..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                                rows={3}
                            />
                            <button
                                onClick={handleTranslate}
                                className="mt-2 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                                Translate
                            </button>
                        </div>

                        {/* Output */}
                        {translatedText && (
                            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                                <p className="text-sm text-gray-600 mb-1">Translation:</p>
                                <p className="text-lg font-semibold text-gray-900">{translatedText}</p>
                            </div>
                        )}

                        {/* Common Phrases */}
                        <div>
                            <p className="text-xs text-gray-600 mb-2">Common Phrases:</p>
                            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                                {commonPhrases.map((phrase, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handlePhraseClick(phrase)}
                                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-left text-xs transition-colors"
                                    >
                                        <p className="font-medium text-gray-900">{phrase.en}</p>
                                        <p className="text-gray-600">{phrase[targetLang] || phrase.ta}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
