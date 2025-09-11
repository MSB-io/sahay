/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  Menu,
  Home,
  BookOpen,
  Trash2,
  User,
  Mic,
  ArrowUp,
  AudioLines,
  X,
  Square,
  Settings,
  MessageCircleHeart,
  Library,
  MicVocal,
  Sun,
  Moon,
  MonitorSmartphone,
} from 'lucide-react';
import { GoogleGenAI, Chat } from "@google/genai";


// --- ROUTING ---
const landingPage = document.getElementById('landing-page');
const appRoot = document.getElementById('app-root');

function handleRouting() {
    const hash = window.location.hash;

    if (hash === '#/UserDashboard') {
        landingPage?.classList.add('hidden');
        appRoot?.classList.remove('hidden');
        if (appRoot && !appRoot.dataset.initialized) {
            initializeApp();
            appRoot.dataset.initialized = 'true';
        }
    } else { // Handles empty hash, '#/', or anything else as the landing page
        landingPage?.classList.remove('hidden');
        appRoot?.classList.add('hidden');
        // Render landing page icons if not already done
        if (landingPage && !landingPage.dataset.initialized) {
            renderIcon(document.getElementById('feature-icon-1'), MessageCircleHeart);
            renderIcon(document.getElementById('feature-icon-2'), Library);
            renderIcon(document.getElementById('feature-icon-3'), MicVocal);
            landingPage.dataset.initialized = 'true';
        }
        // Optional: redirect invalid hashes to the root
        if (hash !== '' && hash !== '#/') {
             window.location.hash = '';
        }
    }
}

function navigate(e: MouseEvent, path: string) {
    e.preventDefault();
    // The path is expected to be like '/UserDashboard'. Setting the hash will automatically add '#'.
    window.location.hash = path;
}

document.addEventListener('DOMContentLoaded', () => {
    const launchBtn = document.getElementById('launch-app-btn');
    const launchBtnNav = document.getElementById('launch-app-btn-nav');
    
    launchBtn?.addEventListener('click', (e) => navigate(e as MouseEvent, '/UserDashboard'));
    launchBtnNav?.addEventListener('click', (e) => navigate(e as MouseEvent, '/UserDashboard'));

    window.addEventListener('hashchange', handleRouting);
    
    // Initial routing check on page load
    handleRouting();
});


// --- TYPES AND CONSTANTS ---
interface ChatMessage {
  text: string;
  sender: 'user' | 'ai';
}

interface ChatHistoryItem {
  id: string;
  title: string;
  messages: ChatMessage[];
}

const HISTORY_STORAGE_KEY = 'sahay-chat-history';
const THEME_STORAGE_KEY = 'sahay-theme';

const CRISIS_KEYWORDS = [
  'kill myself', 'suicide', 'want to die', 'end my life', 
  'self harm', 'self-harm', 'sh', 'cutting', 'i hate my life',
  'hopeless', 'no reason to live'
];

