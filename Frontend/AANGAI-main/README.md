# Aang AI - Career Assistant

A beautiful, modern React frontend for an AI-powered career assistant that connects to a Solace Agent Mesh (SAM) backend.

## Features

- **Real-time Chat Interface**: ChatGPT-style interface with streaming responses
- **WebSocket Connection**: Connects to SAM Gateway at `ws://localhost:8000/ws/chat`
- **Session Management**: Persistent session ID stored in localStorage
- **Resume Upload**: Support for PDF and DOCX file uploads
- **Job Market Results**: Beautiful card display for career recommendations
- **Artifact Panel**: View and manage uploaded documents and generated reports
- **Streaming Support**: Real-time message chunks with "thinking" indicators
- **Beautiful UI**: Inspired by Google's anti-gravity aesthetic with bubble-like curves and smooth animations
- **Dark Mode**: Premium dark theme with cyan and blue gradients
- **Responsive Design**: Works seamlessly on mobile and desktop

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **WebSocket** for real-time communication with SAM

## WebSocket Protocol

### Connecting to SAM

The frontend connects to the SAM Gateway using WebSocket at `ws://localhost:8000/ws/chat`.

### Outgoing Messages (User → SAM)

```json
{
  "type": "user_message",
  "content": "Your message here",
  "session_id": "session_1234567890_abc123"
}
```

### Incoming Messages (SAM → User)

#### Assistant Message Chunk (Streaming)
```json
{
  "type": "assistant_message_chunk",
  "content": "Part of the response...",
  "session_id": "session_1234567890_abc123"
}
```

#### Assistant Message Complete
```json
{
  "type": "assistant_message_complete",
  "session_id": "session_1234567890_abc123"
}
```

#### Artifact Created
```json
{
  "type": "artifact_created",
  "artifact": {
    "id": "artifact_1234567890",
    "filename": "resume.pdf",
    "type": "application/pdf",
    "url": "https://example.com/artifact_1234567890"
  },
  "session_id": "session_1234567890_abc123"
}
```

#### Status Update
```json
{
  "type": "status_update",
  "status": "Processing your request...",
  "session_id": "session_1234567890_abc123"
}
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- SAM Gateway running on `ws://localhost:8000/ws/chat`

### Installation

1. Clone the repository
```bash
cd project
```

2. Install dependencies
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── ChatMessage.tsx     # Individual chat message bubble
│   ├── ChatInput.tsx       # Message input with send button
│   ├── Header.tsx          # App header with connection status
│   ├── ResumeUpload.tsx    # Resume file upload component
│   ├── JobCard.tsx         # Job opportunity cards
│   └── ArtifactPanel.tsx   # Sidebar for viewing artifacts
├── hooks/
│   └── useWebSocket.ts     # WebSocket connection hook
├── types/
│   └── chat.ts             # TypeScript type definitions
├── App.tsx              # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles and animations
```

## Key Components

### WebSocket Hook (`useWebSocket.ts`)
- Manages WebSocket connection lifecycle
- Auto-reconnects on disconnect
- Handles session ID persistence
- Provides message sending and receiving callbacks

### Chat Interface
- Real-time streaming message display
- User messages on the right (orange/pink gradient)
- AI responses on the left (cyan/blue gradient)
- Smooth fade-in animations
- Auto-scroll to latest message

### Resume Upload
- Accepts PDF and DOCX files
- Visual upload feedback
- Integration with SAM backend for processing

### Job Cards
- Beautiful card-based display
- Match score indicators
- Hover animations
- Grid layout

### Artifact Panel
- Slide-in sidebar
- List of uploaded/generated documents
- Download functionality
- Badge count indicator

## Features Explained

### Session Management
Session IDs are automatically generated and stored in localStorage. This allows users to resume conversations even after refreshing the page.

### Streaming Responses
The app handles streaming responses from SAM by:
1. Accumulating chunks as they arrive
2. Displaying them in real-time
3. Showing a "thinking" indicator
4. Marking messages as complete when done

### Error Handling
- Connection status indicator in header
- Automatic reconnection on disconnect
- Graceful handling of upload failures

## Customization

### Colors
The app uses cyan and blue as primary colors. To change:
- Edit gradient classes in components (from-cyan-400, to-blue-500, etc.)
- Update shadow colors (shadow-cyan-500/30, etc.)

### Animations
All animations are defined in `src/index.css`:
- `fade-in`: Fade in with slide up
- `float`: Floating animation for logo
- `blink`: Blinking cursor effect
- `slide-in-right`: Slide in from right (for artifact panel)

## Integration with SAM

This frontend is a **thin client**. All intelligence, routing, and agent orchestration happens in the SAM backend via the Orchestrator Agent. The frontend simply:
- Sends user messages to SAM
- Receives and displays responses
- Handles file uploads
- Shows job recommendations and artifacts

## Troubleshooting

### WebSocket Connection Issues
- Ensure SAM Gateway is running on `ws://localhost:8000/ws/chat`
- Check browser console for connection errors
- Verify firewall settings allow WebSocket connections

### Resume Upload Not Working
- Check file type (must be PDF or DOCX)
- Ensure file size is reasonable
- Verify SAM backend is configured to receive uploads

## License

MIT
