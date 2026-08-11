import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, Download, Eye, Bookmark, BookmarkCheck, Flag, FileText, ImageIcon, Presentation } from "lucide-react"
import { cn } from "@/lib/utils"

const getFileIcon = (fileType) => {
  switch (fileType) {
    case "PDF":
    case "DOCX":
      return FileText
    case "PPTX":
      return Presentation
    case "Image":
      return ImageIcon
    default:
      return FileText
  }
}

export function ResourceCard({ resource, viewMode, onBookmark, onPreview }) {
  const FileIcon = getFileIcon(resource.fileType)

  if (viewMode === "list") {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
              <FileIcon className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1 text-balance">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2 text-pretty line-clamp-2">{resource.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                    <span>by {resource.author}</span>
                    <span>•</span>
                    <span>{resource.course}</span>
                    <span>•</span>
                    <span>{resource.fileSize}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {resource.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {resource.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{resource.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2 ml-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-current text-yellow-500" />
                    <span className="text-sm font-medium">{resource.rating}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{resource.views}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Download className="h-4 w-4" />
                      <span>{resource.downloads}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={onPreview}>
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onBookmark}
                      className={cn(resource.isBookmarked && "text-primary")}
                    >
                      {resource.isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <FileIcon className="h-4 w-4 text-primary" />
            </div>
            <Badge variant="outline" className="text-xs">
              {resource.fileType}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onBookmark}
            className={cn("h-8 w-8 p-0", resource.isBookmarked && "text-primary")}
          >
            {resource.isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
          </Button>
        </div>
        <CardTitle className="text-lg text-balance">{resource.title}</CardTitle>
        <CardDescription className="text-pretty line-clamp-2">{resource.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center space-x-2 mb-3">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">
              {typeof resource.author === "string" && resource.author.length > 0
                ? resource.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                : "?"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{resource.author}</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {(Array.isArray(resource.tags) ? resource.tags : typeof resource.tags === "string" ? resource.tags.split(",") : []).slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {(Array.isArray(resource.tags) ? resource.tags : typeof resource.tags === "string" ? resource.tags.split(",") : []).length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{(Array.isArray(resource.tags) ? resource.tags : typeof resource.tags === "string" ? resource.tags.split(",") : []).length - 2}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-current text-yellow-500" />
            <span>{resource.rating}</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{resource.views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Download className="h-4 w-4" />
              <span>{resource.downloads}</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={onPreview}>
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`https://mwanafunzi-hub.onrender.com/api/resources/${resource.resource_id}/download`, "_blank")}
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" /> Download
          </Button>
          <Button variant="ghost" size="sm">
            <Flag className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
