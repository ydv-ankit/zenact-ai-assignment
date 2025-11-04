import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const supabase = await createSupabaseServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { data: chats, error } = await supabase
		.from("chats")
		.select("chat_id, messages, created_at")
		.eq("user_id", user.id)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching chats:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	const validChats = (chats || []).filter(
		(chat) =>
			chat.messages && Array.isArray(chat.messages) && chat.messages.length > 0
	);

	// Transform chats to include title and description
	const transformedChats = validChats.map((chat) => {
		const messages = chat.messages || [];
		const firstUserMessage = messages.find(
			(msg: { role: string }) => msg.role === "user"
		);
		const firstAssistantMessage = messages.find(
			(msg: { role: string }) => msg.role === "assistant"
		);

		// Generate title from first user message (truncated)
		const title = firstUserMessage?.content
			? firstUserMessage.content.length > 50
				? firstUserMessage.content.substring(0, 50) + "..."
				: firstUserMessage.content
			: "New Project";

		// Generate description from first assistant message or first user message
		const description = firstAssistantMessage?.content
			? firstAssistantMessage.content.length > 100
				? firstAssistantMessage.content.substring(0, 100) + "..."
				: firstAssistantMessage.content
			: firstUserMessage?.content
			? firstUserMessage.content.length > 100
				? firstUserMessage.content.substring(0, 100) + "..."
				: firstUserMessage.content
			: "...";

		return {
			id: chat.chat_id,
			title,
			description,
			created_at: chat.created_at,
		};
	});

	return NextResponse.json({ chats: transformedChats });
}

export async function DELETE(request: NextRequest) {
	try {
		const body = await request.json();
		const { chatIds } = body;

		if (!chatIds || !Array.isArray(chatIds) || chatIds.length === 0) {
			return NextResponse.json(
				{ error: "chatIds array is required" },
				{ status: 400 }
			);
		}

		const supabase = await createSupabaseServerClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const chatIdsArray = chatIds
			.map((id: string) => id.trim())
			.filter((id: string) => id.length > 0);

		if (chatIdsArray.length === 0) {
			return NextResponse.json(
				{ error: "No valid chat IDs provided" },
				{ status: 400 }
			);
		}

		// First, verify these chats exist and belong to the user
		const { data: existingChats, error: fetchError } = await supabase
			.from("chats")
			.select("chat_id")
			.eq("user_id", user.id)
			.in("chat_id", chatIdsArray);

		if (fetchError) {
			console.error("Error fetching chats to delete:", fetchError);
			return NextResponse.json({ error: fetchError.message }, { status: 500 });
		}

		if (!existingChats || existingChats.length === 0) {
			return NextResponse.json(
				{ error: "No chats found to delete", deletedCount: 0 },
				{ status: 404 }
			);
		}

		// Now delete the chats
		const { data: deletedChats, error: deleteError } = await supabase
			.from("chats")
			.delete()
			.eq("user_id", user.id)
			.in("chat_id", chatIdsArray)
			.select("chat_id");

		if (deleteError) {
			console.error("Error deleting chats:", deleteError);
			return NextResponse.json({ error: deleteError.message }, { status: 500 });
		}

		const deletedCount = deletedChats?.length || 0;

		return NextResponse.json({
			success: true,
			deletedCount,
			deletedChatIds: deletedChats?.map((chat) => chat.chat_id) || [],
		});
	} catch (error) {
		console.error("Error in DELETE handler:", error);
		return NextResponse.json(
			{
				error:
					error instanceof Error
						? error.message
						: "Failed to parse request body",
			},
			{ status: 400 }
		);
	}
}
