import { useState, useEffect, useRef, useContext } from 'react';
import { faqData } from './data/faqData.js'
import { LanguageContext } from '../../context/LanguageContext';

export const useChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);

    // Consume global language context
    const { language, toggleLanguage: setGlobalLanguage } = useContext(LanguageContext);

    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef(null);

    // Default to 'es' if language context is missing (safety check)
    const currentLang = language || 'es';
    const currentData = faqData[currentLang];

    // Initialize greeting only on first load
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([{ type: 'bot', text: currentData.greeting }]);
        }
    }, []); // Only on mount

    // Clear messages and re-greet when language changes
    useEffect(() => {
        setMessages([{ type: 'bot', text: currentData.greeting }]);
    }, [currentLang]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const toggleChat = () => setIsOpen(!isOpen);

    const toggleLanguage = () => {
        setGlobalLanguage(currentLang === 'es' ? 'en' : 'es');
    };

    const addMessage = (type, text, options = {}) => {
        setMessages(prev => [...prev, { type, text, ...options }]);
    };

    const handleQuickQuestion = (questionObj) => {
        addMessage('user', questionObj.question);
        setTimeout(() => {
            addMessage('bot', questionObj.answer, { showContact: questionObj.showContact });
        }, 500);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const query = inputText.toLowerCase();
        addMessage('user', inputText);
        setInputText('');

        // "Smart" search: find best match in ALL questions
        // Simple logic: check if question or answer contains the keyword
        // Priority: Question title match > Answer match
        const match = currentData.questions.find(q =>
            q.question.toLowerCase().includes(query)
        ) || currentData.questions.find(q =>
            q.answer.toLowerCase().includes(query)
        );

        setTimeout(() => {
            if (match) {
                addMessage('bot', match.answer, { showContact: match.showContact });
            } else {
                addMessage('bot', currentData.notFound);
            }
        }, 500);
    };
    const quickQuestions = currentData.questions.filter(q => q.isQuick);

    return {
        isOpen,
        toggleChat,
        language,
        toggleLanguage,
        messages,
        inputText,
        setInputText,
        handleSearch,
        handleQuickQuestion,
        quickQuestions,
        currentData,
        messagesEndRef
    };
};
