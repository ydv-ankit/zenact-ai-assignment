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

	// Transform chats to include title and description
	const transformedChats = (chats || []).map((chat) => {
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
	const { searchParams } = new URL(request.url);
	const chat_ids = searchParams.get("chat_ids");

	if (!chat_ids) {
		return NextResponse.json(
			{ error: "chat_ids parameter is required" },
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

	// Parse chat_ids (can be comma-separated)
	const chatIdsArray = chat_ids.split(",").map((id) => id.trim());

	const { error } = await supabase
		.from("chats")
		.delete()
		.eq("user_id", user.id)
		.in("chat_id", chatIdsArray);

	if (error) {
		console.error("Error deleting chats:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json({ success: true });
}
