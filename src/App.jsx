import React, { useState } from 'react';

// --- GLOBAL STATIC CONFIGURATIONS ---
const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

const TOPICS = [
  { id: 'all', label: 'All Topics' },
  { id: 'anatomy', label: 'Sex & Anatomy' },
  { id: 'contraceptives', label: 'Birth Control' },
  { id: 'stis', label: 'STIs & Testing' },
  { id: 'pregnancy', label: 'Pregnancy' },
  { id: 'abortion', label: 'Abortion Options' },
  { id: 'gbv', label: 'Gender-Based Violence (GBV)' },
  { id: 'identity', label: 'LGBTQ+' },
  { id: 'suggest', label: '💡 Suggest a Topic' },
  { id: 'crisis', label: '🚨 Crisis Support' }
];

const MASTER_HELPLINES = [
  { name: "Mhealth & Reproductive Rights Helpline", contact: "reprolegalhelpline.org", desc: "Secure online legal portal for guidance on age rules and judicial bypass laws." },
  { name: "Love is Respect (Teen Safety Line)", contact: "Text 'LOVEIS' to 22522", desc: "100% confidential space to text or talk if a partner is threatening or hurting you." },
  { name: "Planned Parenthood Direct", contact: "1-800-230-PLAN", desc: "Connects your call directly to the nearest clinical health office." },
  { name: "988 Suicide & Crisis Lifeline", contact: "Text or Call 988", desc: "Free, confidential, 24/7 support if you are feeling completely overwhelmed." }
];

const FAQS = [
  // --- SEX & ANATOMY ---
  { id: 'anat-1', topic: 'anatomy', relatedService: null, question: "Is it normal that one of my testicles is bigger than the other?", answer: "Yes, it is completely normal! For the vast majority of people with testicles, one is slightly larger than the other, and one usually hangs a bit lower. As long as there is no sudden swelling, pain, or hard lumps, you have nothing to worry about." },
  { id: 'anat-2', topic: 'anatomy', relatedService: null, question: "What is a normal vulva supposed to look like?", answer: "There is no single 'normal' look! Vulvas come in all different shapes, sizes, and colors. The inner lips (labia minora) can be longer than the outer lips, they can be asymmetrical, and they can range in color from pink to dark brown or purplish." },
  { id: 'anat-3', topic: 'anatomy', relatedService: null, question: "Why do I get random erections?", answer: "Random erections happen to almost everyone with a penis, especially during puberty. They are caused by hormonal fluctuations and normal bodily functions, completely unrelated to being turned on. It is a sign your body is healthy!" },
  { id: 'anat-4', topic: 'anatomy', relatedService: null, question: "Does masturbating have any negative side effects?", answer: "No! Masturbation is a completely normal, healthy, and safe way to explore your body and understand what feels good. It does not cause blindness, acne, or physical damage. The only negative is if it starts interfering with your daily life or responsibilities." },
  { id: 'anat-5', topic: 'anatomy', relatedService: null, question: "Why are my periods so irregular?", answer: "It is incredibly common for periods to be irregular, especially in the first few years after they start. Stress, diet, exercise, and normal hormonal shifts can all affect your cycle. However, if they stop entirely or are extremely painful, it's a good idea to check in with a doctor." },

  // --- BIRTH CONTROL ---
  { id: 'bc-1', topic: 'contraceptives', relatedService: 'contraceptive', question: "What's the best birth control?", answer: "There's no single best choice—it is all about what fits your unique routine! If remembering a daily pill is tough, long-acting options like an IUD or an arm implant are popular because you can set them and forget them. Condoms are the only method that also protects against STIs." },
  { id: 'bc-2', topic: 'contraceptives', relatedService: 'contraceptive', question: "Can I get birth control without my parents knowing?", answer: "In many places, you absolutely can. Youth-friendly spaces like Title X family planning clinics and Planned Parenthood specialize in providing confidential care to minors without notifying parents." },
  { id: 'bc-3', topic: 'contraceptives', relatedService: 'contraceptive', question: "Are condoms actually effective?", answer: "Yes! When used correctly every single time, condoms are highly effective at preventing pregnancy. Plus, they are the absolute champions of sexual health because they protect you and your partner from STIs." },
  { id: 'bc-4', topic: 'contraceptives', relatedService: 'contraceptive', question: "What should I do if I miss a birth control pill?", answer: "It depends on the type of pill! For combination pills, taking it as soon as you remember is key. For progestin-only pills, missing it by even 3 hours means you should use a backup method (like a condom) for the next 48 hours. Always read the instructions on your specific pill pack." },
  { id: 'bc-5', topic: 'contraceptives', relatedService: 'contraceptive', question: "Does the morning-after pill (Plan B) cause an abortion?", answer: "No. Emergency contraception (like Plan B) works by delaying ovulation—preventing an egg from being released so sperm can't fertilize it. If you are already pregnant, it will not harm or end the pregnancy." },

  // --- STIs ---
  { id: 'sti-1', topic: 'stis', relatedService: 'testing', question: "How often should I get STI tested?", answer: "A great rule of thumb is to get tested once a year if you're sexually active, or whenever you start seeing someone new. Think of it as a normal, healthy part of your routine self-care." },
  { id: 'sti-2', topic: 'stis', relatedService: 'testing', question: "Do STIs always show symptoms?", answer: "Actually, most of the time they don't! Common infections like chlamydia and gonorrhea frequently show zero symptoms. You could feel completely fine and have no idea you have one, which is why routine testing is so important." },
  { id: 'sti-3', topic: 'stis', relatedService: 'testing', question: "Can I get an STI from oral sex?", answer: "Yes. Many STIs, including herpes, gonorrhea, syphilis, and HPV, can easily be transmitted through oral sex. Using barriers like condoms or dental dams during oral sex greatly reduces this risk." },
  { id: 'sti-4', topic: 'stis', relatedService: 'testing', question: "What happens if an STI is left untreated?", answer: "Untreated STIs can lead to serious long-term health issues, including chronic pain, infertility, and an increased risk of getting HIV. The good news is that most STIs are completely curable with basic antibiotics." },
  { id: 'sti-5', topic: 'stis', relatedService: 'testing', question: "How do I even ask my partner to get tested?", answer: "It can feel nerve-wracking, but keeping it collaborative works best. Try: 'I want to make sure both of us stay safe and healthy. Let's go get checked out together before we take things further.' It shows deep respect for both of you." },

  // --- PREGNANCY ---
  { id: 'preg-1', topic: 'pregnancy', relatedService: 'pregnancy', question: "When is the best time to take a pregnancy test?", answer: "For the most accurate result, wait until the first day of your missed period. If your periods are irregular, wait at least 21 days after the unprotected sex happened. Testing too early can result in a false negative." },
  { id: 'preg-2', topic: 'pregnancy', relatedService: 'pregnancy', question: "Can a pregnancy test be wrong?", answer: "False negatives are common if you test too early before your body has built up enough pregnancy hormones (hCG). However, false positives are extremely rare. If the test says positive, you are almost certainly pregnant." },
  { id: 'preg-3', topic: 'pregnancy', relatedService: 'pregnancy', question: "What are the earliest signs of pregnancy?", answer: "A missed period is the most common first sign. Others include swollen or tender breasts, nausea (morning sickness), feeling unusually tired, and frequent urination. However, stress can also mimic some of these signs." },
  { id: 'preg-4', topic: 'pregnancy', relatedService: 'pregnancy', question: "Can I get pregnant if we used the pull-out method?", answer: "Yes. Pre-ejaculate (pre-cum) can contain active sperm, and it takes very precise timing to pull out correctly every single time. It is not a highly reliable way to prevent pregnancy on its own." },
  { id: 'preg-5', topic: 'pregnancy', relatedService: 'pregnancy', question: "Where can I get a free or confidential pregnancy test?", answer: "You can find free, highly confidential tests at Title X family planning clinics, Planned Parenthood, or local health departments. Many community health centers will not require parental notification." },

  // --- ABORTION ---
  { id: 'abrt-1', topic: 'abortion', relatedService: 'abortion', question: "I'm pregnant and freaking out. What are my options?", answer: "Take a deep breath—you are not alone. Depending on your age and the state you live in, you have options. You can look into parenting, choosing adoption, or safely terminating the pregnancy via an abortion." },
  { id: 'abrt-2', topic: 'abortion', relatedService: 'abortion', question: "How do abortion pills actually work?", answer: "Abortion pills (usually Mifepristone and Misoprostol) stop the pregnancy from growing and help your uterus empty itself. It feels very similar to an early miscarriage or a very heavy, crampy period." },
  { id: 'abrt-3', topic: 'abortion', relatedService: 'abortion', question: "Will having an abortion affect my ability to get pregnant later?", answer: "No. Safe, uncomplicated medical or procedural abortions do not affect your future fertility or your ability to have healthy pregnancies later in life." },
  { id: 'abrt-4', topic: 'abortion', relatedService: 'abortion', question: "Are abortions painful?", answer: "It varies. For the abortion pill, you can expect strong cramping and bleeding, similar to a very heavy period. For procedural abortions, clinics use numbing medications and sometimes sedation to keep you comfortable." },
  { id: 'abrt-5', topic: 'abortion', relatedService: 'abortion', question: "How much does an abortion usually cost?", answer: "It depends on the method and how far along you are. The abortion pill can cost anywhere from $150 (online) to $600 (in clinic). Procedural abortions can be higher. However, many independent funds exist to help cover these costs completely if you cannot afford it." },

  // --- GBV & SAFETY ---
  { id: 'gbv-1', topic: 'gbv', relatedService: 'gbv', question: "My partner checks my phone... is that toxic?", answer: "You deserve privacy and trust. Partners shouldn't feel the need to read your personal messages or track your location without permission. These are boundary crossings and common signs of a controlling relationship." },
  { id: 'gbv-2', topic: 'gbv', relatedService: 'gbv', question: "How do I safely leave someone who scares me?", answer: "If you feel unsafe, do not alert them that you are planning to leave. Reach out to a trusted friend, counselor, or use a secure hotline (like Love is Respect) to create a safe exit plan. Always clear your internet history after looking up help." },
  { id: 'gbv-3', topic: 'gbv', relatedService: 'gbv', question: "What is the difference between healthy boundaries and control?", answer: "A boundary is about protecting yourself (e.g., 'I won't stay if you yell at me'). Control is about restricting the other person (e.g., 'You are not allowed to hang out with those friends')." },
  { id: 'gbv-4', topic: 'gbv', relatedService: 'gbv', question: "Can emotional abuse be just as bad as physical abuse?", answer: "Absolutely. Emotional abuse—like constant insults, manipulation, gaslighting, and isolating you from friends—can cause deep psychological harm. Abuse does not have to leave physical bruises to be real and dangerous." },
  { id: 'gbv-5', topic: 'gbv', relatedService: 'gbv', question: "What should I do if someone is pressuring me into sex?", answer: "You always have the right to say no, even if you are dating, or even if you have had sex with them before. If they continue to pressure, guilt-trip, or force you, that is coercion and sexual assault. Reach out to a trusted adult or safety hotline immediately." },

  // --- LGBTQ+ IDENTITY ---
  { id: 'id-1', topic: 'identity', relatedService: 'lgbtq', question: "How do I know what my sexual orientation is?", answer: "It takes time! Sexual orientation is about who you feel physical or romantic attraction to. It is perfectly okay to not have a label, or to change your label as you learn more about yourself." },
  { id: 'id-2', topic: 'identity', relatedService: 'lgbtq', question: "What does it mean to be non-binary?", answer: "Non-binary is an umbrella term for people whose gender identity doesn't sit comfortably inside the strict 'man' or 'woman' boxes. They might feel like a mix of both, neither, or a completely different gender entirely." },
  { id: 'id-3', topic: 'identity', relatedService: 'lgbtq', question: "How can I safely explore my gender identity?", answer: "You can start with reversible, private steps: trying out different pronouns with trusted friends online, experimenting with clothing, or joining secure, anonymous youth support groups like Q Chat Space to talk to peers." },
  { id: 'id-4', topic: 'identity', relatedService: 'lgbtq', question: "How do I come out to my friends or family?", answer: "You only have to come out if and when you are ready, and only if it is safe to do so. Start with one person you deeply trust. If you rely on your parents for housing and think they might react dangerously, your safety is the number one priority." },
  { id: 'id-5', topic: 'identity', relatedService: 'lgbtq', question: "Where can I find a safe, affirming LGBTQ+ community?", answer: "If your local school or town doesn't have an affirming club, digital networks are incredible. The Trevor Project and PFLAG offer highly moderated, secure online spaces to connect with other queer youth safely." }
];