const articleContent: { [key: string]: { title: string; content: string } } = {
  anxiety: {
    title: 'Understanding Anxiety',
    content: `
      <p>Anxiety is a natural human response to stress, a feeling of fear or apprehension about what’s to come. The start of a new semester, a big exam, or a presentation can cause most people to feel fearful and uncertain. However, when these feelings become excessive, all-consuming, and interfere with daily living, it may be a sign of an anxiety disorder.</p>
      <p>Common symptoms include persistent worrying, restlessness, difficulty concentrating, muscle tension, and sleep problems. It's important to recognize that these feelings are manageable. Strategies such as mindfulness, deep-breathing exercises, and regular physical activity can significantly reduce symptoms. Cognitive Behavioral Therapy (CBT) is also a highly effective treatment that helps individuals identify and change negative thought patterns.</p>
      <p>Remember, acknowledging your anxiety is the first step toward managing it. It's a sign of strength, not weakness, to seek support.</p>
    `,
  },
  depression: {
    title: 'Coping with Depression',
    content: `
      <p>Depression, also known as major depressive disorder, is a common and serious medical illness that negatively affects how you feel, the way you think, and how you act. Fortunately, it is also treatable. Depression causes feelings of sadness and/or a loss of interest in activities you once enjoyed. It can lead to a variety of emotional and physical problems and can decrease your ability to function at work and at home.</p>
      <p>Symptoms can range from mild to severe and may include feeling sad or having a depressed mood, loss of interest or pleasure in activities, changes in appetite, trouble sleeping or sleeping too much, loss of energy, and thoughts of death or suicide. It’s crucial to understand that depression is not something you can simply "snap out of."</p>
      <p>Effective coping strategies include maintaining a routine, setting small, achievable goals, exercising regularly, eating a balanced diet, and staying connected with supportive friends and family. Professional help, including therapy and medication, is often essential for recovery. Reaching out is a critical step.</p>
    `,
  },
  burnout: {
    title: 'What is Burnout?',
    content: `
      <p>Burnout is a state of emotional, physical, and mental exhaustion caused by excessive and prolonged stress. It occurs when you feel overwhelmed, emotionally drained, and unable to meet constant demands. As the stress continues, you begin to lose the interest and motivation that led you to take on a certain role in the a first place.</p>
      <p>Burnout reduces productivity and saps your energy, leaving you feeling increasingly helpless, hopeless, cynical, and resentful. Eventually, you may feel like you have nothing more to give. The negative effects of burnout spill over into every area of life—including your home, work, and social life.</p>
      <p>To combat burnout, it's vital to prioritize self-care. This includes setting boundaries, taking regular breaks, practicing mindfulness, getting enough sleep, and disconnecting from work. Learning to say "no" and delegating tasks can also help. Recognizing the signs early is key to preventing burnout from taking hold.</p>
    `,
  },
  mindfulness: {
    title: 'Mindfulness for Beginners',
    content: `
      <p>Mindfulness is the basic human ability to be a fully present, aware of where we are and what we’re doing, and not overly reactive or overwhelmed by what’s going on around us. It is a practice of paying attention to the present moment with an attitude of non-judgment and acceptance.</p>
      <p>You can practice mindfulness anywhere. A simple starting point is to focus on your breath. Sit in a quiet place, close your eyes, and pay attention to the sensation of your breath entering and leaving your body. When your mind wanders, gently guide it back to your breath. This isn't about stopping your thoughts, but rather observing them without getting carried away.</p>
      <p>Regular mindfulness practice can help reduce stress, improve focus, and increase your overall sense of well-being. Even a few minutes a day can make a difference. It's a skill that strengthens with practice, just like a muscle.</p>
    `,
  },
  resilience: {
    title: 'Building Resilience',
    content: `
      <p>Resilience is the process of adapting well in the face of adversity, trauma, tragedy, threats, or significant sources of stress—such as family and relationship problems, serious health problems, or workplace and financial stressors. It means "bouncing back" from difficult experiences.</p>
      <p>Building resilience is a personal journey. Key factors include having caring and supportive relationships, the capacity to make realistic plans and carry them out, a positive view of yourself, and skills in communication and problem-solving. Fostering self-compassion, nurturing a positive self-view, and finding purpose are also crucial.</p>
      <p>Think of resilience not as a trait that people either have or do not have, but as a set of behaviors, thoughts, and actions that can be learned and developed in anyone. Every challenge you overcome helps build your resilience for the future.</p>
    `,
  },
  sleep: {
    title: 'Better Sleep Hygiene',
    content: `
      <p>Sleep hygiene refers to healthy habits that are conducive to sleeping well on a regular basis. Good sleep is fundamental to mental and physical health, helping to regulate mood, improve concentration, and strengthen the immune system. Poor sleep can contribute to issues like anxiety and depression.</p>
      <p>To improve your sleep hygiene, try to maintain a consistent sleep schedule, even on weekends. Create a relaxing bedtime routine, such as reading a book, taking a warm bath, or listening to calming music. Ensure your bedroom is dark, quiet, and cool. Avoid large meals, caffeine, and alcohol before bedtime. Limit exposure to screens (phones, tablets, computers) an hour before you go to sleep, as the blue light can interfere with melatonin production.</p>
      <p>If you consistently have trouble sleeping, it may be helpful to speak with a healthcare professional to rule out any underlying sleep disorders.</p>
    `,
  },
  academicStress: {
    title: 'Navigating Academic Stress',
    content: `
      <p>Academic stress is a significant challenge for many students, stemming from the pressure to perform well, demanding coursework, and looming deadlines. While a certain amount of stress can be motivating, excessive stress can be detrimental to both academic performance and overall well-being.</p>
      <p>Effective management strategies include time management techniques like the Pomodoro Technique (working in focused 25-minute intervals), breaking large tasks into smaller, manageable steps, and creating a balanced schedule that includes time for rest and leisure. It's also important to maintain a healthy lifestyle through proper nutrition, regular exercise, and adequate sleep.</p>
      <p>Don't hesitate to utilize university resources, such as academic advisors, counseling services, and peer support groups. Talking about your stress with others can make it feel less overwhelming. Remember that your well-being is more important than any single grade or assignment.</p>
    `,
  },
  socialAnxiety: {
    title: 'Social Anxiety at University',
    content: `
      <p>Social anxiety at university is common, as students navigate a new environment with new social expectations. It involves an intense fear of being judged, negatively evaluated, or rejected in a social or performance situation. This can make it difficult to make friends, participate in class, or engage in campus activities.</p>
      <p>To manage social anxiety, start small. Challenge negative thoughts by questioning their validity. Instead of avoiding social situations, try to gradually expose yourself to them in a way that feels manageable. For example, start by asking a question in a large lecture hall, then progress to speaking in a smaller tutorial. Practice social skills with trusted friends.</p>
      <p>Joining clubs or groups based on your interests can provide a structured and lower-pressure way to meet like-minded people. Remember that many of your peers likely feel the same way. University counseling services are well-equipped to help students with social anxiety through evidence-based therapies like CBT.</p>
    `,
  },
  loneliness: {
    title: 'Combating Loneliness',
    content: `
      <p>Loneliness is a distressing feeling that arises from a discrepancy between one's desired and actual social relationships. It's a common experience for university students, especially those who have moved away from home. It's important to remember that feeling lonely does not mean you are alone in this experience.</p>
      <p>To combat loneliness, focus on the quality of connections, not just the quantity. Make an effort to engage in small talk with classmates or people in your residence hall. Joining clubs, sports teams, or volunteer groups can be an excellent way to meet people who share your interests. Don't be afraid to take the initiative to invite someone for coffee or a study session.</p>
      <p>It's also important to be comfortable with your own company. Cultivating hobbies and interests that you can enjoy alone can make solitude feel less like loneliness. If feelings of loneliness persist and are impacting your mental health, reaching out to a counselor can provide support and strategies for building connections.</p>
    `,
  }
};


