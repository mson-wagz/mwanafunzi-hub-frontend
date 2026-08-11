import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, FileText, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function ResourceUpload({ onUpload }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [course, setCourse] = useState("")
  const [topic, setTopic] = useState("")
  const [tags, setTags] = useState([])
  const [currentTag, setCurrentTag] = useState("")
  const [file, setFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim().toLowerCase())) {
      setTags([...tags, currentTag.trim().toLowerCase()])
      setCurrentTag("")
    }
  }

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("title", title)
    formData.append("description", description)
    formData.append("course", course)
    formData.append("topic", topic)
    tags.forEach(tag => formData.append("tags[]", tag))
    formData.append("file", file)
    if (isFormValid &&  onUpload === "function") {
      onUpload(formData)
    }
  }

  const isFormValid = title && description && course && tags.length > 0 && file

  return (
    <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
      {/* File Upload */}
      <div>
        <Label htmlFor="file-upload">File Upload *</Label>
        <Card
          className={cn(
            "mt-2 border-2 border-dashed transition-colors",
            dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
            file && "border-primary bg-primary/5",
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <CardContent className="p-8 text-center">
            {file ? (
              <div className="flex items-center justify-center space-x-2">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => setFile(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div>
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">Drop your file here</p>
                <p className="text-sm text-muted-foreground mb-4">or click to browse (PDF, DOCX, PPTX, Images)</p>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx,.pptx,.jpg,.jpeg,.png,.gif"
                  onChange={handleFileChange}
                />
                <Button type="button" variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
                  Choose File
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Title */}
      <div>
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter resource title"
          className="mt-2"
        />
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your resource and what students will learn"
          className="mt-2"
          rows={3}
        />
      </div>

      {/* Course and Topic */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="course">Course *</Label>
          <Select value={course} onValueChange={setCourse}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mathematics">Mathematics</SelectItem>
              <SelectItem value="Computer Science">Computer Science</SelectItem>
              <SelectItem value="Chemistry">Chemistry</SelectItem>
              <SelectItem value="History">History</SelectItem>
              <SelectItem value="Physics">Physics</SelectItem>
              <SelectItem value="Biology">Biology</SelectItem>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Psychology">Psychology</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="topic">Topic</Label>
          <Input
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Specific topic (optional)"
            className="mt-2"
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <Label htmlFor="tags">Tags *</Label>
        <div className="mt-2 space-y-2">
          <div className="flex space-x-2">
            <Input
              id="tags"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              placeholder="Add tags (press Enter or click Add)"
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
            />
            <Button type="button" onClick={addTag} disabled={!currentTag.trim()}>
              Add
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                  <span>{tag}</span>
                  <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Form Validation Message */}
      {!isFormValid && (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <AlertCircle className="h-4 w-4" />
          <span>Please fill in all required fields marked with *</span>
        </div>
      )}

      {/* Submit Button */}
      <div className="sticky bottom-0 left-0 right-0 bg-white z-10 flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-2 p-4 shadow-lg">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={!isFormValid} className="w-full md:w-auto">
          Upload Resource
        </Button>
      </div>
    </form>
  )
}
