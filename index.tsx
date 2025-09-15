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
  LogOut,
  ShieldCheck,
  MessagesSquare,
  BookHeart,
  Compass,
} from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";


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
            renderIcon(document.getElementById('mobile-nav-icon'), Menu);
            renderIcon(document.getElementById('feature-icon-1'), MessageCircleHeart);
            renderIcon(document.getElementById('feature-icon-2'), Library);
            renderIcon(document.getElementById('feature-icon-3'), MicVocal);
            renderIcon(document.getElementById('feature-icon-4'), ShieldCheck);
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
    const launchBtnFinal = document.getElementById('launch-app-btn-final');
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const landingNav = document.querySelector('.landing-nav');

    launchBtn?.addEventListener('click', (e) => navigate(e as MouseEvent, '/UserDashboard'));
    launchBtnNav?.addEventListener('click', (e) => navigate(e as MouseEvent, '/UserDashboard'));
    launchBtnFinal?.addEventListener('click', (e) => navigate(e as MouseEvent, '/UserDashboard'));

    mobileNavToggle?.addEventListener('click', () => {
        landingNav?.classList.toggle('open');
    });

    document.querySelectorAll('#landing-page .landing-nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href) {
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
                if (landingNav?.classList.contains('open')) {
                    landingNav.classList.remove('open');
                }
            }
        });
    });


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

const SYSTEM_INSTRUCTION = `You are a warm, empathetic, and supportive AI assistant from 'Sahay', designed to help students with their mental well-being.
- Your primary role is to offer psychological first-aid, provide a safe space for students to express their feelings, and share basic, evidence-based coping strategies (like mindfulness or cognitive reframing).
- You are NOT a human therapist or a replacement for professional medical advice. You must make this clear if the user seems to believe you are human or asks for a diagnosis.
- Your personality is non-clinical, encouraging, and non-judgmental.
- Do not provide diagnoses or medical advice. Instead, gently guide users to consider help from qualified professionals.
- Keep your responses concise, easy to understand, and structured with paragraphs for readability.
- Start the very first conversation with a gentle and welcoming message.
- Use basic markdown for formatting like **bold** text for emphasis and unordered lists with '*' or '-' for clarity.`;

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
      <p>Building resilience is a personal journey. Key factors include having caring and supportive relationships, the capacity to make realistic plans and carry them out, a positive view of yourself, and skills in communication and problem-solving. Fostering self-compassion, nurturing a positive self-view, and find purpose are also crucial.</p>
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
      <p>Joining clubs or groups based on your interests can provide a structured and lower-pressure way to meet people who share your interests. Remember that many of your peers likely feel the same way. University counseling services are well-equipped to help students with social anxiety through evidence-based therapies like CBT.</p>
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
const mobileSidebarToggleBtn = document.getElementById('mobile-sidebar-toggle-btn') as HTMLButtonElement;
const sidebarOverlay = document.getElementById('sidebar-overlay') as HTMLDivElement;
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


// --- APPLICATION STATE ---
let ai: GoogleGenAI;
let isChatStarted = false;
let chatHistory: ChatHistoryItem[] = [];
let currentChatId: string | null = null;
let isVoiceModeActive = false;

// Live API State
let liveSession: any = null;
let audioContext: AudioContext | null = null;
let scriptProcessor: ScriptProcessorNode | null = null;
let mediaStream: MediaStream | null = null;
let audioQueue: ArrayBuffer[] = [];
let isPlaying = false;


// --- ICON RENDERING ---
function renderIcon(element: HTMLElement | null, IconComponent: React.ElementType, props: {} = {}) {
    if (element) {
        const root = ReactDOM.createRoot(element);
        root.render(React.createElement(IconComponent, props));
    }
}

