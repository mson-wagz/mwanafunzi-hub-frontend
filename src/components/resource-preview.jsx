import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Star, Download, Bookmark, BookmarkCheck, Flag, Share, StarIcon } from "lucide-react"
import { cn } from "@/lib/utils"



export function ResourcePreview({ resource, isOpen, onClose, onBookmark }) {
  const [userRating, setUserRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [showRatingForm, setShowRatingForm] = useState(false)

  const handleDownload = () => {
    // Simulate download
    console.log(`Downloading ${resource.title}`)
  }

  const handleFlag = () => {
    // Handle flagging
    console.log(`Flagging ${resource.title}`)
  }

  const handleShare = () => {
    // Handle sharing
    navigator.clipboard.writeText(`Check out this resource: ${resource.title}`)
  }

  const submitRating = () => {
    console.log(`Rating ${resource.id}: ${userRating} stars, feedback: ${feedback}`)
    setShowRatingForm(false)
    setUserRating(0)
    setFeedback("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-balance">{resource.title}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Preview Area */}
          <div className="lg:col-span-2">
            <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden mb-4">
              <Image
                src={resource.previewUrl || "/placeholder.svg"}
                alt={`Preview of ${resource.title}`}
                width={600}
                height={450}
                className="w-full h-full object-cover"
              />
            </div>

            {resource.fileType === "PDF" && (
              <p className="text-sm text-muted-foreground text-center">Preview not available for this file type</p>
            )}
          </div>

          {/* Resource Details */}
          <div className="space-y-6">
            {/* Author Info */}
            <div className="flex items-center space-x-3">
              <Avatar>
              <AvatarFallback>
                {((resource?.author ?? "") + "")
                  .split(" ")
                  .filter(Boolean) // drop empty strings
                  .map((n) => n[0]?.toUpperCase() ?? "") // safe indexing
                  .join("")}
              </AvatarFallback>

              </Avatar>
              <div>
                <p className="font-medium">{resource.author}</p>
                <p className="text-sm text-muted-foreground">{resource.course}</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-sm text-muted-foreground text-pretty">{resource.description}</p>
            </div>

            {/* Tags */}
            <div>
              <h3 className="font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-1">
                {resource.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Rating</p>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-current text-yellow-500" />
                  <span className="font-medium">{resource.rating}</span>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground">File Size</p>
                <p className="font-medium">{resource.fileSize}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Downloads</p>
                <p className="font-medium">{resource.downloads.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Views</p>
                <p className="font-medium">{resource.views.toLocaleString()}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button className="w-full" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download ({resource.fileType})
              </Button>

              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={onBookmark}>
                  {resource.isBookmarked ? (
                    <BookmarkCheck className="mr-2 h-4 w-4" />
                  ) : (
                    <Bookmark className="mr-2 h-4 w-4" />
                  )}
                  {resource.isBookmarked ? "Saved" : "Save"}
                </Button>

                <Button variant="outline" onClick={handleShare}>
                  <Share className="h-4 w-4" />
                </Button>

                <Button variant="outline" onClick={handleFlag}>
                  <Flag className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Rating Section */}
            <div>
              {!showRatingForm ? (
                <Button variant="outline" className="w-full bg-transparent" onClick={() => setShowRatingForm(true)}>
                  <Star className="mr-2 h-4 w-4" />
                  Rate this resource
                </Button>
              ) : (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-2">Your Rating</p>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setUserRating(star)}
                          className={cn(
                            "p-1 rounded",
                            star <= userRating ? "text-yellow-500" : "text-muted-foreground",
                          )}
                        >
                          <StarIcon className={cn("h-5 w-5", star <= userRating && "fill-current")} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Feedback (optional)</p>
                    <Textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Share your thoughts about this resource..."
                      rows={3}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={submitRating} disabled={userRating === 0} className="flex-1">
                      Submit Rating
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowRatingForm(false)
                        setUserRating(0)
                        setFeedback("")
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
