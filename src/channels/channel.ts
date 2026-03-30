export interface ChannelAudio {
  buffer: Buffer;
  mimetype: string;
  seconds?: number;
}

export interface ChannelImage {
  buffer: Buffer;
  mimetype: string;
}

export interface ChannelMessage {
  channelName: string;
  senderId: string;
  senderName?: string;
  body: string;
  messageId: string;
  timestamp: Date;
  audio?: ChannelAudio;
  image?: ChannelImage;
}

/** A single inline button. */
export interface MessageButton {
  label: string;
  /** The command / text to emit when this button is tapped. */
  callbackData: string;
}

/** Rows of inline buttons (each inner array is one row). */
export type MessageButtons = MessageButton[][];

export type MessageHandler = (message: ChannelMessage) => Promise<void>;

export interface IChannel {
  readonly name: string;
  start(): Promise<void>;
  stop(): Promise<void>;
  sendMessage(recipientId: string, text: string): Promise<void>;
  sendImage(recipientId: string, image: Buffer, caption?: string): Promise<void>;
  sendVideo?(recipientId: string, video: Buffer, caption?: string): Promise<void>;
  sendFile?(recipientId: string, file: Buffer, filename: string, caption?: string): Promise<void>;
  /** Send a message with inline buttons (optional — channels that don't support it ignore buttons). */
  sendMessageWithButtons?(recipientId: string, text: string, buttons: MessageButtons): Promise<void>;
  sendTyping?(recipientId: string): Promise<void>;
  stopTyping?(recipientId: string): Promise<void>;
  onMessage(handler: MessageHandler): void;
}
