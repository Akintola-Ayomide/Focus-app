"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { apiFetch } from "@/lib/api-client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      router.push("/auth/login?error=oauth");
      return;
    }

    // Set the cookie on the frontend domain
    document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax; Secure`;

    // Fetch user profile using the new token
    const fetchUser = async () => {
      try {
        const res = await apiFetch("/auth/me");
        if (res.ok) {
          const data = await res.json();
          login(data.user, token);
        } else {
          router.push("/auth/login?error=session_failed");
        }
      } catch (err) {
        router.push("/auth/login?error=network_error");
      }
    };

    fetchUser();
  }, [searchParams, router, login]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center animate-bounce">
          <span className="text-primary-foreground font-bold text-xl">F</span>
        </div>
        <h2 className="text-xl font-semibold">Completing sign in...</h2>
        <p className="text-muted-foreground text-sm">Please wait while we redirect you.</p>
      </div>
    </div>
  );
}
