"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-client";

export default function LogoutPage() {
    const { logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const performLogout = async () => {
            await logout();
            router.push("/sign-in");
        };

        performLogout();
    }, [logout, router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <p>Sedang logout...</p>
        </div>
    );
}