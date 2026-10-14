import { Link } from "react-router-dom"
import { Search, CircleUserRound, LogOut, Moon, Menu } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { Input } from "@/shared/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { buttonVariants } from "@/shared/components/ui/button"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useTheme } from "@/shared/components/ui/ThemeToggle"

const roleLabels: Record<string, string> = {
  ADMIN: 'Administrator',
  HOD: 'Head of Department',
  INSTRUCTOR: 'Instructor',
  STUDENT: 'Student',
}

interface NavbarProps {
  /** True once page content has scrolled beneath the bar */
  scrolled?: boolean
  /** Opens the navigation drawer on narrow layouts */
  onOpenNav?: () => void
}

export function Navbar({ scrolled = false, onOpenNav }: NavbarProps) {
  const { logout, user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  const userInitials = user ? `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}` : ''
  const userFullName = user ? `${user.firstName} ${user.lastName}` : 'My Account'

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center gap-3 px-4 material-bar sm:px-6">
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 h-px bg-separator transition-opacity duration-200",
          scrolled ? "opacity-100" : "opacity-0"
        )}
      />

      <button
        type="button"
        onClick={onOpenNav}
        aria-label="Open navigation"
        className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "-ms-1.5 md:hidden")}
      >
        <Menu />
      </button>

      <div className="flex w-full max-w-sm items-center">
        <Input
          type="search"
          placeholder="Search"
          aria-label="Search"
          startIcon={<Search className="h-4 w-4" />}
          className="h-9 border-transparent bg-fill focus-visible:bg-field"
        />
      </div>

      <div className="ms-auto flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Account menu"
            className="rounded-full outline-none transition-[scale] duration-150 active:scale-95 focus-visible:ring-4 focus-visible:ring-primary/25"
          >
            <Avatar className="h-8 w-8 ring-1 ring-separator">
              {user?.profileImage && <AvatarImage src={user.profileImage} alt="" />}
              <AvatarFallback className="bg-primary/12 text-[11px] font-semibold uppercase text-primary">
                {userInitials || <CircleUserRound className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" sideOffset={8} className="w-60">
            <DropdownMenuLabel className="flex flex-col gap-0.5 py-2">
              <span className="truncate text-[13px] font-semibold text-content">{userFullName}</span>
              {user && (
                <span className="truncate text-xs font-normal text-content-muted">
                  {roleLabels[user.role] ?? user.role} · {user.email}
                </span>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link to="/dashboard/profile">
                <CircleUserRound className="me-2.5 h-4 w-4 text-content-muted" />
                Account
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
                toggleTheme()
              }}
              role="menuitemcheckbox"
              aria-checked={isDark}
              className="group justify-between"
            >
              <span className="flex items-center">
                <Moon className="me-2.5 h-4 w-4 text-content-muted" />
                Dark Appearance
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  "relative inline-flex h-[18px] w-[30px] shrink-0 items-center rounded-full p-0.5 transition-colors duration-200",
                  isDark ? "bg-primary group-focus:bg-white/30" : "bg-fill-strong group-focus:bg-white/30"
                )}
              >
                <span
                  className={cn(
                    "h-[14px] w-[14px] rounded-full bg-white shadow-sm transition-[translate] duration-300 ease-fluid",
                    isDark ? "translate-x-3" : "translate-x-0"
                  )}
                />
              </span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onSelect={logout}
              className="text-destructive focus:bg-destructive focus:text-white"
            >
              <LogOut className="me-2.5 h-4 w-4" />
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
