import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThumbsUp, ThumbsDown, MessageSquare, Eye, Clock, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"


export function QuestionCard({ question }) {
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null)
  const [currentVotes, setCurrentVotes] = useState(question.votes)

  const handleVote = (voteType) => {
    if (userVote === voteType) {
      // Remove vote
      setUserVote(null)
      setCurrentVotes(question.votes)
    } else {
      // Add or change vote
      const voteChange = voteType === "up" ? 1 : -1
      const previousVoteChange = userVote === "up" ? -1 : userVote === "down" ? 1 : 0
      setUserVote(voteType)
      setCurrentVotes(question.votes + voteChange + previousVoteChange)
    }
  }

  const timeAgo = (date) => {
    const now = new Date()
    const questionDate = new Date(date)
    const diffInHours = Math.floor((now.getTime() - questionDate.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return questionDate.toLocaleDateString()
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex space-x-4">
          {/* Vote Section */}
          <div className="flex flex-col items-center space-y-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVote("up")}
              className={cn("h-8 w-8 p-0", userVote === "up" && "text-primary bg-primary/10")}
            >
              <ThumbsUp className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">{currentVotes}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVote("down")}
              className={cn("h-8 w-8 p-0", userVote === "down" && "text-destructive bg-destructive/10")}
            >
              <ThumbsDown className="h-4 w-4" />
            </Button>
          </div>

          {/* Question Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <Link href={`/forum/${question.id}`} className="flex-1">
                <h3 className="text-lg font-semibold hover:text-primary transition-colors text-balance">
                  {question.title}
                </h3>
              </Link>
              {question.isAnswered && (
                <Badge variant="default" className="ml-2 flex-shrink-0">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Answered
                </Badge>
              )}
            </div>

            <p className="text-muted-foreground text-sm mb-3 text-pretty line-clamp-2">{question.content}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-3">
              {question.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Stats and Author */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{question.answers} answers</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{question.views} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{timeAgo(question.createdAt)}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={question.author.avatar || "/placeholder.svg"} alt={question.author.name} />
                  <AvatarFallback className="text-xs">
                    {((question.author.name ?? "") + "")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium">{question.author.name}</p>
                  <p className="text-muted-foreground text-xs">{question.author.reputation} rep</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