// --- DOM ELEMENTS ---
const chatForm = document.getElementById('chat-form') as HTMLFormElement;
const chatInput = document.getElementById('chat-input') as HTMLInputElement;
const chatMessages = document.getElementById('chat-messages') as HTMLDivElement;
const crisisModal = document.getElementById('crisis-modal') as HTMLDivElement;
const crisisModalCloseBtn = document.getElementById('crisis-modal-close-btn') as HTMLButtonElement;
const homeBtn = document.getElementById('home-btn') as HTMLButtonElement;
const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn') as HTMLButtonElement;
const sidebar = document.querySelector('.sidebar') as HTMLElement;
const actionBtn = document.getElementById('action-btn') as HTMLButtonElement;
const micBtn = document.getElementById('mic-btn') as HTMLButtonElement;
const resourcesBtn = document.getElementById('resources-btn') as HTMLButtonElement;
const settingsBtn = document.getElementById('settings-btn') as HTMLButtonElement;
const resourcesPage = document.getElementById('resources-page') as HTMLElement;
const settingsPage = document.getElementById('settings-page') as HTMLElement;
const chatContainer = document.querySelector('.chat-container') as HTMLElement;
const welcomeScreen = document.getElementById('welcome-screen') as HTMLDivElement;
const promptStarterBtns = document.querySelectorAll('.prompt-starter');
const chatHistoryList = document.getElementById('chat-history-list') as HTMLUListElement;
const resourceLinks = document.querySelectorAll('.resource-link');
const articleModal = document.getElementById('article-modal') as HTMLDivElement;
const modalTitle = document.getElementById('modal-title') as HTMLHeadingElement;
const modalBody = document.getElementById('modal-body') as HTMLDivElement;
const modalCloseBtn = document.getElementById('modal-close-btn') as HTMLButtonElement;
const voiceModeScreen = document.getElementById('voice-mode-screen') as HTMLElement;
const voiceModeCloseBtn = document.getElementById('voice-mode-close-btn') as HTMLButtonElement;
const voiceVisualizer = document.getElementById('voice-visualizer') as HTMLDivElement;
const voiceTranscript = document.getElementById('voice-transcript') as HTMLParagraphElement;
const themeButtons = document.querySelectorAll('.theme-btn');
const logoutBtn = document.getElementById('logout-btn') as HTMLButtonElement;