// --- UTILITY FUNCTIONS ---
function parseMarkdownToHTML(text: string): string {
    // Split into blocks by one or more empty lines
    const blocks = text.split(/\n\s*\n/);

    const htmlBlocks = blocks.map(block => {
        block = block.trim();
        if (!block) return '';

        // Handle lists
        if (block.match(/^(\*|-)\s/)) {
            const listItems = block.split('\n').map(item => {
                let content = item.replace(/^(\*|-)\s/, '').trim();
                // Apply inline formatting
                content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                return `<li>${content}</li>`;
            }).join('');
            return `<ul>${listItems}</ul>`;
        }
        
        // Handle paragraphs
        else {
            // Apply inline formatting
            let content = block.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            // Convert single newlines to <br> for line breaks within a paragraph
            content = content.replace(/\n/g, '<br />');
            return `<p>${content}</p>`;
        }
    });

    return htmlBlocks.join('');
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
    // Extract text content from message elements, preserving markdown structure for AI
    const messages: ChatMessage[] = Array.from(chatMessages.querySelectorAll('.message')).map(el => {
        const isUser = el.classList.contains('user-message');
        // For AI messages, we need to reconstruct the markdown from HTML or store it differently.
        // For simplicity, we'll store the rendered text for now. A more complex app might store raw markdown.
        return {
            text: (el as HTMLElement).innerText || '',
            sender: isUser ? 'user' : 'ai'
        };
    });
    
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
    if (window.innerWidth <= 768) {
        closeMobileSidebar();
    }
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
  } catch(e) {
    console.error(e);
    addMessage('There was an error initializing the AI. Please check the console for details.', 'ai');
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

  if (sender === 'ai') {
      messageElement.innerHTML = parseMarkdownToHTML(text);
  } else {
      // For user messages, just set text content to avoid any XSS risk.
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

  if (!userInput || !ai) return;
  
  startConversation();

  if(checkForCrisis(userInput)) {
    showCrisisModal();
    return;
  }

  addMessage(userInput, 'user');
  chatForm.reset();
  chatInput.focus();
  updateActionButton(); // Revert to voice mode icon

  const aiMessageElement = addMessage('', 'ai', true);
  let fullResponse = '';
  let textSession: any = null;

  // Build conversation history
  const currentMessages = currentChatId ? chatHistory.find(c => c.id === currentChatId)?.messages || [] : [];
  const historyForApi = currentMessages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
  }));
  const turns = [...historyForApi, { role: 'user', parts: [{ text: userInput }] }];
  
  try {
    textSession = await ai.live.connect({
      model: 'gemini-live-2.5-flash-preview',
      config: {
        responseModalities: [Modality.TEXT],
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      callbacks: {
        onopen: () => {
          console.log('Live Text session opened.');
        },
        onmessage: (message: any) => {
          if (message.text) {
            fullResponse += message.text;
            aiMessageElement.innerHTML = parseMarkdownToHTML(fullResponse);
            chatMessages.scrollTop = chatMessages.scrollHeight;
          }
          if (message.serverContent && message.serverContent.turnComplete) {
            aiMessageElement.classList.remove('streaming');
            aiMessageElement.innerHTML = parseMarkdownToHTML(fullResponse);
            saveOrUpdateChat();
            if (textSession) {
                textSession.close();
            }
          }
        },
        onerror: (e: ErrorEvent) => {
          console.error('Live Text API Error:', e.message);
          aiMessageElement.remove();
          addMessage('Sorry, I encountered an error. Please try again.', 'ai');
          if (textSession) textSession.close();
        },
        onclose: () => {
          console.log('Live Text session closed.');
        }
      }
    });

    // Send content AFTER the session is established and the session object is returned.
    textSession.sendClientContent({ turns });

  } catch(error) {
    console.error(error);
    aiMessageElement.remove();
    addMessage('Sorry, I encountered an error. Please try again.', 'ai');
    if (textSession) textSession.close();
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

// --- VOICE INPUT TRANSCRIPTION ---
let isRecording = false;
let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];

function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result.split(',')[1]);
            } else {
                reject(new Error("Failed to convert blob to base64 string."));
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

function resetRecordingState() {
    isRecording = false;
    mediaRecorder = null;
    audioChunks = [];
    if(micBtn) {
        micBtn.classList.remove('recording');
        micBtn.disabled = false;
    }
    if(chatInput) {
        chatInput.placeholder = 'Ask anything';
    }
}

async function startRecording() {
    if (isRecording || !ai) return;

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        isRecording = true;
        micBtn.classList.add('recording');
        chatInput.placeholder = 'Listening...';
        audioChunks = [];

        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
            stream.getTracks().forEach(track => track.stop());

            if (audioChunks.length === 0 || audioChunks[0].size === 0) {
                console.log("No audio recorded.");
                resetRecordingState();
                return;
            }
            
            const audioBlob = new Blob(audioChunks, { type: mediaRecorder.mimeType });

            chatInput.placeholder = 'Transcribing...';
            micBtn.disabled = true;

            try {
                const base64Audio = await blobToBase64(audioBlob);
                const audioPart = {
                    inlineData: {
                        mimeType: mediaRecorder.mimeType,
                        data: base64Audio,
                    },
                };
                const textPart = { text: "Transcribe the following audio." };
                
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: { parts: [audioPart, textPart] },
                });

                chatInput.value = response.text;
                updateActionButton();
            } catch (error) {
                console.error("Transcription failed:", error);
                chatInput.placeholder = "Transcription failed. Try again.";
            } finally {
                resetRecordingState();
            }
        };

        mediaRecorder.start();
    } catch (error) {
        console.error("Microphone access denied or not available:", error);
        chatInput.placeholder = "Microphone access is required.";
        setTimeout(() => { 
            if(chatInput.placeholder === "Microphone access is required."){
                chatInput.placeholder = "Ask anything"; 
            }
        }, 3000);
        resetRecordingState();
    }
}

