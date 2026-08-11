import NavigationHomepage from "./components/navigation-homepage"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, MessageSquare, Users, Briefcase, TrendingUp, Star, Download, Eye } from "lucide-react"
import {Link} from "react-router-dom"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationHomepage />

      {/* Hero Section */}
      <section className="container py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-6xl">
            Your Central Hub for
            <span className="text-primary"> Academic Success</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground text-pretty">
            Access, share, and discover academic resources. Connect with mentors, participate in discussions, and
            advance your career—all in one place.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" asChild>
              <Link href="/resources">
                <BookOpen className="mr-2 h-4 w-4" />
                Explore Resources
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/forum">
                <MessageSquare className="mr-2 h-4 w-4" />
                Join Discussions
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container py-16">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-balance">Everything you need to succeed</h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Comprehensive tools and resources designed for modern students
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Resources Hub */}
          <Card className="relative overflow-hidden">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Resources Hub</CardTitle>
              </div>
              <CardDescription>
                Browse, upload, and organize academic materials with smart tagging and search
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>12.5k views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Download className="h-4 w-4" />
                  <span>3.2k downloads</span>
                </div>
              </div>
              <Button className="w-full mt-4 bg-transparent" variant="outline" asChild>
                <Link href="/resources">Browse Resources</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Q&A Forum */}
          <Card className="relative overflow-hidden">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Q&A Forum</CardTitle>
              </div>
              <CardDescription>Get help from peers and experts. Ask questions and share knowledge</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Badge variant="secondary">Active</Badge>
                <Badge variant="outline">245 questions today</Badge>
              </div>
              <Button className="w-full bg-transparent" variant="outline" asChild>
                <Link href="/forum">Join Discussions</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Mentorship */}
          <Card className="relative overflow-hidden">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Mentorship</CardTitle>
              </div>
              <CardDescription>Connect with experienced mentors and guide fellow students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground mb-4">
                <Star className="h-4 w-4 fill-current text-yellow-500" />
                <span>4.9 average rating</span>
              </div>
              <Button className="w-full bg-transparent" variant="outline" asChild>
                <Link href="/connect">Find Mentors</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Career Corner */}
          <Card className="relative overflow-hidden md:col-span-2 lg:col-span-1">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Career Corner</CardTitle>
              </div>
              <CardDescription>Discover internships, jobs, and career guidance tailored for students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground mb-4">
                <TrendingUp className="h-4 w-4" />
                <span>150+ new opportunities this week</span>
              </div>
              <Button className="w-full bg-transparent" variant="outline" asChild>
                <Link href="/opportunities">Explore Opportunities</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <Card className="md:col-span-2 lg:col-span-2">
            <CardHeader>
              <CardTitle>Platform Statistics</CardTitle>
              <CardDescription>Growing community of learners and educators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">25,000+</div>
                  <div className="text-sm text-muted-foreground">Active Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">50,000+</div>
                  <div className="text-sm text-muted-foreground">Resources Shared</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">1,200+</div>
                  <div className="text-sm text-muted-foreground">Expert Mentors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">95%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-16">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-8 md:p-12">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-balance">Ready to accelerate your learning?</h2>
              <p className="mt-4 text-lg text-primary-foreground/80 text-pretty">
                Join thousands of students who are already using StudyHub to achieve their academic goals.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary">
                  Get Started Free
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
