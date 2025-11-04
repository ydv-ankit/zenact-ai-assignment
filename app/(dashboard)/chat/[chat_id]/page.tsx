"use client";

import { useState, use, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChatHeader } from "@/components/chat-header";
import { ChatHistorySidebar } from "@/components/chat-history-sidebar";
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
import { useUser } from "@/hooks/use-user";
import Image from "next/image";
import toast from "react-hot-toast";

interface Message {
	role: "user" | "assistant";
	content: string;
}

interface ChatPageProps {
	params:
		| Promise<{
				chat_id: string;
		  }>
		| {
				chat_id: string;
		  };
}

export default function ChatPage({ params }: ChatPageProps) {
	const [selectedProjectId, setSelectedProjectId] = useState<
		string | undefined
	>();
	const { user } = useUser();
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const router = useRouter();

	const { chat_id } = use(
		params instanceof Promise ? params : Promise.resolve(params)
	);

	const handleProjectSelect = (projectId: string) => {
		setSelectedProjectId(projectId);
	};

	const fetchChatHistory = async () => {
		if (!chat_id || chat_id === "new") return;

		try {
			const response = await fetch(`/api/chat?chat_id=${chat_id}`);
			const data = await response.json();
			if (data.messages) {
				setMessages(data.messages);
			} else if (data.error) {
				toast.error(`Failed to load chat history`);
			}
		} catch (error) {
			console.error("Error fetching chat history:", error);
			toast.error("Failed to load chat history. Please try again.");
		}
	};

	useEffect(() => {
		fetchChatHistory();
	}, [chat_id]);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handleSendMessage = async () => {
		if (!input.trim() || isLoading) return;

		const currentChatId = chat_id === "new" ? crypto.randomUUID() : chat_id;

		const userMessage: Message = {
			role: "user",
			content: input.trim(),
		};

		const thinkingMessage: Message = {
			role: "assistant",
			content: "",
		};
		setMessages((prev) => [...prev, userMessage, thinkingMessage]);
		setInput("");
		setIsLoading(true);

		try {
			const response = await fetch("/api/chat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					chat_id: currentChatId,
					prompt: input.trim(),
				}),
			});

			const data = await response.json();

			if (response.ok && data.chat) {
				setMessages(data.chat.messages || []);

				if (chat_id === "new" && data.chat_id) {
					router.replace(`/chat/${data.chat_id}`);
					toast.success("Chat created successfully");
				}
			} else {
				setMessages((prev) => prev.slice(0, -2));
				const errorMessage = data.error || "Failed to send message";
				toast.error(errorMessage);
				console.error("Error sending message:", data.error);
			}
		} catch (error) {
			setMessages((prev) => prev.slice(0, -2));
			toast.error("Network error. Please check your connection and try again.");
			console.error("Error sending message:", error);
		} finally {
			setIsLoading(false);
			inputRef.current?.focus();
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	const characterCount = input.length;
	const maxCharacters = 3000;

	return (
		<div className="flex flex-col h-full overflow-hidden">
			<ChatHeader title="AI Chat" />
			<div className="flex flex-1 min-h-0">
				<div className="flex flex-1 overflow-hidden py-4 border-t border-l rounded-tl-3xl">
					{/* Chat Content Area */}
					<div className="flex flex-col flex-1 min-h-0 overflow-hidden">
						{/* Scrollable content area */}
						<div className="flex-1 overflow-y-auto px-4 py-4 min-h-0 max-h-[calc(100vh-250px)]">
							{chat_id === "new" && messages.length === 0 && <Welcome />}
							{messages.length > 0 && (
								<div className="max-w-4xl w-11/12 mx-auto space-y-4 py-4">
									{messages.map((message, index) => (
										<div
											key={index}
											className={`flex gap-3 ${
												message.role === "user"
													? "justify-end"
													: "justify-start"
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
								<div className="flex gap-2 mb-2">
									<Button
										variant="ghost"
										size="sm"
										className="gap-2 cursor-pointer">
										<Paperclip className="h-4 w-4" />
										Attach
									</Button>
									<Button
										variant="ghost"
										size="sm"
										className="gap-2 cursor-pointer">
										<Mic className="h-4 w-4" />
										Voice Message
									</Button>
									<Button
										variant="ghost"
										size="sm"
										className="gap-2 cursor-pointer">
										<MessageSquare className="h-4 w-4" />
										Browse Prompts
									</Button>
								</div>
							</div>
							{/* Disclaimer */}
							<p className="hidden md:block text-xs text-muted-foreground text-center mt-2">
								Script may generate inaccurate information about people, places,
								or facts. Model: Script AI v1.3
							</p>
						</div>
					</div>
				</div>
				{/* Right Sidebar for Chat History - Inside main content area */}
				<ChatHistorySidebar
					selectedProjectId={selectedProjectId}
					onProjectSelect={handleProjectSelect}
				/>
			</div>
		</div>
	);
}
