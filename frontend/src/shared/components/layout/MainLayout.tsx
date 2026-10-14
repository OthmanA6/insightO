import { useEffect, useRef, useState } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { Sidebar, SidebarContent } from "./components/Sidebar"
import { Navbar } from "./components/Navbar"
import { Drawer } from "@/shared/components/ui/Drawer"

export function MainLayout() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    setNavOpen(false)
    scrollRef.current?.scrollTo({ top: 0 })
  }, [pathname])

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)")
    const closeOnWide = () => { if (wide.matches) setNavOpen(false) }
    wide.addEventListener("change", closeOnWide)
    return () => wide.removeEventListener("change", closeOnWide)
  }, [])

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-app text-content">
      <Sidebar className="hidden md:flex" />

      {/* Content scrolls beneath the translucent navbar rather than stopping at it. */}
      <div
        ref={scrollRef}
        onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 0)}
        className="relative min-w-0 flex-1 overflow-y-auto"
      >
        <Navbar scrolled={scrolled} onOpenNav={() => setNavOpen(true)} />
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>

      <Drawer open={navOpen} onOpenChange={setNavOpen} title="Navigation">
        <SidebarContent onNavigate={() => setNavOpen(false)} />
      </Drawer>
    </div>
  )
}
