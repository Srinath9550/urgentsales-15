// import { useState, useRef, useEffect } from "react";
// import { 
//   MessageSquare, 
//   Send, 
//   X, 
//   Maximize2, 
//   Minimize2, 
//   Bot, 
//   Home, 
//   Search, 
//   Building, 
//   User,
//   MapPin,
//   PenSquare,
//   ThumbsUp,
//   ThumbsDown
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useQuery } from "@tanstack/react-query";
// import { useAuth } from "@/hooks/use-auth";
// import { useToast } from "@/hooks/use-toast";
// import { Property } from "@shared/schema";
// import { Link } from "wouter";

// interface Message {
//   id: string;
//   content: string;
//   sender: 'user' | 'bot' | 'system';
//   timestamp: Date;
//   suggestions?: string[];
//   properties?: Property[];
// }

// export default function Chatbot() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isMaximized, setIsMaximized] = useState(false);
//   const [inputMessage, setInputMessage] = useState('');
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: '1',
//       content: 'Hello! I am HomeDirectly Assistant. How can I help you today?',
//       sender: 'bot',
//       timestamp: new Date(),
//       suggestions: [
//         'I want to buy a property',
//         'Help me find an agent',
//         'How do I list my property?',
//         'What are the current market trends?'
//       ]
//     }
//   ]);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);
//   const { user } = useAuth();
//   const { toast } = useToast();

//   // Get recommended properties
//   const { data: recommendedProperties = [] } = useQuery<Property[]>({
//     queryKey: ['/api/recommendations'],
//     enabled: !!user,
//   });

//   // Get featured properties for non-logged in users
//   const { data: featuredProperties = [] } = useQuery<Property[]>({
//     queryKey: ['/api/properties/featured'],
//   });

//   // Auto-scroll to bottom of messages
//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [messages]);

//   // Focus on input when chat opens
//   useEffect(() => {
//     if (isOpen && inputRef.current) {
//       inputRef.current.focus();
//     }
//   }, [isOpen]);

//   const generateBotResponse = (userMessage: string): Message => {
//     const normalizedMessage = userMessage.toLowerCase();
    
//     // Basic intent detection
//     if (normalizedMessage.includes('buy') || normalizedMessage.includes('looking for') || normalizedMessage.includes('search')) {
//       return {
//         id: Date.now().toString(),
//         content: 'I can help you find properties. What type of property are you looking for? You can also specify location, budget, or other preferences.',
//         sender: 'bot',
//         timestamp: new Date(),
//         suggestions: [
//           'Apartments in Mumbai',
//           'Villas under 1 crore',
//           '3 BHK in Bangalore',
//           'Commercial space in Delhi NCR'
//         ],
//         properties: (user ? recommendedProperties : featuredProperties).slice(0, 2)
//       };
//     } else if (normalizedMessage.includes('agent') || normalizedMessage.includes('help me')) {
//       return {
//         id: Date.now().toString(),
//         content: 'Our verified agents can help you find the perfect property. I can connect you with top agents in your area.',
//         sender: 'bot',
//         timestamp: new Date(),
//         suggestions: [
//           'Find agents in Mumbai',
//           'Show top-rated agents',
//           'Agent specializing in villas',
//           'Connect me with an agent'
//         ]
//       };
//     } else if (normalizedMessage.includes('sell') || normalizedMessage.includes('list') || normalizedMessage.includes('my property')) {
//       return {
//         id: Date.now().toString(),
//         content: 'You can list your property on HomeDirectly in three simple steps. Would you like to know about our subscription plans?',
//         sender: 'bot',
//         timestamp: new Date(),
//         suggestions: [
//           'Tell me about subscription plans',
//           'How to create a listing',
//           'What documents do I need?',
//           'How much can I sell my property for?'
//         ]
//       };
//     } else if (normalizedMessage.includes('price') || normalizedMessage.includes('cost') || normalizedMessage.includes('subscription')) {
//       return {
//         id: Date.now().toString(),
//         content: 'We offer three subscription tiers: Free (basic listing), Paid (₹300 for enhanced visibility), and Premium (₹500 for maximum exposure including top placement in search and recommendations).',
//         sender: 'bot',
//         timestamp: new Date(),
//         suggestions: [
//           'What features in Premium plan?',
//           'Is Free plan good enough?',
//           'How to upgrade my listing?',
//           'Do you offer discounts?'
//         ]
//       };
//     } else if (normalizedMessage.includes('login') || normalizedMessage.includes('register') || normalizedMessage.includes('sign')) {
//       return {
//         id: Date.now().toString(),
//         content: user 
//           ? 'You are already logged in! You can access your dashboard to view your properties, saved searches, and account settings.'
//           : 'You can login or register from the top right corner of the website. Creating an account allows you to save properties, get personalized recommendations, and list your own properties.',
//         sender: 'bot',
//         timestamp: new Date(),
//         suggestions: user 
//           ? ['Take me to my dashboard', 'Show my saved properties', 'How to edit my profile?']
//           : ['Take me to login page', 'Benefits of registering', 'Can I browse without account?']
//       };
//     } else {
//       return {
//         id: Date.now().toString(),
//         content: 'I\'m here to help with any questions about real estate. You can ask about buying, selling, market trends, or get help with using our platform.',
//         sender: 'bot',
//         timestamp: new Date(),
//         suggestions: [
//           'Show me featured properties',
//           'How does the verification process work?',
//           'What are the current market trends?',
//           'Tell me about HomeDirectly'
//         ]
//       };
//     }
//   };

