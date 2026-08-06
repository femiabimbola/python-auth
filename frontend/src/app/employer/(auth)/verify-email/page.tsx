"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

type VerificationStatus = "loading" | "success" | "error";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  
  const [status, setStatus] = useState<VerificationStatus>("loading");
  const [message, setMessage] = useState("We are verifying your email address. Please wait.");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Missing or invalid verification token.");
      return;
    }

    const verifyToken = async () => {
      try {
        // Calling your backend API
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/api/auth/verify-email?token=${token}`, {
          method: "GET", 
        });

        if (response.ok) {
          setStatus("success");
          setMessage("Your email has been successfully verified! You can now log in.");
        } else {
          const data = await response.json();
          setStatus("error");
          setMessage(data.message || "The verification link is invalid or has expired.");
        }
      } catch (error) {
        setStatus("error");
        setMessage("Something went wrong on our end. Please try again later.");
      }
    };

    verifyToken();
  }, [token]);

  return (
    <Card className="w-full border-zinc-200/80 shadow-xl backdrop-blur-sm bg-white/90 dark:bg-zinc-900/90 dark:border-zinc-800/80">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          {status === "loading" && <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />}
          {status === "success" && <CheckCircle2 className="h-12 w-12 text-emerald-500" />}
          {status === "error" && <XCircle className="h-12 w-12 text-destructive" />}
        </div>
        
        <CardTitle className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {status === "loading" && "Verifying email..."}
          {status === "success" && "Welcome aboard!"}
          {status === "error" && "Verification failed"}
        </CardTitle>
        
        <CardDescription className="mt-2 text-zinc-500 dark:text-zinc-400">
          {message}
        </CardDescription>
      </CardHeader>

      <CardFooter className="flex justify-center">
        {status === "success" && (
          <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer" onClick={() => router.push("/login")}>
            Sign In
          </Button>
        )}
        {status === "error" && (
          <Button className="w-full" variant="outline" onClick={() => router.push("/register")}>
            Back to Registration
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}