// --- APPLICATION STATE ---
let ai: GoogleGenAI;
let chat: Chat;
let isChatStarted = false;
let chatHistory: ChatHistoryItem[] = [];
let currentChatId: string | null = null;
let recognition: any = null; // Using any to handle vendor prefixes (webkitSpeechRecognition)
let isRecording = false;
let isVoiceModeActive = false;
let shouldInterruptAI = false;
let silenceTimer: number | null = null;
let finalUserTranscript = '';

// --- ICON RENDERING ---
function renderIcon(element: HTMLElement | null, IconComponent: React.ElementType, props: {} = {}) {
    if (element) {
        const root = ReactDOM.createRoot(element);
        root.render(React.createElement(IconComponent, props));
    }
}

// --- CHAT HISTORY MANAGEMENT ---

function loadHistoryFromStorage() {
    const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (storedHistory) {
        chatHistory = JSON.parse(storedHistory);
    }
}

function saveHistoryToStorage() {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(chatHistory));
}

function renderHistory() {
    chatHistoryList.innerHTML = '';
    chatHistory.forEach(item => {
        const li = document.createElement('li');
        li.classList.add('history-item');
        li.dataset.id = item.id;
        if (item.id === currentChatId) {
            li.classList.add('active');
        }

        const link = document.createElement('a');
        link.textContent = item.title;
        link.addEventListener('click', () => loadChat(item.id));

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.setAttribute('aria-label', 'Delete chat');

        const iconContainer = document.createElement('span');
        iconContainer.className = 'icon-container';
        deleteBtn.appendChild(iconContainer);
        renderIcon(iconContainer, Trash2);
        
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteChat(item.id);
        });

        li.appendChild(link);
        li.appendChild(deleteBtn);
        chatHistoryList.appendChild(li);
    });
}

function saveOrUpdateChat() {
    const messages: ChatMessage[] = Array.from(chatMessages.querySelectorAll('.message')).map(el => ({
        text: el.textContent || '',
        sender: el.classList.contains('user-message') ? 'user' : 'ai'
    }));
    
    if (messages.length === 0) return;

    if (currentChatId) {
        // Update existing chat
        const existingChat = chatHistory.find(c => c.id === currentChatId);
        if (existingChat) {
            existingChat.messages = messages;
        }
    } else {
        // Create new chat
        const firstUserMessage = messages.find(m => m.sender === 'user');
        const title = firstUserMessage ? firstUserMessage.text.substring(0, 30) + '...' : 'New Chat';
        
        const newChat: ChatHistoryItem = {
            id: Date.now().toString(),
            title,
            messages
        };

        chatHistory.unshift(newChat); // Add to the beginning
        currentChatId = newChat.id;
    }

    saveHistoryToStorage();
    renderHistory();
}