//   const handleSendMessage = () => {
//     if (!inputMessage.trim()) return;
    
//     // Add user message
//     const userMessage: Message = {
//       id: Date.now().toString(),
//       content: inputMessage,
//       sender: 'user',
//       timestamp: new Date()
//     };
    
//     setMessages(prev => [...prev, userMessage]);
//     setInputMessage('');
    
//     // Simulate typing indicator
//     const typingIndicator: Message = {
//       id: 'typing',
//       content: 'Typing...',
//       sender: 'system',
//       timestamp: new Date()
//     };
    
//     setMessages(prev => [...prev, typingIndicator]);
    
//     // Generate bot response after a delay
//     setTimeout(() => {
//       setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
      
//       const botResponse = generateBotResponse(inputMessage);
//       setMessages(prev => [...prev, botResponse]);
//     }, 1000);
//   };

//   const handleSuggestionClick = (suggestion: string) => {
//     // Add user message with the suggestion
//     const userMessage: Message = {
//       id: Date.now().toString(),
//       content: suggestion,
//       sender: 'user',
//       timestamp: new Date()
//     };
    
//     setMessages(prev => [...prev, userMessage]);
    
//     // Generate bot response
//     setTimeout(() => {
//       const botResponse = generateBotResponse(suggestion);
//       setMessages(prev => [...prev, botResponse]);
//     }, 800);
//   };

//   const toggleChatbot = () => {
//     setIsOpen(prev => !prev);
//     if (!isOpen) {
//       // Add a welcome back message if opening and not the first time
//       if (messages.length > 1) {
//         const welcomeBackMessage: Message = {
//           id: Date.now().toString(),
//           content: 'Welcome back! How can I assist you today?',
//           sender: 'bot',
//           timestamp: new Date(),
//           suggestions: [
//             'Show me recommended properties',
//             'Search by location',
//             'Find premium listings',
//             'Connect with an agent'
//           ]
//         };
//         setMessages(prev => [...prev, welcomeBackMessage]);
//       }
//     }
//   };

