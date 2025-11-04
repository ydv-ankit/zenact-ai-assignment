"use client";

import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Sparkles,
	User,
	Paperclip,
	Mic,
	MessageSquare,
	Send,
} from "lucide-react";
import { Welcome } from "@/components/welcome";
import Image from "next/image";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebar } from "./ui/sidebar";

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
	const { state } = useSidebar();

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
				<div className="shrink-0 pt-4 bg-background">
					<div className="max-w-4xl w-11/12 mx-auto border rounded-2xl focus-within:border-blue-500 focus-within:ring-0 transition-colors">
						<div className="relative mb-3 border-b">
							<Input
								ref={inputRef}
								value={input}
								onChange={(e) => setInput(e.target.value)}
								onKeyDown={handleKeyPress}
								placeholder="Ask me anything..."
								disabled={isLoading}
								maxLength={maxCharacters}
								className="w-[97%] pr-24 h-auto min-h-[50px] py-4 text-base border-none ring-0 outline-none outline-0 shadow-none focus-visible:border-none focus:border-none focus-visible:ring-0 focus:ring-0"
							/>
							<div className="absolute right-3 bottom-3 flex items-center gap-2">
								<span
									className={`text-xs ${
										characterCount > maxCharacters * 0.9
											? "text-destructive"
											: "text-muted-foreground"
									}`}>
									{characterCount}/{maxCharacters}
								</span>
								<Button
									onClick={handleSendMessage}
									disabled={!input.trim() || isLoading}
									size="icon-sm"
									className="h-8 w-8 cursor-pointer"
									variant="ghost">
									<Send className="h-4 w-4" />
								</Button>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex gap-2 mb-2 mx-2">
							<Button
								variant="ghost"
								size="sm"
								className="gap-2 cursor-pointer">
								<Paperclip className="h-4 w-4" />
								{!isMobile && "Attach"}
							</Button>
							<Button
								variant="ghost"
								size="sm"
								className="gap-2 cursor-pointer">
								<Mic className="h-4 w-4" />
								{!isMobile && "Voice Message"}
							</Button>
							<Button
								variant="ghost"
								size="sm"
								className="gap-2 cursor-pointer">
								<MessageSquare className="h-4 w-4" />
								{!isMobile && "Browse Prompts"}
							</Button>
						</div>
					</div>
					{/* Disclaimer */}
					<p className="hidden md:block text-xs text-muted-foreground text-center mt-2">
						Script may generate inaccurate information about people, places, or
						facts. Model: Script AI v1.3
					</p>
				</div>
			</div>
		</div>
	);
}