function stopRecording() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
    }
}

function handleMicClick() {
    if (isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
}

// --- LIVE API VOICE CONVERSATION ---

// --- Audio Processing Helpers ---
function downsampleBuffer(buffer: Float32Array, inputSampleRate: number, outputSampleRate: number): Float32Array {
    if (outputSampleRate === inputSampleRate) {
        return buffer;
    }
    const sampleRateRatio = inputSampleRate / outputSampleRate;
    const newLength = Math.round(buffer.length / sampleRateRatio);
    const result = new Float32Array(newLength);
    let offsetResult = 0;
    let offsetBuffer = 0;
    while (offsetResult < result.length) {
        const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
        let accum = 0, count = 0;
        for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
            accum += buffer[i];
            count++;
        }
        result[offsetResult] = accum / count;
        offsetResult++;
        offsetBuffer = nextOffsetBuffer;
    }
    return result;
}

function floatTo16BitPCM(input: Float32Array): Int16Array {
    const output = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
        const s = Math.max(-1, Math.min(1, input[i]));
        output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return output;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

// --- Audio Playback Logic ---
async function playAudioQueue() {
    if (audioQueue.length === 0) {
        isPlaying = false;
        voiceVisualizer.classList.remove('speaking');
        voiceVisualizer.classList.add('listening');
        voiceTranscript.textContent = 'Listening...';
        return;
    }

    isPlaying = true;
    voiceVisualizer.classList.add('speaking');
    voiceVisualizer.classList.remove('listening');
    voiceTranscript.textContent = 'Speaking...';

    const audioData = audioQueue.shift();
    if (!audioData || !audioContext) return;

    // Use DataView for robust parsing of 16-bit PCM data (little-endian).
    // This prevents distortion issues caused by platform-dependent endianness.
    const view = new DataView(audioData);
    const floatData = new Float32Array(audioData.byteLength / 2);
    for (let i = 0; i < floatData.length; i++) {
        // The 'true' argument specifies little-endian byte order.
        const int16 = view.getInt16(i * 2, true);
        floatData[i] = int16 / 32768.0;
    }

    const audioBuffer = audioContext.createBuffer(1, floatData.length, 24000); // Output is 24kHz
    audioBuffer.copyToChannel(floatData, 0);

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.onended = playAudioQueue;
    source.start();
}


// --- Voice Mode Management ---
async function startLiveVoiceMode() {
    micBtn.disabled = true;
    isVoiceModeActive = true;
    voiceModeScreen.classList.remove('hidden');
    voiceVisualizer.classList.add('listening');
    voiceTranscript.textContent = 'Listening...';

    const TARGET_SAMPLE_RATE = 16000;

    try {
        if (!ai) await initializeChat();

        liveSession = await ai.live.connect({
            model: "gemini-2.5-flash-preview-native-audio-dialog",
            config: {
                responseModalities: [Modality.AUDIO],
                systemInstruction: SYSTEM_INSTRUCTION
            },
            callbacks: {
                onmessage: (message: any) => {
                    if (message.data) {
                        const audioData = base64ToArrayBuffer(message.data);
                        audioQueue.push(audioData);
                        if (!isPlaying) {
                            playAudioQueue();
                        }
                    }
                },
                onerror: (e: ErrorEvent) => {
                    console.error('Live API Error:', e.message);
                    voiceTranscript.textContent = 'Sorry, an error occurred.';
                    stopLiveVoiceMode();
                },
                onclose: () => {
                    console.log('Live API session closed.');
                },
            },
        });

        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        const source = audioContext.createMediaStreamSource(mediaStream);
        const bufferSize = 4096;
        scriptProcessor = audioContext.createScriptProcessor(bufferSize, 1, 1);

        scriptProcessor.onaudioprocess = (e) => {
            if (!isVoiceModeActive || !liveSession) return;

            const inputData = e.inputBuffer.getChannelData(0);
            if(audioContext) {
                const downsampledData = downsampleBuffer(inputData, audioContext.sampleRate, TARGET_SAMPLE_RATE);
                const pcmData = floatTo16BitPCM(downsampledData);
                const base64Audio = arrayBufferToBase64(pcmData.buffer);
    
                liveSession.sendRealtimeInput({
                    audio: { data: base64Audio, mimeType: "audio/pcm;rate=16000" }
                });
            }
        };

        source.connect(scriptProcessor);
        scriptProcessor.connect(audioContext.destination);

    } catch (error) {
        console.error("Failed to start voice mode:", error);
        voiceTranscript.textContent = "Could not start voice mode. Please check permissions.";
        isVoiceModeActive = false;
    }
}

function stopLiveVoiceMode() {
    isVoiceModeActive = false;
    voiceModeScreen.classList.add('hidden');
    voiceVisualizer.classList.remove('listening', 'speaking');
    voiceTranscript.textContent = '';

    if (liveSession) {
        liveSession.close();
        liveSession = null;
    }
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        mediaStream = null;
    }
    if (scriptProcessor) {
        scriptProcessor.disconnect();
        scriptProcessor = null;
    }
    if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
        audioContext = null;
    }
    audioQueue = [];
    isPlaying = false;
    micBtn.disabled = false;
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