function loadChat(id: string) {
    const chatToLoad = chatHistory.find(c => c.id === id);
    if (!chatToLoad) return;

    currentChatId = id;

    chatContainer.classList.remove('hidden');
    resourcesPage.classList.add('hidden');
    settingsPage.classList.add('hidden');
    welcomeScreen.classList.add('hidden');
    chatMessages.classList.remove('hidden');
    chatMessages.innerHTML = '';
    
    chatToLoad.messages.forEach(msg => addMessage(msg.text, msg.sender));
    
    isChatStarted = true;
    renderHistory(); // To update active state
    initializeChat(); // Prepare for continuation
}

function deleteChat(id: string) {
    chatHistory = chatHistory.filter(c => c.id !== id);
    saveHistoryToStorage();
    
    if (id === currentChatId) {
        resetChat();
    } else {
        renderHistory();
    }
}


// --- CORE CHAT LOGIC ---

async function initializeChat() {
  try {
    ai = new GoogleGenAI({apiKey: process.env.API_KEY});
    chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `You are a warm, empathetic, and supportive AI assistant from 'Sahay', designed to help students with their mental well-being.
- Your primary role is to offer psychological first-aid, provide a safe space for students to express their feelings, and share basic, evidence-based coping strategies (like mindfulness or cognitive reframing).
- You are NOT a human therapist or a replacement for professional medical advice. You must make this clear if the user seems to believe you are human or asks for a diagnosis.
- Your personality is non-clinical, encouraging, and non-judgmental.
- Do not provide diagnoses or medical advice. Instead, gently guide users to consider help from qualified professionals.
- Keep your responses concise, easy to understand, and structured with paragraphs for readability.
- Start the very first conversation with a gentle and welcoming message.`,
      },
    });
  } catch(e) {
    console.error(e);
    addMessage('There was an error initializing the chat. Please check the console for details.', 'ai');
  }
}

function startConversation() {
    if (!isChatStarted) {
        welcomeScreen.classList.add('hidden');
        chatMessages.classList.remove('hidden');
        isChatStarted = true;
    }
}


function addMessage(text: string, sender: 'user' | 'ai', isStreaming = false) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', `${sender}-message`);

  // Basic markdown for paragraphs.
  const paragraphs = text.split('\n').filter(p => p.trim() !== '');
  if (paragraphs.length > 1) {
    paragraphs.forEach(pText => {
      const p = document.createElement('p');
      p.textContent = pText;
      messageElement.appendChild(p);
    });
  } else {
    messageElement.textContent = text;
  }
  
  if (isStreaming) {
      messageElement.classList.add('streaming');
  }

  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return messageElement;
}

function showCrisisModal() {
    crisisModal.classList.remove('hidden');
}

function hideCrisisModal() {
    crisisModal.classList.add('hidden');
}

function checkForCrisis(text: string): boolean {
    const lowerCaseText = text.toLowerCase();
    return CRISIS_KEYWORDS.some(keyword => lowerCaseText.includes(keyword));
}

