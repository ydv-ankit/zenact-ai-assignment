"use client";

import { useRef, useEffect } from "react";
import { Sparkles, User } from "lucide-react";
import { Welcome } from "@/components/welcome";
import Image from "next/image";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChatInput } from "@/components/chat-input";

interface Message {
	role: "user" | "assistant";
	content: string;
}

interface ChatContentProps {
	chat_id: string;
	messages: Message[];
	input: string;
	setInput: (value: string) => void;
	isLoading: boolean;
	handleSendMessage: () => void;
	handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
	user: SupabaseUser | null;
	characterCount: number;
	maxCharacters: number;
}

export function ChatContent({
	chat_id,
	messages,
	input,
	setInput,
	isLoading,
	handleSendMessage,
	handleKeyPress,
	user,
	characterCount,
	maxCharacters,
}: ChatContentProps) {
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const isMobile = useIsMobile();

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	useEffect(() => {
		if (!isLoading) {
			inputRef.current?.focus();
		}
	}, [isLoading]);

	return (
		<div className="flex flex-1 overflow-hidden py-4 border-t border-l rounded-tl-3xl">
			{/* Chat Content Area */}
			<div className="flex flex-col flex-1 min-h-0 overflow-hidden">
				{/* Scrollable content area */}
				<div
					className={cn(
						"flex-1 overflow-y-auto px-4 py-4",
						isMobile ? "max-h-[calc(100vh-100px)]" : "max-h-[calc(100vh-250px)]"
					)}>
					{chat_id === "new" && messages.length === 0 && <Welcome />}
					{messages.length > 0 && (
						<div className="max-w-4xl w-11/12 mx-auto space-y-4 py-4">
							{messages.map((message, index) => (
								<div
									key={index}
									className={`flex gap-3 ${
										message.role === "user" ? "justify-end" : "justify-start"
									}`}>
									{message.role === "assistant" && (
										<div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
											<Sparkles className="h-4 w-4 text-primary" />
										</div>
									)}
									<div
										className={`max-w-[80%] rounded-lg px-4 py-3 ${
											message.role === "user"
												? "bg-primary text-primary-foreground"
												: "bg-muted"
										}`}>
										{message.content ? (
											<p className="text-sm whitespace-pre-wrap">
												{message.content}
											</p>
										) : (
											<div className="flex items-center gap-2">
												<div className="flex gap-1">
													<div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.3s]"></div>
													<div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.15s]"></div>
													<div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce"></div>
												</div>
												<span className="text-sm text-muted-foreground">
													Thinking...
												</span>
											</div>
										)}
									</div>
									{message.role === "user" && (
										<div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
											{user?.user_metadata?.avatar_url ? (
												<Image
													src={user?.user_metadata?.avatar_url}
													alt="User"
													width={25}
													height={25}
													className="object-contain dark:invert rounded-full"
												/>
											) : (
												<User className="h-4 w-4 text-primary" />
											)}
										</div>
									)}
								</div>
							))}
							<div ref={messagesEndRef} />
						</div>
					)}
					{chat_id !== "new" && messages.length === 0 && (
						<div className="flex flex-col items-center justify-center h-full p-8">
							<h1 className="text-3xl font-bold mb-4">AI Chat</h1>
							<p className="text-muted-foreground text-center max-w-md">
								No messages yet. Start a conversation!
							</p>
						</div>
					)}
				</div>

				{/* Sticky Input Section at bottom */}
				<ChatInput
					ref={inputRef}
					input={input}
					setInput={setInput}
					isLoading={isLoading}
					handleSendMessage={handleSendMessage}
					handleKeyPress={handleKeyPress}
					characterCount={characterCount}
					maxCharacters={maxCharacters}
				/>
			</div>
		</div>
	);
}