// --- MOBILE SIDEBAR ---
const openMobileSidebar = () => {
    document.body.classList.add('sidebar-open');
    sidebarOverlay.classList.remove('hidden');
};

const closeMobileSidebar = () => {
    document.body.classList.remove('sidebar-open');
    sidebarOverlay.classList.add('hidden');
};

// --- INITIALIZATION AND EVENT LISTENERS ---

function initializeApp() {
    // Render all static icons
    renderIcon(document.getElementById('sidebar-toggle-icon'), Menu);
    renderIcon(document.getElementById('mobile-sidebar-toggle-icon'), Menu);
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
    renderIcon(document.getElementById('logout-icon'), LogOut);


    loadHistoryFromStorage();
    renderHistory();
    initializeChat();
    updateActionButton();
    loadTheme();


    chatForm.addEventListener('submit', handleFormSubmit);
    chatInput.addEventListener('input', updateActionButton);
    micBtn.addEventListener('click', handleMicClick);
    actionBtn.addEventListener('click', () => {
        if (chatInput.value.trim().length === 0) {
            startLiveVoiceMode();
        }
    });
    voiceModeCloseBtn.addEventListener('click', stopLiveVoiceMode);
    
    homeBtn.addEventListener('click', () => {
        resetChat();
        if (window.innerWidth <= 768) closeMobileSidebar();
    });
    
    resourcesBtn.addEventListener('click', () => {
        chatContainer.classList.add('hidden');
        settingsPage.classList.add('hidden');
        resourcesPage.classList.remove('hidden');
        if (window.innerWidth <= 768) closeMobileSidebar();
    });

    settingsBtn.addEventListener('click', () => {
        chatContainer.classList.add('hidden');
        resourcesPage.classList.add('hidden');
        settingsPage.classList.remove('hidden');
        if (window.innerWidth <= 768) closeMobileSidebar();
    });
    
    sidebarToggleBtn.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            closeMobileSidebar();
        } else {
            sidebar.classList.add('is-transitioning');
            sidebar.classList.toggle('collapsed');
        }
    });

    mobileSidebarToggleBtn.addEventListener('click', openMobileSidebar);
    sidebarOverlay.addEventListener('click', closeMobileSidebar);
    
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
    
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = '';
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        const currentTheme = localStorage.getItem(THEME_STORAGE_KEY);
        if (currentTheme === 'system') {
            applyTheme('system');
        }
    });
}