async function handleFormSubmit(e: Event) {
  e.preventDefault();
  const userInput = chatInput.value.trim();

  if (!userInput || !chat) return;
  
  startConversation();

  if(checkForCrisis(userInput)) {
    showCrisisModal();
    return;
  }

  addMessage(userInput, 'user');
  chatForm.reset();
  chatInput.focus();
  updateActionButton(); // Revert to voice mode icon

  const loadingIndicator = addMessage('Sahay is thinking...', 'ai', false);
  loadingIndicator.classList.add('loading-indicator');
  
  try {
    const stream = await chat.sendMessageStream({ message: userInput });
    
    loadingIndicator.remove();
    const aiMessageElement = addMessage('', 'ai', true);
    let fullResponse = '';

    for await (const chunk of stream) {
        fullResponse += chunk.text;
        aiMessageElement.textContent = fullResponse;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    aiMessageElement.classList.remove('streaming');
    saveOrUpdateChat();

  } catch(error) {
    console.error(error);
    loadingIndicator.remove();
    addMessage('Sorry, I encountered an error. Please try again.', 'ai');
  }
}


function updateActionButton() {
    const hasText = chatInput.value.trim().length > 0;
    const iconContainer = document.getElementById('action-btn-icon');

    if (hasText) {
        actionBtn.type = 'submit';
        actionBtn.setAttribute('aria-label', 'Send message');
        renderIcon(iconContainer, ArrowUp);
    } else {
        actionBtn.type = 'button';
        actionBtn.setAttribute('aria-label', 'Voice mode');
        renderIcon(iconContainer, AudioLines);
    }
}

function resetChat() {
    resourcesPage.classList.add('hidden');
    settingsPage.classList.add('hidden');
    chatContainer.classList.remove('hidden');
    welcomeScreen.classList.remove('hidden');
    chatMessages.classList.add('hidden');
    chatMessages.innerHTML = '';
    isChatStarted = false;
    currentChatId = null;
    renderHistory();
    initializeChat();
}

// --- SPEECH RECOGNITION & SYNTHESIS ---
function initializeSpeechRecognition() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
        console.warn('Speech Recognition API is not supported in this browser.');
        micBtn.style.display = 'none';
        return;
    }
    
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;

    recognition.onstart = () => {
        if (isVoiceModeActive) {
            voiceVisualizer.classList.add('listening');
            voiceVisualizer.classList.remove('speaking');
        } else {
            isRecording = true;
            renderIcon(document.getElementById('mic-btn-icon'), Square, { color: '#ef4444' });
            micBtn.setAttribute('aria-label', 'Stop recording');
            chatInput.placeholder = 'Listening...';
        }
    };
    
    recognition.onend = () => {
        if (isVoiceModeActive) {
             voiceVisualizer.classList.remove('listening');
        } else {
            isRecording = false;
            renderIcon(document.getElementById('mic-btn-icon'), Mic);
            micBtn.setAttribute('aria-label', 'Use microphone');
            chatInput.placeholder = 'Ask anything';
        }
    };
    
    recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        if (isVoiceModeActive) {
             voiceVisualizer.classList.remove('listening');
        } else {
            isRecording = false;
            renderIcon(document.getElementById('mic-btn-icon'), Mic);
            micBtn.setAttribute('aria-label', 'Use microphone');
            chatInput.placeholder = 'Ask anything';
        }
    };
    
    recognition.onresult = (event: any) => {
        // --- INTERRUPTIBILITY LOGIC ---
        // If the AI is speaking and we get a new result, it's an interruption.
        if (isVoiceModeActive && window.speechSynthesis.speaking) {
            shouldInterruptAI = true;
            window.speechSynthesis.cancel(); // Stop AI speech immediately
            finalUserTranscript = ''; // Reset transcript for the new user turn
        }

        if (silenceTimer) clearTimeout(silenceTimer);

        let interimTranscript = '';
        let currentFinalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                currentFinalTranscript += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }
        
        if (isVoiceModeActive) {
            if (currentFinalTranscript.trim()) {
                 finalUserTranscript += currentFinalTranscript;
            }
            // VAD: Set a timer. If it's not cleared by a new result, the user has stopped talking.
            silenceTimer = window.setTimeout(() => {
                 const transcriptToSend = finalUserTranscript.trim();
                 if (transcriptToSend) {
                     finalUserTranscript = ''; // Reset for next turn
                     sendVoiceTranscriptToAI(transcriptToSend);
                 }
            }, 1200); // 1.2 seconds of silence
        } else {
            // For text input mode
            chatInput.value = currentFinalTranscript + interimTranscript;
            updateActionButton();
        }
    };
}