//   const formatTime = (date: Date) => {
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   const PropertySuggestion = ({ property }: { property: Property }) => {
//     return (
//       <Link href={`/properties/${property.id}`}>
//         <div className="flex border rounded-md p-2 hover:bg-muted transition-colors cursor-pointer mb-2">
//           <div className="h-14 w-14 rounded-md overflow-hidden flex-shrink-0 bg-gray-100 mr-3">
//             <img 
//               src={property.imageUrls?.[0] || 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'} 
//               alt={property.title} 
//               className="h-full w-full object-cover"
//             />
//           </div>
//           <div className="overflow-hidden">
//             <h4 className="font-medium text-sm truncate">{property.title}</h4>
//             <div className="flex items-center text-xs text-gray-600">
//               <MapPin className="h-3 w-3 mr-1" />
//               <span className="truncate">{property.location}</span>
//             </div>
//             <div className="text-xs font-medium mt-1">₹{property.price.toLocaleString('en-IN')}</div>
//           </div>
//         </div>
//       </Link>
//     );
//   };

//   return (
//     <>
//       {/* Chatbot Icon */}
//       <button
//         onClick={toggleChatbot}
//         className={`fixed z-50 right-6 bottom-6 p-3.5 rounded-full shadow-lg transition-all duration-300 ${
//           isOpen ? 'bg-gray-200 rotate-90 scale-0 opacity-0' : 'bg-primary text-white scale-100 opacity-100'
//         }`}
//       >
//         <MessageSquare className="h-6 w-6" />
//       </button>

//       {/* Chatbot Window */}
//       <div
//         className={`fixed z-50 ${
//           isMaximized 
//             ? 'top-4 right-4 left-4 bottom-4 rounded-xl' 
//             : 'right-6 bottom-6 w-96 h-[500px] rounded-xl'
//         } bg-white shadow-xl transition-all duration-300 flex flex-col overflow-hidden ${
//           isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'
//         }`}
//       >
//         {/* Header */}
//         <div className="bg-primary text-white p-3 flex items-center justify-between">
//           <div className="flex items-center">
//             <Bot className="h-5 w-5 mr-2" />
//             <h3 className="font-medium">HomeDirectly Assistant</h3>
//           </div>
//           <div className="flex items-center space-x-1.5">
//             <button 
//               onClick={() => setIsMaximized(!isMaximized)}
//               className="p-1 rounded-full hover:bg-primary-foreground/20 transition-colors"
//             >
//               {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
//             </button>
//             <button 
//               onClick={toggleChatbot}
//               className="p-1 rounded-full hover:bg-primary-foreground/20 transition-colors"
//             >
//               <X className="h-4 w-4" />
//             </button>
//           </div>
//         </div>

//         {/* Quick Action Tabs */}
//         <div className="flex border-b">
//           <button className="flex-1 p-2 text-xs flex flex-col items-center hover:bg-muted transition-colors">
//             <Home className="h-4 w-4 mb-1" />
//             <span>Home</span>
//           </button>
//           <button className="flex-1 p-2 text-xs flex flex-col items-center hover:bg-muted transition-colors">
//             <Search className="h-4 w-4 mb-1" />
//             <span>Search</span>
//           </button>
//           <button className="flex-1 p-2 text-xs flex flex-col items-center hover:bg-muted transition-colors">
//             <Building className="h-4 w-4 mb-1" />
//             <span>Properties</span>
//           </button>
//           <button className="flex-1 p-2 text-xs flex flex-col items-center hover:bg-muted transition-colors">
//             <User className="h-4 w-4 mb-1" />
//             <span>Agents</span>
//           </button>
//           <button className="flex-1 p-2 text-xs flex flex-col items-center hover:bg-muted transition-colors">
//             <PenSquare className="h-4 w-4 mb-1" />
//             <span>List</span>
//           </button>
//         </div>

//         {/* Messages */}
//         <div className="flex-1 overflow-y-auto p-4 space-y-4">
//           {messages.map((message) => (
//             <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
//               {message.sender === 'system' ? (
//                 <div className="px-4 py-2 text-gray-500 italic text-sm">{message.content}</div>
//               ) : (
//                 <div
//                   className={`max-w-[80%] rounded-xl px-4 py-2.5 ${
//                     message.sender === 'user'
//                       ? 'bg-primary text-primary-foreground rounded-tr-none'
//                       : 'bg-gray-100 text-gray-800 rounded-tl-none'
//                   }`}
//                 >
//                   <div className="text-sm">{message.content}</div>
                  
//                   {/* Timestamp */}
//                   <div className="text-[10px] opacity-70 text-right mt-1">
//                     {formatTime(message.timestamp)}
//                   </div>
                  
//                   {/* Property suggestions if any */}
//                   {message.properties && message.properties.length > 0 && (
//                     <div className="mt-3">
//                       <div className="text-[11px] font-medium mb-1.5 opacity-70">
//                         Recommended Properties:
//                       </div>
//                       <div>
//                         {message.properties.map(property => (
//                           <PropertySuggestion key={property.id} property={property} />
//                         ))}
//                       </div>
//                     </div>
//                   )}
                  
//                   {/* Suggestions if any */}
//                   {message.suggestions && message.suggestions.length > 0 && (
//                     <div className="mt-3 flex flex-wrap gap-2">
//                       {message.suggestions.map((suggestion, i) => (
//                         <button
//                           key={i}
//                           onClick={() => handleSuggestionClick(suggestion)}
//                           className="text-xs bg-white text-primary px-2.5 py-1.5 rounded-full border border-primary hover:bg-primary/5 transition-colors"
//                         >
//                           {suggestion}
//                         </button>
//                       ))}
//                     </div>
//                   )}
                  
//                   {/* Feedback buttons for bot messages */}
//                   {message.sender === 'bot' && !message.suggestions && (
//                     <div className="flex justify-end mt-2 space-x-1">
//                       <button className="p-1 rounded hover:bg-white/50 transition-colors">
//                         <ThumbsUp className="h-3 w-3" />
//                       </button>
//                       <button className="p-1 rounded hover:bg-white/50 transition-colors">
//                         <ThumbsDown className="h-3 w-3" />
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           ))}
//           <div ref={messagesEndRef} />
//         </div>

//         {/* Input Area */}
//         <div className="p-3 border-t">
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               handleSendMessage();
//             }}
//             className="flex items-center"
//           >
//             <Input
//               ref={inputRef}
//               type="text"
//               placeholder="Type your message..."
//               value={inputMessage}
//               onChange={(e) => setInputMessage(e.target.value)}
//               className="flex-1"
//             />
//             <Button 
//               type="submit" 
//               size="icon" 
//               className="ml-2" 
//               disabled={!inputMessage.trim()}
//             >
//               <Send className="h-4 w-4" />
//             </Button>
//           </form>
//           <div className="text-[10px] text-gray-500 mt-1.5 text-center">
//             Powered by HomeDirectly AI • Your data is secure
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }