// FAQ Chatbot for Forge Forward
const faqData = [
    {
        keywords: ['program', 'programs', 'training', 'course', 'learn'],
        answer: 'We offer a three-phase program: Phase 1 covers Foundation Skills (HTML, CSS, JavaScript), Phase 2 focuses on Career Readiness (portfolio, resume, interviews), and Phase 3 provides Mentorship & Placement support. <a href="programs.html">Learn more about our programs</a>.'
    },
    {
        keywords: ['eligible', 'eligibility', 'qualify', 'who can', 'requirements'],
        answer: 'Our programs are designed specifically for veterans transitioning to civilian careers in technology. If you\'re a veteran interested in digital skills training, you\'re eligible! <a href="contact.html">Contact us</a> to get started.'
    },
    {
        keywords: ['cost', 'price', 'fee', 'free', 'pay'],
        answer: 'Our programs are provided at no cost to veterans thanks to generous donations and grants. We believe financial barriers shouldn\'t prevent veterans from accessing quality tech training.'
    },
    {
        keywords: ['long', 'duration', 'time', 'how long'],
        answer: 'The complete three-phase program typically takes 6-12 months, depending on your pace and schedule. Each phase is self-paced with mentor support to accommodate your needs.'
    },
    {
        keywords: ['mentor', 'mentorship', 'coach', 'support'],
        answer: 'Yes! Phase 3 includes one-on-one mentorship with experienced tech professionals. Mentors provide career guidance, interview prep, and ongoing support. <a href="mentor.html">Learn about becoming a mentor</a>.'
    },
    {
        keywords: ['donate', 'donation', 'contribute', 'give'],
        answer: 'Thank you for your interest in supporting our mission! Your donations help provide free training to veterans. <a href="donate.html">Visit our donation page</a> to learn about the impact of your contribution.'
    },
    {
        keywords: ['job', 'employment', 'placement', 'hire', 'career'],
        answer: 'Phase 3 focuses on job placement with employer connections, referrals, and ongoing career support. We help you build a professional network and connect with companies actively hiring.'
    },
    {
        keywords: ['start', 'begin', 'enroll', 'sign up', 'register'],
        answer: 'Ready to start your journey? <a href="contact.html">Fill out our contact form</a> and we\'ll reach out within 48 hours to discuss your goals and get you enrolled.'
    },
    {
        keywords: ['online', 'remote', 'virtual', 'location'],
        answer: 'Our programs are fully online and remote-friendly, allowing you to learn from anywhere. All you need is a computer and internet connection.'
    },
    {
        keywords: ['experience', 'beginner', 'background', 'prerequisite'],
        answer: 'No prior tech experience required! Our Phase 1 starts with the fundamentals and builds from there. We welcome complete beginners.'
    },
    {
        keywords: ['certificate', 'credential', 'certification', 'degree'],
        answer: 'While we don\'t offer formal degrees, we provide certificates of completion for each phase of our program. These certificates, along with your portfolio, help demonstrate your skills to employers.'
    },
    {
        keywords: ['gi bill', 'va benefit', 'benefit', 'chapter 33', 'post 9/11'],
        answer: 'Our program is provided free of charge, so you don\'t need to use GI Bill benefits to participate. We encourage veterans to explore all available VA education benefits at <a href="https://www.va.gov/education/" target="_blank" rel="noopener">va.gov/education</a>.'
    },
    {
        keywords: ['disability', 'disabled', 'service-connected', 'accommodation', 'accessible'],
        answer: 'Forge Forward welcomes veterans of all abilities. Our online, self-paced format is designed to be flexible and accommodating. If you have specific accessibility needs, please <a href="contact.html">contact us</a> and we\'ll work with you.'
    },
    {
        keywords: ['spouse', 'spouses', 'family', 'dependent', 'military family'],
        answer: 'Our current programs are focused on U.S. military veterans. We may expand to serve military spouses in the future — <a href="contact.html">contact us</a> to be added to our updates list.'
    },
    {
        keywords: ['thank you', 'appreciate', 'thanks'],
        answer: 'You\'re very welcome! Thank you for chatting with Forge Buddy. Is there anything else I can help you with?'
    }
];

