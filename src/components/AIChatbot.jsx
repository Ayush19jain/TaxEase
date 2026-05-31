import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: 'Hello! I\'m your AI financial assistant. How can I help you with your taxes and investments today?',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const quickQuestions = [
    'How can I save tax?',
    'Best investment options?',
    'What is Section 80C?',
    'Calculate my tax',
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = { type: 'user', text: inputMessage };
    setMessages([...messages, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = {
        type: 'bot',
        text: getBotResponse(inputMessage),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);

    setInputMessage('');
  };

  const getBotResponse = (question) => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('save tax') || lowerQuestion.includes('tax saving')) {
      return 'You can save tax through various instruments:\n\n• Section 80C: Invest up to ₹1.5L in ELSS, PPF, EPF\n• Section 80D: Health insurance premiums\n• Section 80CCD(1B): Additional ₹50K through NPS\n• HRA: If you\'re paying rent\n\nWould you like to know more about any specific option?';
    }
    
    if (lowerQuestion.includes('investment') || lowerQuestion.includes('invest')) {
      return 'Here are some tax-saving investment options:\n\n1. ELSS Funds (12-15% returns)\n2. PPF (7.1% safe returns)\n3. NPS (9-12% returns)\n4. Tax-saving FDs\n\nEach has different lock-in periods and risk profiles. Which one interests you?';
    }
    
    if (lowerQuestion.includes('80c')) {
      return 'Section 80C allows deductions up to ₹1.5 lakh per year. You can invest in:\n\n• ELSS Mutual Funds (3-year lock-in)\n• PPF (15-year lock-in)\n• EPF contributions\n• Life Insurance premiums\n• NSC, Tax-saving FDs\n• Home loan principal\n\nThese investments reduce your taxable income!';
    }
    
    if (lowerQuestion.includes('calculate') || lowerQuestion.includes('tax')) {
      return 'I can help you calculate your tax! Please use the Tax Calculator on the dashboard. Just enter your annual income and select your preferred tax regime (New or Old). The calculator will show you the exact tax amount you need to pay.';
    }
    
    return 'That\'s a great question! For detailed information about ' + question + ', I recommend:\n\n1. Check our Dashboard for calculators\n2. Visit the Investments section for options\n3. Review Reports for your financial summary\n\nIs there something specific I can help clarify?';
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-blue-500/50 transition-shadow"
          >
            <MessageCircle className="w-8 h-8" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">AI Financial Assistant</h3>
                  <p className="text-blue-100 text-xs">Online • Ready to help</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-slate-800 shadow-sm'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className="px-4 py-2 bg-white border-t border-slate-200">
                <p className="text-xs text-slate-500 mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      className="text-xs px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me anything about taxes..."
                  className="flex-1 px-4 py-2 bg-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;
