import { useId } from "react"
import { NavLink } from "react-router-dom"
import { motion } from "framer-motion"
import {
  LayoutDashboard, FileText, BarChart3, Users, Building2, BookOpen,
  ClipboardCheck, FileQuestion, Zap, CircleUserRound, type LucideIcon,
} from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { spring } from "@/shared/lib/motion"
import { ScrollArea } from "@/shared/components/ui/scroll-area"
import { useAuth } from '@/features/auth/hooks/useAuth'
import type { UserRole } from '@/features/auth/types'

type NavItem = { name: string; href: string; icon: LucideIcon }
type NavGroup = { title?: string; items: NavItem[] }

const overview: NavItem = { name: "Overview", href: "/dashboard", icon: LayoutDashboard }
const account: NavItem = { name: "Account", href: "/dashboard/profile", icon: CircleUserRound }

const adminNav: NavGroup[] = [
  { items: [overview] },
  {
    title: "Surveys & Evaluation",
    items: [{ name: "Forms & Templates", href: "/dashboard/forms-surveys", icon: FileText }],
  },
  {
    title: "Administration",
    items: [
      { name: "Users", href: "/dashboard/users", icon: Users },
      { name: "Academic Entities", href: "/dashboard/departments", icon: Building2 },
      { name: "Task Analytics", href: "/dashboard/task-analytics", icon: BarChart3 },
    ],
  },
  {
    title: "System",
    items: [{ name: "AI Token Usage", href: "/dashboard/ai-usage-dashboard", icon: Zap }],
  },
]

const studentNav: NavGroup[] = [
  {
    items: [
      overview,
      { name: "Courses & Tasks", href: "/dashboard/courses-tasks", icon: BookOpen },
      { name: "Evaluations", href: "/dashboard/student-evaluations", icon: ClipboardCheck },
      { name: "Pending Surveys", href: "/dashboard/student-surveys", icon: FileQuestion },
    ],
  },
]

const instructorNav: NavGroup[] = [
  { items: [overview] },
  {
    title: "Teaching",
    items: [
      { name: "Courses", href: "/dashboard/courses", icon: BookOpen },
      { name: "Students", href: "/dashboard/directory", icon: Users },
      { name: "Task Analytics", href: "/dashboard/task-analytics", icon: BarChart3 },
      { name: "AI Quota", href: "/dashboard/ai-usage-dashboard", icon: Zap },
    ],
  },
]

function navFor(role?: UserRole) {
  if (role === 'STUDENT') return studentNav
  if (role === 'INSTRUCTOR') return instructorNav
  return adminNav
}

function SidebarLink({ item, indicatorId, onNavigate }: { item: NavItem; indicatorId: string; onNavigate?: () => void }) {
  return (
    <NavLink
      to={item.href}
      end={item.href === "/dashboard"}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "group relative flex h-9 items-center gap-3 rounded-lg px-3 text-[13px] font-medium outline-none touch-manipulation",
          "transition-[color,background-color,scale] duration-150 active:scale-[0.98] active:duration-75",
          "focus-visible:ring-4 focus-visible:ring-primary/25",
          isActive
            ? "text-primary dark:text-content"
            : "text-content/80 hover:bg-panel-hover hover:text-content"
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId={indicatorId}
              transition={spring.snappy}
              className="absolute inset-0 rounded-lg bg-primary/12 dark:bg-primary/24"
            />
          )}
          <item.icon
            aria-hidden="true"
            strokeWidth={isActive ? 2.25 : 2}
            className={cn(
              "relative h-[18px] w-[18px] shrink-0 transition-colors duration-150",
              isActive ? "text-primary" : "text-content-muted group-hover:text-content"
            )}
          />
          <span className="relative truncate">{item.name}</span>
        </>
      )}
    </NavLink>
  )
}

/** Brand, role-aware navigation and the account link. Shared by the sidebar and the mobile drawer. */
export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user } = useAuth()
  const indicatorId = useId()
  const groups = navFor(user?.role)

  return (
    <>
      <div className="flex h-16 shrink-0 items-center gap-2.5 px-5">
        <img src="/logo.svg" alt="" className="h-8 w-8 object-contain" />
        <span className="text-[17px] font-semibold tracking-[-0.022em] text-content">insightO</span>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <nav aria-label="Main" className="flex flex-col gap-5 px-3 pb-4 pt-1">
          {groups.map((group, i) => (
            <div key={group.title ?? i} className="flex flex-col gap-0.5">
              {group.title && (
                <h4 className="px-3 pb-1 text-[11px] font-semibold tracking-[0.01em] text-content-muted">
                  {group.title}
                </h4>
              )}
              {group.items.map((item) => (
                <SidebarLink key={item.href} item={item} indicatorId={indicatorId} onNavigate={onNavigate} />
              ))}
            </div>
          ))}
        </nav>
      </ScrollArea>

      <div className="shrink-0 border-t border-separator px-3 py-3">
        <SidebarLink item={account} indicatorId={indicatorId} onNavigate={onNavigate} />
      </div>
    </>
  )
}

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> { }

export function Sidebar({ className, ...props }: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex h-full w-64 shrink-0 flex-col border-e border-separator material-sidebar text-content",
        className
      )}
      {...props}
    >
      <SidebarContent />
    </aside>
  )
}
