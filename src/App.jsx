import React, { useState, useEffect, useRef } from 'react';
import { masterResources } from './data/resources'; // Extensionless safe relative route

// --- GLOBAL STATIC CONFIGURATIONS ---
const TOPICS = [
  { id: 'all', label: 'All Topics' },
  { id: 'stis', label: 'Sexually Transmitted Infections (STIs)' },
  { id: 'contraceptives', label: 'Birth Control' },
  { id: 'pregnancy', label: 'Pregnancy' },
  { id: 'safety', label: 'Healthy Relationships & Abuse' },
  { id: 'identity', label: 'LGBTQ+' },
];

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

const HIGH_RESTRICTION_STATES = ['Texas', 'Florida', 'Ohio', 'Alabama', 'Arkansas', 'Mississippi', 'Kentucky', 'Louisiana'];

const MASTER_HELPLINES = [
  { name: "Mhealth & Reproductive Rights Helpline (Repro Legal)", contact: "reprolegalhelpline.org", desc: "Completely secure online legal portal for absolute guidance on age rules, abortion pills, and judicial bypass laws." },
  { name: "Love is Respect (Teen Safety Line)", contact: "Text 'LOVEIS' to 22522", desc: "Call 1-866-331-9474. 100% confidential space to text or talk if a partner is checking your phone, threatening you, or hurting you." },
  { name: "Planned Parenthood Direct Routing", contact: "1-800-230-PLAN (7526)", desc: "Automatically connects your call directly to the nearest youth-vetted clinical health office for emergency contraception, testing, or advice." },
  { name: "988 Suicide & Crisis Lifeline", contact: "Text or Call 988", desc: "Free, confidential, 24/7 support framework if you are feeling completely overwhelmed, heavily anxious, or in deep distress." }
];

const FAQS = [
  {
    id: 'id-bc-1', trackingId: 'faq-bc-1', topic: 'contraceptives', categoryMatch: 'contraceptive', subType: 'all', anonymityOffer: true,
    question: "What's the best birth control?",
    answer: "There's no single best choice—it is all about what fits your unique routine and your body! If remembering a daily pill sounds tough, long-acting options like an IUD or an arm implant are super popular because you can just set them and forget them. Want to protect against both pregnancy and STIs? Condoms are your best bet."
  },
  {
    id: 'id-bc-2', trackingId: 'faq-bc-2', topic: 'contraceptives', categoryMatch: 'contraceptive', subType: 'routine', anonymityOffer: true,
    question: "Are condoms actually effective?",
    answer: "Yes, absolutely! When used correctly every single time, condoms are highly effective at preventing pregnancy. Plus, they're the absolute champions of sexual health because they are the only birth control method that also protects you and your partner from STIs."
  },
  {
    id: 'id-bc-3', trackingId: 'faq-bc-3', topic: 'contraceptives', categoryMatch: 'contraceptive', subType: 'routine', anonymityOffer: true,
    question: "Can I get birth control without my parents knowing?",
    answer: "In a lot of places, you absolutely can. Vetted, youth-friendly spaces like Title X family planning clinics and Planned Parenthood legally specialize in providing confidential care to minors. Your privacy is protected, and they won't notify anyone."
  },
  {
    id: 'id-sti-1', trackingId: 'faq-sti-1', topic: 'stis', categoryMatch: 'testing', subType: 'no', anonymityOffer: true,
    question: "How often should I get STI tested?",
    answer: "A great rule of thumb is to get tested once a year if you're sexually active, or whenever you start seeing someone new. Think of it as a normal, healthy part of your routine self-care. It's fast, simple, and the ultimate green flag in relationships!"
  },
  {
    id: 'id-sti-2', trackingId: 'faq-sti-2', topic: 'stis', anonymityOffer: false,
    question: "How do I even ask my partner to get tested?",
    answer: "It can feel a little nerve-wracking, but keeping it open and honest usually works best! Try saying something collaborative like: 'I want to make sure both of us stay safe and healthy. Let's go get checked out together before we take things further.' It shows you respect them and yourself."
  },
  {
    id: 'id-sti-3', trackingId: 'faq-sti-3', topic: 'stis', categoryMatch: 'testing', subType: 'yes', anonymityOffer: true,
    question: "Do STIs always show symptoms?",
    answer: "Actually, most of the time they don't! Common infections like chlamydia and gonorrhea frequently show zero symptoms, meaning someone could feel completely fine and have no idea they have one. Routine testing is the only real way to know for sure."
  },
  {
    id: 'id-gbv-1', trackingId: 'faq-gbv-1', topic: 'safety', categoryMatch: 'gbv', subType: 'digital', anonymityOffer: true,
    question: "My partner checks my phone... is that toxic?",
    answer: "You deserve privacy and trust. In a healthy relationship, partners don't feel the need to look through your personal messages, track your location without permission, or control who you hang out with. Those are definitely boundary crossings."
  },
  {
    id: 'id-preg-1', trackingId: 'faq-preg-1', topic: 'pregnancy', categoryMatch: 'abortion', subType: 'all', anonymityOffer: true,
    question: "I'm pregnant and freaking out. What now?",
    answer: "Take a deep breath—you are not alone, and you have time to figure this out. You have rights, and no one else gets to make this decision for you. Depending on your situation, you can look into parenting, choosing adoption, or having a safe abortion."
  }
];