function toggleRecording() {
    if (!recognition) return;
    
    if (isRecording) {
        recognition.stop();
    } else {
        try {
            recognition.continuous = false;
            recognition.start();
        } catch (e) {
            console.error("Could not start recognition:", e);
        }
    }
}

// --- REAL-TIME VOICE CONVERSATION ---

function startVoiceMode() {
    isVoiceModeActive = true;
    voiceModeScreen.classList.remove('hidden');
    finalUserTranscript = '';

    const initialGreeting = new SpeechSynthesisUtterance('Hello! How can I help?');
    initialGreeting.onend = () => {
        if (isVoiceModeActive) {
            try {
                recognition.continuous = true;
                recognition.start();
            } catch (e) {
                 console.error("Could not start voice mode recognition:", e);
                 stopVoiceMode();
            }
        }
    };
    window.speechSynthesis.speak(initialGreeting);
}

function stopVoiceMode() {
    isVoiceModeActive = false;
    voiceModeScreen.classList.add('hidden');
    if (recognition) {
        recognition.stop();
    }
    if (silenceTimer) {
        clearTimeout(silenceTimer);
    }
    window.speechSynthesis.cancel();
    finalUserTranscript = '';
}

async function sendVoiceTranscriptToAI(userInput: string) {
    if (!chat || !isVoiceModeActive) return;
    
    voiceVisualizer.classList.remove('listening');
    voiceVisualizer.classList.add('speaking');
    addMessage(userInput, 'user'); // Add user message to main chat history
    
    try {
        shouldInterruptAI = false;
        const stream = await chat.sendMessageStream({ message: userInput });
        
        let fullResponse = '';
        let sentenceQueue = '';

        for await (const chunk of stream) {
            if (shouldInterruptAI) break;
            
            fullResponse += chunk.text;
            sentenceQueue += chunk.text;

            // Speak sentence by sentence
            const sentenceEnd = sentenceQueue.search(/[.!?]/);
            if (sentenceEnd !== -1) {
                const sentence = sentenceQueue.substring(0, sentenceEnd + 1);
                sentenceQueue = sentenceQueue.substring(sentenceEnd + 1);
                
                const utterance = new SpeechSynthesisUtterance(sentence);
                window.speechSynthesis.speak(utterance);
            }
        }
        
        // Speak any remaining text in the queue
        if (sentenceQueue.trim() && !shouldInterruptAI) {
            const utterance = new SpeechSynthesisUtterance(sentenceQueue);
            window.speechSynthesis.speak(utterance);
        }
        
        addMessage(fullResponse, 'ai'); // Add AI response to main chat history
        saveOrUpdateChat();

        // When AI finishes speaking, transition UI back to listening.
        // The microphone is already running continuously.
        const checkSpeech = setInterval(() => {
            if (!window.speechSynthesis.speaking && isVoiceModeActive && !shouldInterruptAI) {
                clearInterval(checkSpeech);
                voiceVisualizer.classList.remove('speaking');
                voiceVisualizer.classList.add('listening');
            } else if (!isVoiceModeActive || shouldInterruptAI) {
                clearInterval(checkSpeech);
            }
        }, 100);

    } catch(error) {
        console.error(error);
        
        // Re-enable listening after an error
        const checkSpeech = setInterval(() => {
            if (!window.speechSynthesis.speaking && isVoiceModeActive) {
                clearInterval(checkSpeech);
                voiceVisualizer.classList.remove('speaking');
                voiceVisualizer.classList.add('listening');
            }
        }, 100);
    }
}


// --- MODAL LOGIC ---
function openArticleModal(title: string, content: string) {
    modalTitle.textContent = title;
    modalBody.innerHTML = content;
    articleModal.classList.remove('hidden');
    document.body.classList.add('modal-open');
}

function closeArticleModal() {
    articleModal.classList.add('hidden');
    document.body.classList.remove('modal-open');
}

