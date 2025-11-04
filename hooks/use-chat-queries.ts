import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export interface Message {
	role: "user" | "assistant";
	content: string;
}

export interface Chat {
	chat_id: string;
	messages: Message[];
	created_at?: string;
}

export interface ChatHistoryItem {
	id: string;
	title: string;
	description: string;
	created_at?: string;
}

export const chatKeys = {
	all: ["chats"] as const,
	history: () => [...chatKeys.all, "history"] as const,
	detail: (chatId: string) => [...chatKeys.all, "detail", chatId] as const,
};

export function useChatHistory() {
	return useQuery<ChatHistoryItem[]>({
		queryKey: chatKeys.history(),
		queryFn: async () => {
			const response = await fetch("/api/history");
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to load chat history");
			}

			return data.chats || [];
		},
	});
}

export function useChat(chatId: string | null) {
	return useQuery<Chat>({
		queryKey: chatKeys.detail(chatId || ""),
		queryFn: async () => {
			if (!chatId || chatId === "new") {
				return { chat_id: "new", messages: [] };
			}

			const response = await fetch(`/api/chat?chat_id=${chatId}`);
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to load chat");
			}

			return {
				chat_id: data.chat_id || chatId,
				messages: data.messages || [],
			};
		},
		enabled: !!chatId && chatId !== "new",
		initialData:
			chatId === "new" || !chatId
				? { chat_id: "new", messages: [] }
				: undefined,
	});
}

export function useSendMessage() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			chatId,
			prompt,
		}: {
			chatId: string;
			prompt: string;
		}) => {
			const response = await fetch("/api/chat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					chat_id: chatId,
					prompt: prompt,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to send message");
			}

			return data;
		},
		onSuccess: (data, variables) => {
			const finalChatId = data.chat_id || variables.chatId;
			queryClient.invalidateQueries({
				queryKey: chatKeys.detail(finalChatId),
			});

			if (variables.chatId === "new" || data.chat_id !== variables.chatId) {
				queryClient.invalidateQueries({
					queryKey: chatKeys.history(),
				});
			}
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to send message");
		},
	});
}

export function useDeleteChats() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (chatIds: string[]) => {
			const response = await fetch("/api/history", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ chatIds }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to delete chats");
			}

			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: chatKeys.history(),
			});
			toast.success("Chats deleted successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to delete chats");
		},
	});
}