class Chatbot {
    constructor() {
        this.isOpen = false;
        this.hasGreeted = sessionStorage.getItem('chatbotGreeted') === 'true';
        this.init();
    }

    init() {
        this.createChatbotHTML();
        this.attachEventListeners();
        this.loadChatHistory();
        if (!this.hasGreeted) {
            this.addWelcomeMessage();
            this.triggerAttentionPulse();
        }
    }

    createChatbotHTML() {
        const chatbotHTML = `
            <div id="chatbot-container">
                <button id="chatbot-toggle" aria-label="Toggle FAQ chatbot">
                    <img id="chat-icon" src="assets/img/favicon.png" alt="Chat">
                    <span id="close-icon" class="hidden">✕</span>
                </button>
                <div id="chatbot-window" class="hidden">
                    <div id="chatbot-header">
                        <h3><img src="assets/img/favicon.png" alt="Chat" class="header-icon">Forge Buddy</h3>
                        <button id="chatbot-close" aria-label="Close chatbot">✕</button>
                    </div>
                    <div id="chatbot-messages"></div>
                    <div id="chatbot-input-area">
                        <input type="text" id="chatbot-input" placeholder="Ask a question..." aria-label="Chat input">
                        <button id="chatbot-send" aria-label="Send message">Send</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    attachEventListeners() {
        document.getElementById('chatbot-toggle').addEventListener('click', () => this.toggleChat());
        document.getElementById('chatbot-close').addEventListener('click', () => this.toggleChat());
        document.getElementById('chatbot-send').addEventListener('click', () => this.sendMessage());
        document.getElementById('chatbot-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const chatWindow = document.getElementById('chatbot-window');
        const chatIcon = document.getElementById('chat-icon');
        const closeIcon = document.getElementById('close-icon');

        if (this.isOpen) {
            chatWindow.classList.remove('hidden');
            chatIcon.classList.add('hidden');
            closeIcon.classList.remove('hidden');
            document.getElementById('chatbot-input').focus();
        } else {
            chatWindow.classList.add('hidden');
            chatIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        }
    }

    addWelcomeMessage() {
        this.addMessage('bot', 'Hi! I\'m Forge Buddy. Ask me about our programs, eligibility, mentorship, GI Bill, or how to get started!');
    }

    addMessage(sender, text) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${sender}-message`;
        if (sender === 'user') {
            messageDiv.textContent = text;
        } else {
            messageDiv.innerHTML = text;
        }
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        this.saveChatHistory();
    }

    saveChatHistory() {
        const messagesContainer = document.getElementById('chatbot-messages');
        sessionStorage.setItem('chatHistory', messagesContainer.innerHTML);
    }

    loadChatHistory() {
        const savedHistory = sessionStorage.getItem('chatHistory');
        if (savedHistory) {
            const messagesContainer = document.getElementById('chatbot-messages');
            messagesContainer.innerHTML = savedHistory;
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    sendMessage() {
        const input = document.getElementById('chatbot-input');
        const message = input.value.trim();

        if (!message) return;

        this.addMessage('user', message);
        input.value = '';

        setTimeout(() => {
            const response = this.getResponse(message);
            this.addMessage('bot', response);
        }, 500);
    }

    getResponse(message) {
        const lowerMessage = message.toLowerCase();

        for (const faq of faqData) {
            if (faq.keywords.some(keyword => lowerMessage.includes(keyword))) {
                return faq.answer;
            }
        }

        return 'I\'m not sure about that. You can <a href="contact.html">contact us directly</a> for more specific questions, or try asking about our programs, eligibility, mentorship, or donations.';
    }

    triggerAttentionPulse() {
        setTimeout(() => {
            const toggle = document.getElementById('chatbot-toggle');
            if (toggle && !this.isOpen) {
                toggle.classList.add('chatbot-attention');
                sessionStorage.setItem('chatbotGreeted', 'true');
                this.hasGreeted = true;
                setTimeout(() => toggle.classList.remove('chatbot-attention'), 2000);
            }
        }, 3000);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new Chatbot());
} else {
    new Chatbot();
}
