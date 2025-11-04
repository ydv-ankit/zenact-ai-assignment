import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { createSupabaseClient } from "@/utils/supabase/client";

export function useUser() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);
	const supabase = createSupabaseClient();

	useEffect(() => {
		let mounted = true;

		const getUser = async () => {
			try {
				setLoading(true);
				const {
					data: { user },
					error: userError,
				} = await supabase.auth.getUser();

				if (userError) throw userError;

				if (mounted) {
					setUser(user);
					setError(null);
				}
			} catch (err) {
				if (mounted) {
					setError(
						err instanceof Error ? err : new Error("Failed to get user")
					);
					setUser(null);
				}
			} finally {
				if (mounted) {
					setLoading(false);
				}
			}
		};

		getUser();

		// Listen for auth state changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			if (mounted) {
				setUser(session?.user ?? null);
				setLoading(false);
			}
		});

		return () => {
			mounted = false;
			subscription.unsubscribe();
		};
	}, [supabase]);

	return { user, loading, error };
}
