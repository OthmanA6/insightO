import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/shared/components/ui/ThemeToggle';
import { BarChart3 } from 'lucide-react';
import type { ReactNode } from 'react';

interface FeatureItem {
  icon: ReactNode;
  text: string;
  accentColor: 'indigo' | 'purple';
}

interface AuthLayoutProps {
  children: ReactNode;
  headline: string;
  description: string;
  features: FeatureItem[];
}

export default function AuthLayout({
  children,
  headline,
  description,
  features,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-dvh w-full overflow-hidden font-sans">
      {/* ── Left Brand Panel ──────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-app border-e border-separator overflow-hidden items-center justify-center p-20">
        <div className="absolute inset-0 brand-pattern z-0 pointer-events-none" />

        <div aria-hidden="true" className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-96 h-96 rounded-full bg-indigo-500/12 blur-[120px]" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[30rem] h-[30rem] rounded-full bg-purple-500/10 blur-[150px]" />
        </div>

        <div className="relative z-10 max-w-xl">
          <Link to="/" className="mb-14 inline-flex items-center gap-3">
            <img src="/logo.svg" alt="" className="h-11 w-11 object-contain" />
            <span className="text-content text-2xl font-semibold">insightO</span>
          </Link>

          <h1 className="text-content text-5xl font-bold tracking-[-0.03em] mb-6">
            {headline}
          </h1>
          <p className="text-content-muted text-lg leading-relaxed mb-12">
            {description}
          </p>

          <ul className="space-y-5">
            {features.map((feature, i) => {
              const isIndigo = feature.accentColor === 'indigo';
              return (
                <li key={i} className="flex items-center gap-4">
                  <span
                    className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${
                      isIndigo ? 'bg-indigo-500/12' : 'bg-purple-500/12'
                    }`}
                  >
                    {feature.icon}
                  </span>
                  <span className="text-content-muted text-[15px] font-medium">
                    {feature.text}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* ── Right Form Panel ──────────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 overflow-y-auto bg-panel relative">
        <div className="absolute top-6 end-6 z-50">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-lg relative z-10">
          {/* Mobile logo */}
          <div className="mb-8 lg:hidden">
            <Link to="/" className="inline-flex items-center gap-2">
              <img src="/logo.svg" alt="" className="h-9 w-9 object-contain" />
              <span className="text-content text-xl font-semibold">insightO</span>
            </Link>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
