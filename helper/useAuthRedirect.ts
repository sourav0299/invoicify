"use client"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

async function checkUser() {
  try {
    const response = await fetch("/api/middleware/check-user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.error,
        status: response.status,
        redirectTo: data.redirectTo
      };
    }

    return {
      user: data.user,
      message: data.message,
    };
  } catch (error) {
    return {
      error: "Connection failed",
      status: 500,
    };
  }
}

export function useAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const result = await checkUser();
        
        if (result.error) {
          // Handle specific redirects based on the error
          if (result.status === 404 && result.redirectTo) {
            router.push(result.redirectTo);
            return;
          }
          
          // Handle unauthorized cases
          if (result.status === 401) {
            router.push("/login");
            return;
          }
          
          // Handle other errors
          if (result.status === 500) {
            router.push("/error");
            return;
          }
        } else {
          // If user exists and has complete profile, redirect to dashboard
          router.push("/dashboard");
          return;
        }
      } catch (error) {
        console.error("Verification error:", error);
        router.push("/error");
      }
    };
    verifyUser();
  }, [router]);
} 