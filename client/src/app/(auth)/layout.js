// client/src/app/(auth)/layout.js
export default function AuthLayout({ children }) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950">
        {/* Animated Gradient Mesh */}
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-48 -left-48 h-96 w-96 rounded-full bg-gradient-to-tr from-sky-500/50 to-transparent blur-[120px] animate-pulse-slow"></div>
          <div className="absolute -bottom-48 -right-48 h-96 w-96 rounded-full bg-gradient-to-tr from-purple-500/50 to-transparent blur-[120px] animate-pulse-slow-delay"></div>
        </div>

        {/* Glassmorphism Container */}
        <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-black/20 p-8 backdrop-blur-2xl shadow-2xl shadow-black/40">
            {children}
        </div>
      </div>
    );
}