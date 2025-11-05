"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatContent } from "@/components/chat-content";
import { useChat, useSendMessage } from "@/hooks/use-chat-queries";

export default function ChatPage() {
	const { user, loading } = useUser();
	const router = useRouter();
	const searchParams = useSearchParams();
	const [chatId, setChatId] = useState<string>("new");
	const [input, setInput] = useState("");

	const { data: chatData, isLoading: isLoadingChat } = useChat(chatId);
	const sendMessageMutation = useSendMessage();

	const messages = chatData?.messages || [];
	const isLoading = sendMessageMutation.isPending || isLoadingChat;

	useEffect(() => {
		const currentChatId = searchParams.get("chat_id") || "new";
		const currentPromptText = searchParams.get("prompt");
		setChatId(currentChatId);
		setInput(input + (currentPromptText || ""));
	}, [searchParams]);

	const handleSendMessage = async () => {
		if (!input.trim() || isLoading) return;

		const currentChatId = chatId === "new" ? crypto.randomUUID() : chatId;
		const promptText = input.trim();

		setInput("");

		try {
			const data = await sendMessageMutation.mutateAsync({
				chatId: currentChatId,
				prompt: promptText,
			});

			if (data.chat_id && (chatId === "new" || data.chat_id !== chatId)) {
				router.replace(`/chat?chat_id=${data.chat_id}`);
			}
		} catch (error) {
			console.error(error);
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

	if (loading && chatId !== "new") {
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
