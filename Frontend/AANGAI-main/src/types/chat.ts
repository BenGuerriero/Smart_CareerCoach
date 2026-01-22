export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  streaming?: boolean;
}

export interface JobCard {
  id: string;
  title: string;
  explanation: string;
  matchScore?: number;
}

export interface Artifact {
  id: string;
  filename: string;
  type: string;
  url?: string;
}

export interface UserMessage {
  type: 'user_message';
  content: string;
  session_id: string;
}

export interface AssistantChunk {
  type: 'assistant_message_chunk';
  content: string;
  session_id: string;
}

export interface AssistantComplete {
  type: 'assistant_message_complete';
  session_id: string;
}

export interface ArtifactCreated {
  type: 'artifact_created';
  artifact: Artifact;
  session_id: string;
}

export interface StatusUpdate {
  type: 'status_update';
  status: string;
  session_id: string;
}

export type SAMMessage = AssistantChunk | AssistantComplete | ArtifactCreated | StatusUpdate;
