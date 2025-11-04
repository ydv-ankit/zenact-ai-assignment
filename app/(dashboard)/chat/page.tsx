"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatContent } from "@/components/chat-content";

interface Message {
	role: "user" | "assistant";
	content: string;
}

export default function ChatPage() {
	const { user, loading } = useUser();
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();
	const [chatId, setChatId] = useState<string>("new");

	const fetchChatHistory = async (chatId: string) => {
		if (!chatId || chatId === "new") {
			setMessages([]);
			setInput("");
			setIsLoading(false);
			return;
		}

		try {
			const response = await fetch(`/api/chat?chat_id=${chatId}`);
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
		const currentChatId = searchParams.get("chat_id") || "new";
		const currentPromptText = searchParams.get("prompt");
		setChatId(currentChatId);
		fetchChatHistory(currentChatId);
		setInput(currentPromptText || "");
	}, [searchParams]);

	const handleSendMessage = async () => {
		if (!input.trim() || isLoading) return;

		const currentChatId = chatId === "new" ? crypto.randomUUID() : chatId;

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

				if (chatId === "new" && data.chat_id) {
					router.replace(`/chat?chat_id=${data.chat_id}`);
				}
			} else {
				setMessages((prev) => prev.slice(0, -2));
				const errorMessage = data.error || "Failed to send message";
				toast.error(errorMessage);
				console.error("Error sending message:", data.error);
			}
		} catch (error) {
			setMessages((prev) => prev.slice(0, -2));
			toast.error("Error sending message! Please try again.");
			console.error("Error sending message:", error);
		} finally {
			setIsLoading(false);
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

	if (loading) {
		return (
			<div className="flex flex-1 overflow-hidden py-4 border-t border-l rounded-tl-3xl">
				<div className="flex flex-col flex-1 min-h-0 overflow-hidden">
					<div className="flex-1 overflow-y-auto px-4 py-4 min-h-0 max-h-[calc(100vh-250px)]">
						<div className="max-w-4xl w-11/12 mx-auto space-y-4 py-4">
							{/* Loading skeleton for welcome/chat area */}
							<div className="flex flex-col items-center justify-center w-full h-full space-y-6">
								<Skeleton className="h-12 w-64" />
								<Skeleton className="h-4 w-96" />
								<div className="grid grid-cols-2 gap-4 mt-8 w-full max-w-2xl">
									<Skeleton className="h-32 w-full" />
									<Skeleton className="h-32 w-full" />
									<Skeleton className="h-32 w-full" />
									<Skeleton className="h-32 w-full" />
								</div>
							</div>
						</div>
					</div>
					{/* Loading skeleton for input area */}
					<div className="shrink-0 pt-4 bg-background">
						<div className="max-w-4xl w-11/12 mx-auto rounded-2xl">
							<Skeleton className="h-[50px] w-full mb-3" />
							<div className="flex gap-2 mb-2 mx-2">
								<Skeleton className="h-8 w-20" />
								<Skeleton className="h-8 w-28" />
								<Skeleton className="h-8 w-32" />
							</div>
						</div>
						{/* Disclaimer skeleton */}
						<Skeleton className="h-4 w-96 mx-auto mt-2" />
					</div>
				</div>
			</div>
		);
	}

	return (
		<ChatContent
			chat_id={chatId}
			messages={messages}
			input={input}
			setInput={setInput}
			isLoading={isLoading}
			handleSendMessage={handleSendMessage}
			handleKeyPress={handleKeyPress}
			user={user}
			characterCount={characterCount}
			maxCharacters={maxCharacters}
		/>
	);
}
