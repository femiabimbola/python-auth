
import { AuthBanner } from "./_components/auth-banner";
import { LoginForm } from "./_components/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F0F4F8] p-4 md:p-8">
      <div className="flex w-full max-w-300 flex-col overflow-hidden rounded-[24px] bg-white shadow-xl md:flex-row">
        {/* Left Banner */}
        <div className="w-full md:w-[55%]">
          <AuthBanner />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-[45%]">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}