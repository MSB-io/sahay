# सहाय (Sahay) - AI Mental Health Support Platform

<div align="center">
  <img src="logo-bg-rm.png" alt="Sahay Logo" width="100" height="100">
  <h3>Your Personal Guide to Mental Well-being</h3>
  <p><em>An AI-powered chatbot providing confidential support and resources for student mental well-being</em></p>
</div>

## 🌟 Overview

Sahay (meaning "support" in Hindi) is a comprehensive AI-powered mental health platform designed specifically for students. It offers a safe and supportive space to navigate stress, anxiety, and the pressures of university life through confidential conversations, curated resources, and real-time voice interactions.

## ✨ Features

### 🤖 **AI-Powered Conversations**
- Empathetic AI assistant powered by Google's Gemini 2.5 Flash model
- 24/7 availability for confidential mental health support
- Crisis detection with immediate safety resources
- Psychological first-aid and evidence-based coping strategies

### 🎙️ **Real-time Voice Mode**
- Hands-free voice conversations with speech recognition
- Natural voice interactions with AI assistant
- Interruptible conversations for more dynamic exchanges
- Voice activity detection for seamless communication

### 📚 **Curated Resource Library**
- Comprehensive articles on mental health topics:
  - Understanding Anxiety & Depression
  - Stress Management & Burnout Prevention
  - Mindfulness & Resilience Building
  - Academic Stress & Social Anxiety
  - Sleep Hygiene & Loneliness Support

### 🎨 **Modern User Experience**
- Clean, responsive design with dark/light theme support
- Multi-role login system (Student/Admin dashboards)
- Chat history management with persistent storage
- Collapsible sidebar navigation
- Mobile-optimized interface

### 🔒 **Safety & Privacy**
- Crisis keyword detection with immediate intervention
- Direct links to mental health emergency services
- Local data storage for privacy protection
- Professional disclaimer and guidance to seek help when needed

## 🏗️ Architecture

### **Frontend Stack**
- **React 18.3.1** - Component-based UI library
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **CSS Variables** - Dynamic theming system
- **Web Speech API** - Voice recognition and synthesis

### **AI Integration**
- **Google Gemini AI** - Advanced language model for conversations
- **@google/genai SDK** - Official Google AI client library
- **Streaming responses** - Real-time message generation

### **UI Components**
- **Lucide React** - Beautiful SVG icon library
- **Custom CSS** - Hand-crafted responsive design
- **Inter Font** - Clean, modern typography

## 🚀 Getting Started

### **Prerequisites**
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Google Gemini API Key**

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/MSB-io/sahay.git
   cd sahay
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173`

### **Build for production**
```bash
npm run build
npm run preview
```

## 🗺️ Application Routes

- **`/`** - Landing page with feature showcase
- **`/Login`** - Login type selection (Student/Admin)
- **`/StudentLogin`** - Student authentication page
- **`/AdminLogin`** - Admin authentication page
- **`/UserDashboard`** - Student chat interface and resources
- **`/AdminDashboard`** - Admin panel for system management

## 📱 User Interface

### **Landing Page**
- Hero section with call-to-action
- Feature showcase with icons
- Professional disclaimer
- Responsive navigation

### **Student Dashboard**
- AI chat interface with message history
- Voice mode for hands-free interaction
- Resource library with categorized articles
- Settings panel with theme customization
- Collapsible sidebar with chat history

### **Admin Dashboard**
- System overview and analytics (placeholder)
- User management capabilities (to be implemented)
- Configuration settings (to be implemented)

## 🎯 Key Components

### **Chat System**
- Real-time message streaming
- Message persistence in localStorage
- Chat history with titles and timestamps
- Crisis intervention detection
- Conversation continuity across sessions

### **Voice Features**
- Speech-to-text conversion
- Text-to-speech responses
- Voice activity detection
- Interruption handling
- Visual feedback with animations

### **Resource Management**
- Categorized mental health articles
- Modal-based article viewing
- Mobile-optimized reading experience
- Evidence-based content curation

### **Theme System**
- Light/Dark/System theme options
- CSS custom properties for consistent styling
- Persistent theme preferences
- Smooth transitions between themes

## 🔧 Configuration

### **AI Model Settings**
The AI assistant is configured with specific instructions for mental health support:
- Empathetic and non-judgmental responses
- Clear boundaries about not replacing professional help
- Crisis detection and appropriate interventions
- Evidence-based coping strategy suggestions

### **Crisis Keywords**
The system monitors for crisis-related language and provides immediate resources:
- Suicide ideation keywords
- Self-harm indicators
- Hopelessness expressions
- Emergency contact information

## 🤝 Contributing

We welcome contributions to improve Sahay! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### **Development Guidelines**
- Follow TypeScript best practices
- Maintain responsive design principles
- Test across different browsers and devices
- Ensure accessibility compliance
- Document new features and changes

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## ⚠️ Important Disclaimer

**Sahay is an AI assistant and not a replacement for professional medical advice, diagnosis, or treatment.** Please consult a qualified health professional for any medical concerns. In case of emergency, contact your local emergency services immediately.

### **Emergency Resources**
- **USA**: Call or Text 988 (Suicide & Crisis Lifeline)
- **Crisis Chat**: [988lifeline.org/chat](https://988lifeline.org/chat/)
- **LGBTQ Youth**: [The Trevor Project](https://www.thetrevorproject.org/get-help/)

## 🙏 Acknowledgments

- **Google AI** for providing the Gemini language model
- **Lucide** for the beautiful icon library
- **Mental Health First Aid** guidelines for crisis intervention protocols
- **University counseling services** for evidence-based resource content

## 📞 Support

For technical support or questions about Sahay:
- Open an issue on GitHub
- Contact the development team
- Check the documentation for common questions

---

<div align="center">
  <p><strong>सहाय</strong> - Because everyone deserves support 💙</p>
  <p><em>Building a world where mental health support is accessible to all students</em></p>
</div>
