import type { NextRequest } from "next/server";
import { updateSession } from "./utils/supabase/middleware";

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
	return await updateSession(request);
}

export const config = {
	matcher: ["/", "/chat/:path*"],
};