export default function App() {
  const [activeTopic, setActiveTopic] = useState('all');
  const [faqSearch, setFaqSearch] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState(null);

  // Suggestion Box State
  const [customQuestionText, setCustomQuestionText] = useState('');
  const [customResponseCard, setCustomResponseCard] = useState(null);

  // Inline Feedback States
  const [feedbackMap, setFeedbackMap] = useState({}); 
  const [feedbackText, setFeedbackText] = useState(''); 

  // 🚀 Smart Bridge CTA States
  const [bridgeActiveFaq, setBridgeActiveFaq] = useState(null);
  const [bridgeAge, setBridgeAge] = useState('');
  const [bridgeState, setBridgeState] = useState('');

  const handleTopicClick = (topicId) => {
    setActiveTopic(topicId);
    setExpandedFaqId(null);
    setFeedbackText('');
    setCustomResponseCard(null); 
    setBridgeActiveFaq(null); 
  };

  const toggleFaq = (faqId) => {
    setExpandedFaqId(expandedFaqId === faqId ? null : faqId);
    setFeedbackText(''); 
    setBridgeActiveFaq(null); 
  };

  const handleCustomFormSearch = (e) => {
    e.preventDefault();
    if (!customQuestionText.trim()) return;

    setCustomResponseCard({
      status: "success",
      message: "Thank you! We have logged your topic suggestion. Our team regularly reviews these submissions to write new answers and expand our guide. In the meantime, if you need urgent help, please use the secure helplines below."
    });
    setCustomQuestionText('');
  };

  const handleInitialFeedback = (faqId, isHelpful) => {
    setFeedbackMap(prev => ({ ...prev, [faqId]: isHelpful ? 'yes' : 'no' }));
  };

  const handleFinalFeedbackSubmit = (faqId) => {
    setFeedbackMap(prev => ({ ...prev, [faqId]: 'completed' }));
    setFeedbackText('');
  };

  // 🚀 NEW: Silent Demographics Logger & Redirect
  const handleBridgeRedirect = (serviceId) => {
    // 1. Fire an event to Google Analytics (Silently captures the data)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'service_bridge_click', {
        'user_age': bridgeAge || 'unspecified',
        'user_state': bridgeState || 'unspecified',
        'service_type': serviceId
      });
    }

    // 2. Build the URL and open the external app
    const url = `https://service-finder-puce.vercel.app/?service=${serviceId}${bridgeAge ? `&age=${bridgeAge}` : ''}${bridgeState ? `&state=${bridgeState}` : ''}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Advanced Filtering
  let filteredFaqs = FAQS;
  if (activeTopic !== 'all' && activeTopic !== 'suggest' && activeTopic !== 'crisis') {
    filteredFaqs = filteredFaqs.filter(faq => faq.topic === activeTopic);
  }
  if (faqSearch.trim() !== '') {
    filteredFaqs = filteredFaqs.filter(faq => 
      faq.question.toLowerCase().includes(faqSearch.toLowerCase()) || 
      faq.answer.toLowerCase().includes(faqSearch.toLowerCase())
    );
  }

  return (
    <div className="bg-[#FDF8F8] min-h-screen font-sans antialiased flex flex-col items-center w-full pb-20">

      {/* HEADER HERO BANNER */}
      <div className="w-full bg-[#E0D4FD] pt-12 pb-16 px-6 flex flex-col items-center rounded-b-[2rem] shadow-sm">
        <h1 
          className="text-3xl sm:text-5xl font-black text-[#163D46] text-center max-w-3xl leading-tight tracking-tight" 
          style={{fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'}}
        >
          Frequently Asked Questions
        </h1>
        <p className="text-[#163D46]/80 mt-3 text-sm font-semibold text-center max-w-md">
          Clear, stigma-free information to help you navigate your health and safety.
        </p>
      </div>

      <div className="w-full max-w-4xl px-4 flex flex-col mt-6 space-y-8">
        
        {/* 🔍 SEARCH & FILTERS ROW */}
        <div className="flex flex-col gap-5">
          <div className="relative w-full">
            <input 
              type="text"
              placeholder="Search for a question or keyword..."
              value={faqSearch}
              onChange={(e) => {
                setFaqSearch(e.target.value);
                if(activeTopic === 'suggest' || activeTopic === 'crisis') setActiveTopic('all');
              }}
              className="w-full p-4 pl-12 bg-white border border-gray-200 rounded-2xl shadow-sm text-sm font-medium text-slate-800 focus:outline-none focus:border-[#C8B4FA] focus:ring-2 focus:ring-[#C8B4FA]/20 transition-all"
            />
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
              ⚲
            </span>
          </div>

          {/* 🗂️ MAIN TOPICS NAVIGATION PILLS */}
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((topic) => (
              <button
                key={topic.id} 
                onClick={() => handleTopicClick(topic.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all border-2 cursor-pointer active:scale-95 ${
                  activeTopic === topic.id
                    ? 'bg-[#E0D4FD] text-[#163D46] border-[#C8B4FA] shadow-sm'
                    : topic.id === 'crisis' 
                      ? 'bg-red-50 text-red-700 border-red-100 hover:border-red-300'
                      : 'bg-white text-slate-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                {topic.label}
              </button>
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* RENDER VIEW 1: THE SUGGESTION BOX                            */}
        {/* ============================================================ */}
        {activeTopic === 'suggest' && (
          <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6 animate-fade-in">
            <div>
              <h3 className="text-xl font-bold text-[#163D46] tracking-tight">Suggest a New Topic</h3>
              <p className="text-sm text-[#5F737B] mt-1 leading-relaxed">
                Is there a specific question you couldn't find? Submit it to our team below. We review these daily to write new answers and expand our guide.
              </p>
            </div>

            {!customResponseCard ? (
              <form onSubmit={handleCustomFormSearch} className="flex flex-col gap-4">
                <input 
                  type="text" value={customQuestionText} onChange={(e) => setCustomQuestionText(e.target.value)}
                  placeholder="Type the question you want us to add..." 
                  className="w-full p-4 bg-[#FDF8F8] border border-gray-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-[#C8B4FA] focus:bg-white transition-all"
                />
                <button 
                  type="submit" 
                  disabled={!customQuestionText.trim()} 
                  className="w-full bg-[#E5E7EB] text-[#9CA3AF] enabled:bg-[#163D46] enabled:text-white text-xs font-black py-4 rounded-xl uppercase tracking-wider transition-all cursor-pointer"
                >
                  SUBMIT TOPIC
                </button>
              </form>
            ) : (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-[#F8F5FF] border border-[#E0D4FD] p-5 rounded-2xl flex gap-3">
                  <span className="text-red-500 text-lg leading-none mt-0.5">📌</span>
                  <p className="text-sm font-bold text-[#4B207E] leading-relaxed">
                    {customResponseCard.message}
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <span className="text-[10px] font-black uppercase text-red-500 tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Urgent 24/7 Confidential Helplines:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {MASTER_HELPLINES.map((line, lIdx) => (
                      <div key={lIdx} className="p-5 bg-white border border-gray-100 rounded-2xl flex flex-col justify-between gap-4 shadow-sm">
                        <div className="space-y-1">
                          <h4 className="font-extrabold text-sm text-slate-900">{line.name}</h4>
                          <p className="text-xs text-slate-500 leading-relaxed">{line.desc}</p>
                        </div>
                        <div className="border border-red-200 rounded-xl p-3 text-center transition-colors hover:bg-red-50 cursor-pointer">
                          <span className="text-sm font-bold text-red-600 select-all tracking-wide">{line.contact}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* RENDER VIEW 2: CRISIS SUPPORT HELPLINES                      */}
        {/* ============================================================ */}
        {activeTopic === 'crisis' && (
          <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6 animate-fade-in">
            <div>
              <h3 className="text-2xl font-black text-[#163D46] tracking-tight flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                Emergency Support
              </h3>
              <p className="text-sm text-[#5F737B] mt-2 leading-relaxed">
                If you are in an urgent crisis, please reach out to one of the verified organizations below. These resources are 100% confidential and do not require parental permission.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-2">
              {MASTER_HELPLINES.map((line, lIdx) => (
                <div key={lIdx} className="p-5 sm:p-6 bg-[#FDF8F8] border border-red-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                  <div className="space-y-1.5 flex-1">
                    <h4 className="font-extrabold text-base text-slate-900">{line.name}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">{line.desc}</p>
                  </div>
                  <div className="bg-white border border-red-200 rounded-xl p-4 text-center sm:min-w-[200px]">
                    <span className="text-sm font-black text-red-600 select-all tracking-wider">{line.contact}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* RENDER VIEW 3: STANDARD FAQ ACCORDION                        */}
        {/* ============================================================ */}
        {activeTopic !== 'suggest' && activeTopic !== 'crisis' && (
          <div className="w-full flex flex-col gap-4 mt-2">
            
            <p className="text-sm text-[#5F737B] font-medium px-1">
              Curious? Tap any question to unfold the answer ✨
            </p>

            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => {
                const isExpanded = expandedFaqId === faq.id;
                const faqFeedbackState = feedbackMap[faq.id]; 

                return (
                  <div 
                    key={faq.id} 
                    className={`bg-white border transition-all duration-200 overflow-hidden ${
                      isExpanded ? 'border-[#C8B4FA] shadow-md rounded-3xl' : 'border-gray-200 hover:border-gray-300 shadow-sm rounded-2xl'
                    }`}
                  >
                    <button 
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full text-left px-5 sm:px-6 py-5 flex items-center justify-between cursor-pointer outline-none bg-white"
                    >
                      <span className={`text-[15px] sm:text-base pr-4 leading-snug transition-colors duration-200 ${
                        isExpanded ? 'font-extrabold text-[#163D46]' : 'font-medium text-slate-600'
                      }`}>
                        {faq.question}
                      </span>
                      <span className={`text-[#C8B4FA] font-bold text-lg transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}>
                        ➔
                      </span>
                    </button>

                    {/* EXPANDED ANSWER BODY */}
                    {isExpanded && (
                      <div className="px-5 sm:px-6 pb-6 pt-2 animate-fade-in border-t border-gray-50 flex flex-col">
                        <p className="text-[15px] text-slate-600 leading-relaxed font-medium">
                          {faq.answer}
                        </p>

                        {/* 🚀 THE SMART SERVICE BRIDGE CTA */}
                        {faq.relatedService && (
                          <div className="mt-6 bg-[#F8F5FF] border border-[#E0D4FD] p-5 sm:p-6 rounded-2xl flex flex-col gap-4 transition-all">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                              <div>
                                <span className="text-base font-bold text-[#163D46] block">
                                  Need local support?
                                </span>
                                <p className="text-sm text-slate-500 mt-1">
                                  Jump to our Service Finder to locate confidential care networks near you.
                                </p>
                              </div>
                              
                              {bridgeActiveFaq !== faq.id ? (
                                <button 
                                  onClick={() => setBridgeActiveFaq(faq.id)} 
                                  className="bg-[#163D46] hover:bg-[#112d34] text-white text-xs font-bold py-3.5 px-6 rounded-xl uppercase tracking-wider transition-all text-center shrink-0 w-full sm:w-auto active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                                >
                                  FIND CARE ➔
                                </button>
                              ) : null}
                            </div>

                            {/* PROGRESSIVE DISCLOSURE: Age/State Capture Form */}
                            {bridgeActiveFaq === faq.id && (
                              <div className="pt-4 border-t border-[#E0D4FD] animate-fade-in flex flex-col gap-3">
                                <span className="text-sm font-bold text-[#163D46]">
                                  Tell us your age and state so we can find the safest, most accurate options available to you. This information is never stored or shared:
                                </span>
                                <div className="flex flex-col sm:flex-row gap-3">
                                  <input 
                                    type="number" placeholder="Age" min="12" max="110"
                                    value={bridgeAge} onChange={(e) => setBridgeAge(e.target.value)}
                                    className="w-full sm:w-24 p-3 bg-white border border-[#C8B4FA] rounded-xl text-sm font-bold text-[#163D46] focus:outline-none focus:ring-2 focus:ring-[#C8B4FA]"
                                  />
                                  <select 
                                    value={bridgeState} onChange={(e) => setBridgeState(e.target.value)}
                                    className="w-full sm:flex-1 p-3 bg-white border border-[#C8B4FA] rounded-xl text-sm font-bold text-[#163D46] focus:outline-none focus:ring-2 focus:ring-[#C8B4FA]"
                                  >
                                    <option value="">Select State...</option>
                                    {US_STATES.map(st => <option key={st} value={st}>{st}</option>)}
                                  </select>
                                  
                                  {/* Using a button to trigger GA tracking, then Redirect */}
                                  <button 
                                    onClick={() => handleBridgeRedirect(faq.relatedService)}
                                    className="bg-[#C8B4FA] hover:bg-[#b096f8] text-[#163D46] text-xs font-black py-3 px-6 rounded-xl uppercase tracking-wider transition-all text-center flex items-center justify-center w-full sm:w-auto cursor-pointer"
                                  >
                                    GO ➔
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* INLINE FEEDBACK FLOW */}
                        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-3">
                          {faqFeedbackState === 'completed' ? (
                            <p className="text-sm font-medium text-[#5F737B] animate-fade-in flex items-center gap-2 bg-[#FDF8F8] p-4 rounded-xl border border-gray-100">
                              ✨ Thanks for your feedback! It helps us keep this guide useful.
                            </p>
                          ) : faqFeedbackState === 'yes' || faqFeedbackState === 'no' ? (
                            <div className="flex flex-col gap-3 animate-fade-in bg-white p-1">
                              <span className="text-lg font-bold text-[#163D46]">
                                {faqFeedbackState === 'yes' 
                                  ? "How was this answer helpful?" 
                                  : "How can we make this answer more helpful?"}
                              </span>
                              <textarea
                                value={feedbackText}
                                onChange={(e) => setFeedbackText(e.target.value)}
                                placeholder="Type your thoughts here safely..."
                                className="w-full p-4 bg-[#FDF8F8] border border-gray-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-[#C8B4FA] focus:bg-white transition-all resize-none h-24"
                              />
                              <div className="flex items-center gap-3 mt-1">
                                <button 
                                  onClick={() => handleFinalFeedbackSubmit(faq.id)} 
                                  className="px-8 py-3 bg-[#163D46] hover:bg-[#112d34] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95"
                                >
                                  Submit
                                </button>
                                <button 
                                  onClick={() => handleFinalFeedbackSubmit(faq.id)} 
                                  className="px-4 py-3 text-[#5F737B] hover:text-[#163D46] rounded-xl text-xs font-bold transition-all cursor-pointer"
                                >
                                  Skip
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-4 animate-fade-in">
                              <span className="text-lg font-bold text-[#163D46]">
                                Was this answer helpful?
                              </span>
                              <div className="flex gap-3">
                                <button 
                                  onClick={() => handleInitialFeedback(faq.id, true)} 
                                  className="px-8 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-[#163D46] hover:bg-[#F8F5FF] hover:border-[#C8B4FA] transition-all cursor-pointer active:scale-95 shadow-sm"
                                >
                                  Yes
                                </button>
                                <button 
                                  onClick={() => handleInitialFeedback(faq.id, false)} 
                                  className="px-8 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-[#163D46] hover:bg-[#F8F5FF] hover:border-[#C8B4FA] transition-all cursor-pointer active:scale-95 shadow-sm"
                                >
                                  No
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center bg-white border border-dashed border-gray-300 rounded-2xl">
                <p className="text-base font-bold text-[#163D46]">No matching questions found.</p>
                <p className="text-sm text-slate-500 mt-1">Try adjusting your search to view other topics.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}