// --- SETTINGS LOGIC ---
function applyTheme(theme: string) {
    document.body.classList.remove('dark-theme');
    
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.body.classList.add('dark-theme');
    }
    
    themeButtons.forEach(button => {
        if (button.getAttribute('data-theme') === theme) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    localStorage.setItem(THEME_STORAGE_KEY, theme);
}

function loadTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'light';
    applyTheme(savedTheme);
}

// --- INITIALIZATION AND EVENT LISTENERS ---

function initializeApp() {
    // Render all static icons
    renderIcon(document.getElementById('sidebar-toggle-icon'), Menu);
    renderIcon(document.getElementById('home-icon'), Home);
    renderIcon(document.getElementById('resources-icon'), BookOpen);
    renderIcon(document.getElementById('settings-icon'), Settings);
    renderIcon(document.getElementById('profile-icon-header'), User, { size: 20 });
    renderIcon(document.getElementById('mic-btn-icon'), Mic);
    renderIcon(document.getElementById('modal-close-icon'), X);
    renderIcon(document.getElementById('crisis-modal-close-icon'), X);
    renderIcon(document.getElementById('voice-mode-close-icon'), X);
    renderIcon(document.getElementById('theme-icon-light'), Sun);
    renderIcon(document.getElementById('theme-icon-dark'), Moon);
    renderIcon(document.getElementById('theme-icon-system'), MonitorSmartphone);

    loadHistoryFromStorage();
    renderHistory();
    initializeChat();
    initializeSpeechRecognition();
    updateActionButton();
    loadTheme();


    chatForm.addEventListener('submit', handleFormSubmit);
    chatInput.addEventListener('input', updateActionButton);
    micBtn.addEventListener('click', toggleRecording);
    actionBtn.addEventListener('click', () => {
        if (chatInput.value.trim().length === 0) {
            startVoiceMode();
        }
    });
    voiceModeCloseBtn.addEventListener('click', stopVoiceMode);
    
    homeBtn.addEventListener('click', resetChat);
    
    resourcesBtn.addEventListener('click', () => {
        chatContainer.classList.add('hidden');
        settingsPage.classList.add('hidden');
        resourcesPage.classList.remove('hidden');
    });

    settingsBtn.addEventListener('click', () => {
        chatContainer.classList.add('hidden');
        resourcesPage.classList.add('hidden');
        settingsPage.classList.remove('hidden');
    });
    
    sidebarToggleBtn.addEventListener('click', () => {
        sidebar.classList.add('is-transitioning');
        sidebar.classList.toggle('collapsed');
    });
    
    sidebar.addEventListener('transitionend', (e) => {
        if (e.propertyName === 'width') {
            sidebar.classList.remove('is-transitioning');
        }
    });
    
    promptStarterBtns.forEach(button => {
        button.addEventListener('click', () => {
            const promptText = button.textContent;
            if (promptText) {
                chatInput.value = promptText;
                updateActionButton(); // Update button to show send icon
                const submitEvent = new SubmitEvent('submit', { bubbles: true, cancelable: true });
                chatForm.dispatchEvent(submitEvent);
            }
        });
    });
    
    resourceLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const articleId = (e.currentTarget as HTMLElement).dataset.article;
            if (articleId && articleContent[articleId]) {
                const article = articleContent[articleId];
                openArticleModal(article.title, article.content);
            }
        });
    });
    
    modalCloseBtn.addEventListener('click', closeArticleModal);
    articleModal.addEventListener('click', (e) => {
        if (e.target === articleModal) {
            closeArticleModal();
        }
    });
    
    crisisModalCloseBtn.addEventListener('click', hideCrisisModal);
    crisisModal.addEventListener('click', (e) => {
        if(e.target === crisisModal) {
            hideCrisisModal();
        }
    });

    // Settings Listeners
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.getAttribute('data-theme');
            if(theme) applyTheme(theme);
        });
    });

    logoutBtn.addEventListener('click', () => {
        window.location.hash = '';
    });
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        const currentTheme = localStorage.getItem(THEME_STORAGE_KEY);
        if (currentTheme === 'system') {
            applyTheme('system');
        }
    });
}