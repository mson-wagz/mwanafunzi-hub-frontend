import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { BookOpen, MessageSquare, User, Users, Briefcase, Menu, Search, Upload, Bell } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Navigation() {
  const navItems = [
    { name: "Resources", href: "/resources", icon: BookOpen },
    { name: "Q&A Forum", href: "/forum", icon: MessageSquare },
    { name: "Profile", href: "/profile", icon: User },
    // { name: "Sign Up", href: "/signup" },
    // { name: "Log In", href: "/login" },
    { name: "Mentorship", href: "/opportunities", icon: Users },
    { name: "Career Corner", href: "/connect", icon: Briefcase },
  ]
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BookOpen className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-balance">Mwanafunzi Hub</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* <Link to="/signup">
            <Button size="sm" className="w-20">
              Sign Up
            </Button>
          </Link>
          <Link to="/login">
            <Button size="sm" className="w-20">
              Log In
            </Button>
          </Link>
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
            <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
              3
            </Badge>
          </Button> */}

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                        isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                      )}
                    >
                      {Icon && <Icon className="h-5 w-5" />}
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
