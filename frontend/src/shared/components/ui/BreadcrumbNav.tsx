import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  homeItem?: { label: string; href: string };
  className?: string;
}

// 🚨 الحل هنا: ضفنا homeItem في الـ Destructuring
export function BreadcrumbNav({ items, homeItem, className }: BreadcrumbNavProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        'flex items-center gap-1 text-[13px] font-medium',
        className,
      )}
    >
      <Link
        to={homeItem?.href || "/dashboard/departments"}
        className="flex items-center gap-1.5 rounded-md px-1 py-0.5 text-content-muted transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25"
      >
        <Home className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">
          {homeItem?.label || "Departments"}
        </span>
      </Link>

      {/* ضفنا علامة الاستفهام للأمان عشان لو مفيش items ميعملش كراش */}
      {items?.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={index} className="flex items-center gap-1.5">
            <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 text-tertiary-label" />
            {isLast || !item.href ? (
              <span aria-current={isLast ? 'page' : undefined} className="truncate max-w-[220px] px-1 font-semibold text-content">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.href}
                className="truncate max-w-[180px] rounded-md px-1 py-0.5 text-content-muted transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25"
              >
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}