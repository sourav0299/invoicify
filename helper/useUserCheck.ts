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
      })
  
      const data = await response.json()
  
      if (!response.ok) {
        return {
          error: data.error,
          status: response.status,
        }
      }
  
      return {
        user: data.user,
        message: data.message,
      }
    } catch (error) {
      return {
        error: "Connection failed",
        status: 500,
      }
    }
  }

export function useUserCheck() {
    const router = useRouter();
    
    useEffect(() => {
      const verifyUser = async () => {
        try {
          const result = await checkUser();
          if (result.error) {
            switch (result.status) {
              case 401:
                router.push("/login");
                break;
              case 404:
                router.push("/sync-user");
                break;
              default:
                router.push("/sync-user");
                break;
            }
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