export default function App() {
  const [activeTopic, setActiveTopic] = useState('all');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  // Core Location Coordinates
  const [userAge, setUserAge] = useState(''); 
  const [userState, setUserState] = useState('');
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  // Separate content suggest state hooks
  const [customQuestionText, setCustomQuestionText] = useState('');
  const [customResponseCard, setCustomResponseCard] = useState(null);
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);

  // 🚀 Scroll Targets to anchor user focus
  const chatWindowRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 📱 Focus screen back on the chat feed when new details stream in
  const focusOnChatBox = () => {
    chatWindowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    setMessages([
      {
        type: 'bot',
        text: "Hey there! Welcome to the AFAF assistant. No stigma, no judgment here. Before we explore the questions, what is your age and what state are you currently in? This lets the system accurately map exactly what pathways are open near you.",
        id: 'greeting',
        isProfileIntake: true
      }
    ]);
  }, []);

  // Smooth scroll logic whenever conversation streams change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, customResponseCard]);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (!userAge || !userState) return;

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setIsProfileComplete(true);
      setMessages(prev => [
        ...prev,
        {
          type: 'bot',
          text: `Got it, thanks for sharing! Your settings are synchronized with local guidelines. Look directly below to browse topics and view questions.`,
          id: Date.now()
        }
      ]);
      focusOnChatBox();
    }, 800);
  };

  const handleTopicClick = (topicId, topicLabel) => {
    if (!isProfileComplete) return;
    setActiveTopic(topicId);
    setShowSuggestionForm(false); 
    setMessages(prev => [
      ...prev,
      { type: 'system', text: `Viewing questions for: ${topicLabel}`, id: Date.now() }
    ]);
    focusOnChatBox(); // Keeps eyes on the chat updates
  };

  const handleCalculateRecommendations = (serviceId, subType) => {
    const rawData = Array.isArray(masterResources) ? masterResources : [];
    let list = [...rawData];
    
    const isMinor = Number(userAge) < 18;
    const isRestricted = HIGH_RESTRICTION_STATES.includes(userState);

    list = list.filter(item => item?.category === 'all' || item?.category === serviceId);

    if (isMinor && isRestricted) {
      list = list.filter(item => !item?.requiresParentalConsent);
      if (serviceId === 'abortion') {
        list = list.filter(item => item?.deliveryType !== 'in-person');
      }
    }

    if (subType && subType !== 'all') {
      list = list.filter(item => item?.subType === 'all' || item?.subType === subType);
    }

    return list.map(item => {
      let finalUrl = item?.link || '#';
      if (item?.link?.includes('ineedana.com') || item?.link?.includes('abortionfinder.org')) {
        finalUrl = `${item.link}/search?age=${userAge}&state=${userState}`;
      }
      return { ...item, link: finalUrl };
    });
  };

  const processFaqClick = (faq) => {
    if (!faq || !isProfileComplete) return;
    const messageId = Date.now();
    setMessages(prev => [...prev, { type: 'user', text: faq.question, id: messageId }]);
    setIsTyping(true);
    focusOnChatBox(); // Immediately pull viewport up so user can read the upcoming answer bubble smoothly

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        { 
          type: 'bot', 
          text: faq.answer, 
          hasOffer: faq.anonymityOffer,
          serviceContext: faq.categoryMatch,
          subContext: faq.subType,
          id: messageId + 1 
        }
      ]);
      focusOnChatBox();
    }, 1000);
  };

  const handleCustomFormSearch = (e) => {
    e.preventDefault();
    if (!customQuestionText.trim() || !isProfileComplete) return;

    const query = customQuestionText.toLowerCase();
    let textReply = "That is a really important question. While we map out a detailed breakdown for this specific topic, please do not wait to get the answers you need right now. Below are secure, trusted networks where you can instantly message or call an expert completely off-the-record.";
    let matchedCategory = null;
    let matchedSubType = 'all';
    let yieldsFacilities = false;

    const abortionWords = ['abortion', 'pill', 'pills', 'termination', 'terminate', 'plan c', 'clinic'];
    const testingWords = ['sti', 'std', 'test', 'testing', 'hiv', 'chlamydia', 'gonorrhea', 'burn', 'itch', 'pain'];
    const birthControlWords = ['birth control', 'plan b', 'morning after', 'condom', 'patch', 'shot', 'iud', 'implant', 'prevent'];
    const safetyWords = ['abuse', 'scared', 'hurt', 'hit', 'shelter', 'violence', 'controlling', 'toxic', 'relationship'];

    if (abortionWords.some(word => query.includes(word))) {
      textReply = "That is a time-sensitive question. While our team is actively mapping this specific scenario, please don't wait. Below are verified, legal care pathways and resources ready to guide you step-by-step right now.";
      matchedCategory = "abortion";
      yieldsFacilities = true;
    } else if (testingWords.some(word => query.includes(word))) {
      textReply = "This is a key sexual health question. While we add this exact topic to our list, remember that routine testing is standard and completely confidential. Below are spaces where you can find quick options safely.";
      matchedCategory = "testing";
      matchedSubType = (query.includes('burn') || query.includes('itch') || query.includes('pain')) ? 'yes' : 'no';
      yieldsFacilities = true;
    } else if (birthControlWords.some(word => query.includes(word))) {
      textReply = "This is an important question. If you need birth control or emergency morning-after options right now, hours matter. Below are verified paths to help you figure out your options quickly and privately.";
      matchedCategory = "contraceptive";
      matchedSubType = (query.includes('plan b') || query.includes('morning after')) ? 'emergency' : 'routine';
      yieldsFacilities = true;
    } else if (safetyWords.some(word => query.includes(word))) {
      textReply = "Your safety is what matters most. While we log this topic, please remember there are completely private, un-logged support networks and safe spaces ready to help protect you without judgment.";
      matchedCategory = "gbv";
      matchedSubType = query.includes('shelter') ? 'physical' : 'digital';
      yieldsFacilities = true;
    }

    setCustomResponseCard({
      question: customQuestionText,
      answer: textReply,
      hasOffer: yieldsFacilities,
      serviceContext: matchedCategory,
      subContext: matchedSubType,
      showRecommendations: false
    });

    setCustomQuestionText('');
    setShowSuggestionForm(false); 
  };

  const toggleInlineRecommendations = (msgId, serviceContext, subContext) => {
    const computedList = handleCalculateRecommendations(serviceContext, subContext);
    setMessages(prev => prev.map(m => {
      if (m.id === msgId) {
        return { ...m, activeRecommendations: computedList, viewRecommendations: !m.viewRecommendations };
      }
      return m;
    }));
  };

  const toggleSeparateCardRecommendations = () => {
    if (!customResponseCard) return;
    const computedList = handleCalculateRecommendations(customResponseCard.serviceContext, customResponseCard.subContext);
    setCustomResponseCard(prev => ({
      ...prev,
      recommendations: computedList,
      showRecommendations: !prev.showRecommendations
    }));
  };

  const handleResetChat = () => {
    setUserAge('');
    setUserState('');
    setIsProfileComplete(false);
    setCustomResponseCard(null);
    setShowSuggestionForm(false);
    setMessages([
      {
        type: 'bot',
        text: "Hey there! Welcome to the AFAF assistant. No stigma, no judgment here. Before we explore the questions, what is your age and what state are you currently in? This lets the system accurately map exactly what pathways are open near you.",
        id: 'greeting',
        isProfileIntake: true
      }
    ]);
    setIsTyping(false);
  };

  const filteredFaqs = Array.isArray(FAQS) 
    ? (activeTopic === 'all' ? FAQS : FAQS.filter(faq => faq?.topic === activeTopic))
    : [];

  return (
    <div className="bg-[#FDF8F8] min-h-screen font-sans antialiased flex flex-col items-center w-full pb-20">

      {/* HEADER BANNER */}
      <div className="w-full bg-[#E0D4FD] pt-12 pb-16 px-4 flex flex-col items-center rounded-b-[2rem] shadow-sm">
        <h1 
          className="text-3xl sm:text-5xl font-black text-[#163D46] text-center max-w-3xl leading-tight tracking-tight" 
          style={{fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'}}
        >
          Frequently Asked Questions
        </h1>
      </div>

      {/* MAIN LAYOUT WRAPPER */}
      <div className="w-full max-w-2xl px-3 sm:px-4 flex flex-col mt-6 space-y-6">
        
        {/* TOPICS SELECTION BLOCK */}
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-[#163D46] tracking-tight">Select a Topic</h2>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((topic) => (
              <button
                key={topic.id} 
                disabled={!isProfileComplete}
                onClick={() => handleTopicClick(topic.id, topic.label)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border-2 disabled:opacity-30 ${
                  isProfileComplete ? 'cursor-pointer active:scale-95' : ''
                } ${
                  activeTopic === topic.id
                    ? 'bg-[#E0D4FD] text-[#163D46] border-[#C8B4FA] shadow-sm'
                    : 'bg-white text-[#5F737B] border-[#E5E7EB]'
                }`}
              >
                {topic.label}
              </button>
            ))}
          </div>
        </div>

        {/* 🚀 CHAT CONTAINER BOX (Attached ref to track focal scroll targets) */}
        <div ref={chatWindowRef} className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden scroll-mt-4">
          
          <div className="bg-white border-b border-gray-50 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                  <div className="text-[10px] font-black bg-[#E0D4FD] text-[#163D46] rounded-full w-8 h-8 flex items-center justify-center tracking-widest">AFAF</div>
                  <div>
                      <h3 className="font-extrabold text-sm sm:text-base text-[#163D46] leading-tight">AFAF FAQ Assistant</h3>
                      <p className="text-[10px] text-[#5F737B] flex items-center gap-1 mt-0.5 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] block"></span> 100% Private
                      </p>
                  </div>
              </div>
              <button onClick={handleResetChat} className="text-xs font-bold text-[#5F737B] hover:text-[#163D46] transition-colors underline cursor-pointer">
                  Restart Assistant
              </button>
          </div>

          {/* Conversational History Feed Area */}
          <div className="p-4 sm:p-5 flex flex-col gap-4 bg-[#FDF8F8]/20">
              {Array.isArray(messages) && messages.map((msg) => {
                if (msg.type === 'system') {
                  return (
                    <div key={msg.id} className="flex justify-center my-0.5">
                      <span className="text-[10px] font-bold text-[#5F737B] uppercase tracking-wider bg-white border border-gray-100 px-3 py-1 rounded-full shadow-xs">{msg.text}</span>
                    </div>
                  );
                }

                const isUser = msg.type === 'user';

                return (
                  <div key={msg.id} className={`flex flex-col w-full max-w-[90%] sm:max-w-[82%] ${isUser ? 'self-end' : 'self-start'}`}>
                    <div className={`text-sm sm:text-[15px] leading-relaxed px-4 py-3 shadow-xs ${
                      isUser 
                        ? 'bg-[#E0D4FD] text-[#163D46] rounded-2xl rounded-tr-xs font-semibold self-end' 
                        : msg.isProfileIntake && !isProfileComplete
                          ? 'bg-[#FEF3C7] text-[#78350F] border border-[#FDE68A] rounded-2xl rounded-tl-xs font-medium' 
                          : 'bg-white text-[#163D46] border border-gray-100 rounded-2xl rounded-tl-xs font-medium'
                    }`}>
                        {msg.text}

                        {/* INITIAL INLINE INTRODUCTORY FIELD FORM */}
                        {!isUser && msg.isProfileIntake && !isProfileComplete && (
                          <form onSubmit={handleProfileSubmit} className="mt-3 flex flex-col sm:flex-row gap-2 items-end border-t border-[#FDE68A] pt-3 w-full">
                            <div className="flex gap-2 w-full">
                              <input 
                                type="number" placeholder="Age" min="12" max="100" value={userAge} onChange={(e) => setUserAge(e.target.value)} 
                                className="w-16 p-2 text-xs font-bold bg-white border border-gray-200 rounded-lg text-[#163D46] focus:outline-none" required 
                              />
                              <select 
                                value={userState} onChange={(e) => setUserState(e.target.value)}
                                className="flex-1 p-2 text-xs font-bold bg-white border border-gray-200 rounded-lg text-slate-700 focus:outline-none" required
                              >
                                <option value="">Select State...</option>
                                {US_STATES.map(st => <option key={st} value={st}>{st}</option>)}
                              </select>
                            </div>
                            <button type="submit" className="w-full sm:w-auto bg-[#163D46] text-white text-xs font-black px-4 py-2 rounded-lg uppercase tracking-wider transition-all cursor-pointer text-center">Confirm</button>
                          </form>
                        )}

                        {/* TAILORED RECOMENDATIONS ACTION LINK */}
                        {!isUser && msg.hasOffer && isProfileComplete && (
                          <div className="mt-2.5 pt-2.5 border-t border-gray-100 flex flex-col text-left">
                            <p className="text-xs font-semibold text-[#5F737B] leading-normal">Would you like to look at verified recommendations for free, safe, or confidential care paths matching your settings?</p>
                            <button 
                              onClick={() => toggleInlineRecommendations(msg.id, msg.serviceContext, msg.subContext)} 
                              className="text-xs font-black text-purple-700 hover:text-purple-900 underline underline-offset-2 text-left mt-1 cursor-pointer"
                            >
                              {msg.viewRecommendations ? "Hide recommendations ➔" : "Yes, show tailored options ➔"}
                            </button>
                          </div>
                        )}
                    </div>

                    {/* MOUNTED RECOMMENDED CARD ARRAYS */}
                    {!isUser && msg.viewRecommendations && msg.activeRecommendations && (
                      <div className="mt-2 space-y-2 w-full pl-0.5">
                        {Number(userAge) < 18 && HIGH_RESTRICTION_STATES.includes(userState) && msg.serviceContext === 'abortion' && (
                          <div className="bg-amber-50 border border-amber-100 p-2.5 rounded-xl text-xs text-amber-900 font-medium leading-normal">
                            Notice: Clinical in-person resources have parent notification laws inside {userState}. We have safely isolated alternative protected paths.
                          </div>
                        )}
                        {msg.activeRecommendations.map((fac, idx) => (
                          <div key={idx} className="p-3.5 bg-white border border-gray-100 rounded-xl shadow-xs flex items-center justify-between gap-3">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h4 className="font-extrabold text-xs text-[#163D46]">{fac?.name || 'Vetted Space'}</h4>
                                <span className="text-[8px] bg-gray-50 border border-gray-100 font-black px-1.5 py-0.5 rounded-full text-gray-500 uppercase">{fac?.deliveryType === 'mail' ? 'Mail' : 'Clinic'}</span>
                              </div>
                              <p className="text-xs text-gray-500 leading-normal">{fac?.desc || ''}</p>
                            </div>
                            <a href={fac?.link || '#'} target="_blank" rel="noopener noreferrer" className="bg-[#163D46] text-white text-[10px] font-black py-2 px-2.5 rounded-lg uppercase transition-all shrink-0">Open</a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {isTyping && (
                <div className="bg-white border border-gray-100 self-start rounded-2xl rounded-tl-xs px-4 py-3 text-sm flex gap-1 items-center shadow-xs">
                    <span className="w-1.5 h-1.5 bg-[#163D46]/40 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-[#163D46]/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-[#163D46]/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              )}
              <div ref={messagesEndRef} />
          </div>

          {/* 🌟 UPGRADED CHAT FLOW MENU: Open by default, clean inline entry trigger */}
          <div className="bg-white border-t border-gray-100 z-10">
              {isProfileComplete && (
                <div className="p-3 flex flex-col gap-2 bg-white">
                    {filteredFaqs.map((faq) => (
                      <button
                        key={faq.id} onClick={() => processFaqClick(faq)} disabled={isTyping}
                        className="w-full text-left bg-white border border-gray-100 hover:border-[#C8B4FA] active:bg-[#F8F5FF] text-[#163D46] px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex justify-between items-center gap-3 cursor-pointer touch-manipulation shadow-xs"
                      >
                        <span className="pr-1 leading-snug">{faq.question}</span>
                        <span className="text-[#C8B4FA] shrink-0 text-xs font-black">➔</span>
                      </button>
                    ))}

                    {/* Integrated custom question link trigger inside focal sight */}
                    <div className="pt-2 mt-1 border-t border-dashed border-gray-200 flex justify-center">
                      <button 
                        onClick={() => { setShowSuggestionForm(!showSuggestionForm); }}
                        className="text-xs font-black text-purple-700 hover:text-purple-900 bg-purple-50/60 border border-purple-100 px-4 py-2.5 rounded-xl transition-all cursor-pointer text-center w-full active:scale-95"
                      >
                        {showSuggestionForm ? "✕ Close Suggestion Box" : "💡 Didn't see your question? Ask it here!"}
                      </button>
                    </div>
                </div>
              )}
          </div>
        </div>

        {/* --- DYNAMIC CUSTOM FORM ENTRY ZONE --- */}
        {showSuggestionForm && isProfileComplete && (
          <div className="bg-white border-2 border-purple-100 p-4 sm:p-5 rounded-2xl shadow-sm space-y-3 animate-fade-in text-left">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-purple-900">Ask something else</h3>
              <p className="text-xs text-[#5F737B] mt-0.5">Got a different question? Drop it right here! We use these anonymous suggestions to keep our question list fresh and helpful for everyone.</p>
            </div>
            <form onSubmit={handleCustomFormSearch} className="flex gap-2">
              <input 
                type="text" value={customQuestionText} onChange={(e) => setCustomQuestionText(e.target.value)}
                placeholder="Type your question safely here..." 
                className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-[#C8B4FA] focus:bg-white"
                required
              />
              <button type="submit" disabled={!customQuestionText.trim()} className="bg-purple-900 text-white text-xs font-black px-4 rounded-xl uppercase tracking-wider cursor-pointer active:scale-95">
                Submit
              </button>
            </form>
          </div>
        )}

        {/* CUSTOM EMERGENCY AND TAILORED RESOURCES DISPLAY MODULE */}
        {customResponseCard && (
          <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-4 text-left animate-fade-in">
            
            <div className="bg-purple-50 border border-purple-100 text-purple-950 p-3 rounded-xl text-xs leading-relaxed font-semibold">
              📌 <strong>Your question has been securely logged.</strong> Thank you—this helps us build more accurate material. Because we want to make sure you have access to help immediately, please review the emergency avenues below:
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-purple-500 tracking-wider block">Your Question Context:</span>
              <p className="text-xs sm:text-sm font-bold text-[#163D46] italic">"{customResponseCard.question}"</p>
              <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed pt-1 border-b border-gray-100 pb-3">{customResponseCard.answer}</p>
            </div>
            
            {customResponseCard.hasOffer && (
              <div className="py-1 flex flex-col gap-1">
                <p className="text-xs font-extrabold text-[#5F737B]">Would you like to unlock our customized, state-specific facility filters mapped for your age group ({userAge}) inside {userState}?</p>
                <button 
                  onClick={toggleSeparateCardRecommendations} 
                  className="text-xs font-black text-purple-700 hover:text-purple-900 underline text-left cursor-pointer mt-0.5"
                >
                  {customResponseCard.showRecommendations ? "Hide matching paths ➔" : "Yes, show matching service links ➔"}
                </button>
              </div>
            )}

            {customResponseCard.showRecommendations && customResponseCard.recommendations && customResponseCard.recommendations.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-gray-200">
                <span className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">Tailored Resource Matches:</span>
                {customResponseCard.recommendations.map((rec, idx) => (
                  <div key={idx} className="p-3 bg-white border border-gray-100 rounded-xl shadow-xs flex items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-xs text-[#163D46]">{rec?.name || 'Vetted Resource'}</h4>
                      <p className="text-xs text-gray-500 leading-normal mt-0.5">{rec?.desc || ''}</p>
                    </div>
                    <a href={rec?.link || '#'} target="_blank" rel="noopener noreferrer" className="bg-[#163D46] text-white text-[10px] font-bold py-1.5 px-2.5 rounded-lg uppercase tracking-wider shrink-0">Open</a>
                  </div>
                ))}
              </div>
            )}

            {/* 🔒 Master 24/7 National Emergency Helplines Directory Block */}
            <div className="space-y-3 pt-3 border-t border-gray-200">
              <span className="block text-[10px] font-black uppercase text-red-500 tracking-widest animate-pulse">⚡ Urgent 24/7 Confidential Helplines:</span>
              <div className="grid grid-cols-1 gap-2">
                {MASTER_HELPLINES.map((line, lIdx) => (
                  <div key={lIdx} className="p-3 bg-white border border-red-50 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
                    <div className="space-y-0.5">
                      <h4 className="font-extrabold text-xs text-slate-900">{line.name}</h4>
                      <p className="text-[11px] text-slate-500 leading-normal">{line.desc}</p>
                    </div>
                    <span className="text-xs font-black text-red-600 bg-red-50/50 border border-red-100 px-2.5 py-1 rounded-lg shrink-0 text-center select-all">{line.contact}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}