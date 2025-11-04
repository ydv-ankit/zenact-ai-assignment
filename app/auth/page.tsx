"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSupabaseClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/use-user";
import { useForm } from "@tanstack/react-form";

type AuthMode = "signin" | "register";

type SignInFormData = {
	email: string;
	password: string;
};

type RegisterFormData = {
	name: string;
	email: string;
	password: string;
	profile: File | null;
};

export default function Auth() {
	const supabase = createSupabaseClient();
	const router = useRouter();
	const { user } = useUser();
	const [mode, setMode] = useState<AuthMode>("signin");
	const [error, setError] = useState<string | null>(null);
	console.log("user", user);

	useEffect(() => {
		if (user) {
			router.push("/chat");
		}
	}, [user, router]);

	// Sign In Form
	const signInForm = useForm({
		defaultValues: {
			email: "",
			password: "",
		} as SignInFormData,
		onSubmit: async ({ value }) => {
			setError(null);

			const { error } = await supabase.auth.signInWithPassword({
				email: value.email,
				password: value.password,
			});

			if (error) {
				setError(error.message);
			} else {
				router.push("/chat");
			}
		},
	});

	const registerForm = useForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
			profile: null,
		} as RegisterFormData,
		onSubmit: async ({ value }) => {
			setError(null);

			let profilePictureUrl: string | null = null;

			if (value.profile) {
				try {
					const fileExt = value.profile.name.split(".").pop();
					const fileName = `${Date.now()}-${Math.random()
						.toString(36)
						.substring(7)}.${fileExt}`;
					const filePath = `data/avatars/${fileName}`;

					const { error: uploadError } = await supabase.storage
						.from("avatars")
						.upload(filePath, value.profile, {
							cacheControl: "3600",
							upsert: false,
						});

					if (uploadError) {
						setError(
							`Failed to upload profile picture: ${uploadError.message}`
						);
						return;
					}
				} catch (err) {
					setError(
						`Failed to upload profile picture: ${
							err instanceof Error ? err.message : "Unknown error"
						}`
					);
					return;
				}
			}

			const { data, error } = await supabase.auth.signUp({
				email: value.email,
				password: value.password,
				options: {
					data: {
						name: value.name,
						avatar_url: profilePictureUrl,
					},
				},
			});

			if (error) {
				setError(error.message);
			} else if (data.user) {
				router.push("/chat");
			}
		},
	});

	const signInWithGoogle = async () => {
		setError(null);

		const { error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: `${window.location.origin}`,
			},
		});

		if (error) {
			setError(error.message);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-background p-4">
			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					<h1 className="text-3xl font-bold">Welcome</h1>
					<p className="text-muted-foreground mt-2">
						{mode === "signin"
							? "Sign in to your account"
							: "Create a new account"}
					</p>
				</div>

				<div className="bg-card border rounded-lg p-6 shadow-lg space-y-6">
					{/* Toggle between Sign In and Register */}
					<div className="flex gap-2 border-b pb-4">
						<button
							type="button"
							onClick={() => {
								setMode("signin");
								setError(null);
							}}
							className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
								mode === "signin"
									? "bg-primary text-primary-foreground"
									: "text-muted-foreground hover:text-foreground"
							}`}>
							Sign In
						</button>
						<button
							type="button"
							onClick={() => {
								setMode("register");
								setError(null);
							}}
							className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
								mode === "register"
									? "bg-primary text-primary-foreground"
									: "text-muted-foreground hover:text-foreground"
							}`}>
							Register
						</button>
					</div>

					{/* Error Message */}
					{error && (
						<div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
							{error}
						</div>
					)}

					{/* Sign In Form */}
					{mode === "signin" && (
						<signInForm.Field name="email">
							{(field) => (
								<form
									onSubmit={(e) => {
										e.preventDefault();
										signInForm.handleSubmit();
									}}
									className="space-y-4">
									<div className="space-y-2">
										<label
											htmlFor="signin-email"
											className="text-sm font-medium">
											Email
										</label>
										<Input
											id="signin-email"
											type="email"
											placeholder="you@example.com"
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											onBlur={field.handleBlur}
											required
											disabled={signInForm.state.isSubmitting}
										/>
										{field.state.meta.errors.length > 0 && (
											<p className="text-sm text-destructive">
												{field.state.meta.errors[0]}
											</p>
										)}
									</div>

									<signInForm.Field name="password">
										{(field) => (
											<div className="space-y-2">
												<label
													htmlFor="signin-password"
													className="text-sm font-medium">
													Password
												</label>
												<Input
													id="signin-password"
													type="password"
													placeholder="••••••••"
													value={field.state.value}
													onChange={(e) => field.handleChange(e.target.value)}
													onBlur={field.handleBlur}
													required
													disabled={signInForm.state.isSubmitting}
												/>
												{field.state.meta.errors.length > 0 && (
													<p className="text-sm text-destructive">
														{field.state.meta.errors[0]}
													</p>
												)}
											</div>
										)}
									</signInForm.Field>

									<Button
										type="submit"
										className="w-full"
										disabled={signInForm.state.isSubmitting}>
										{signInForm.state.isSubmitting
											? "Signing in..."
											: "Sign In"}
									</Button>
								</form>
							)}
						</signInForm.Field>
					)}

					{/* Register Form */}
					{mode === "register" && (
						<registerForm.Field name="name">
							{(nameField) => (
								<form
									onSubmit={(e) => {
										e.preventDefault();
										registerForm.handleSubmit();
									}}
									className="space-y-4">
									<div className="space-y-2">
										<label
											htmlFor="register-name"
											className="text-sm font-medium">
											Name
										</label>
										<Input
											id="register-name"
											type="text"
											placeholder="John Doe"
											value={nameField.state.value}
											onChange={(e) => nameField.handleChange(e.target.value)}
											onBlur={nameField.handleBlur}
											required
											disabled={registerForm.state.isSubmitting}
										/>
										{nameField.state.meta.errors.length > 0 && (
											<p className="text-sm text-destructive">
												{nameField.state.meta.errors[0]}
											</p>
										)}
									</div>

									<registerForm.Field name="email">
										{(emailField) => (
											<div className="space-y-2">
												<label
													htmlFor="register-email"
													className="text-sm font-medium">
													Email
												</label>
												<Input
													id="register-email"
													type="email"
													placeholder="you@example.com"
													value={emailField.state.value}
													onChange={(e) =>
														emailField.handleChange(e.target.value)
													}
													onBlur={emailField.handleBlur}
													required
													disabled={registerForm.state.isSubmitting}
												/>
												{emailField.state.meta.errors.length > 0 && (
													<p className="text-sm text-destructive">
														{emailField.state.meta.errors[0]}
													</p>
												)}
											</div>
										)}
									</registerForm.Field>

									<registerForm.Field name="password">
										{(passwordField) => (
											<div className="space-y-2">
												<label
													htmlFor="register-password"
													className="text-sm font-medium">
													Password
												</label>
												<Input
													id="register-password"
													type="password"
													placeholder="••••••••"
													value={passwordField.state.value}
													onChange={(e) =>
														passwordField.handleChange(e.target.value)
													}
													onBlur={passwordField.handleBlur}
													required
													disabled={registerForm.state.isSubmitting}
													minLength={6}
												/>
												{passwordField.state.meta.errors.length > 0 && (
													<p className="text-sm text-destructive">
														{passwordField.state.meta.errors[0]}
													</p>
												)}
											</div>
										)}
									</registerForm.Field>

									<registerForm.Field name="profile">
										{(profileField) => (
											<div className="space-y-2">
												<label
													htmlFor="register-profile"
													className="text-sm font-medium">
													Profile Picture
												</label>
												<div className="flex items-center gap-4">
													<input
														id="register-profile"
														type="file"
														accept="image/*"
														onChange={(e) => {
															const file = e.target.files?.[0] || null;
															profileField.handleChange(file);
														}}
														onBlur={profileField.handleBlur}
														disabled={registerForm.state.isSubmitting}
														className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer disabled:file:opacity-50 disabled:file:cursor-not-allowed cursor-pointer"
													/>
													{profileField.state.value && (
														<div className="relative w-16 h-16 shrink-0 rounded-full overflow-hidden border-2 border-input">
															<img
																src={URL.createObjectURL(
																	profileField.state.value
																)}
																alt="Profile preview"
																className="w-full h-full object-cover"
															/>
														</div>
													)}
												</div>
												{profileField.state.meta.errors.length > 0 && (
													<p className="text-sm text-destructive">
														{profileField.state.meta.errors[0]}
													</p>
												)}
											</div>
										)}
									</registerForm.Field>

									<Button
										type="submit"
										className="w-full"
										disabled={registerForm.state.isSubmitting}>
										{registerForm.state.isSubmitting
											? "Creating account..."
											: "Register"}
									</Button>
								</form>
							)}
						</registerForm.Field>
					)}

					{/* Divider */}
					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-card px-2 text-muted-foreground">
								Or continue with
							</span>
						</div>
					</div>

					{/* Google Sign In */}
					<Button
						type="button"
						variant="outline"
						className="w-full"
						onClick={signInWithGoogle}
						disabled={
							signInForm.state.isSubmitting || registerForm.state.isSubmitting
						}>
						<svg
							className="mr-2 h-4 w-4"
							viewBox="0 0 24 24"
							fill="currentColor">
							<path
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								fill="#4285F4"
							/>
							<path
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								fill="#34A853"
							/>
							<path
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
								fill="#FBBC05"
							/>
							<path
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
								fill="#EA4335"
							/>
						</svg>
						Sign in with Google
					</Button>
				</div>
			</div>
		</div>
	);
}
