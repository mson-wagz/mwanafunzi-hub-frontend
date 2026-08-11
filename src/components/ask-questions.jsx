"use client"
import  React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, X, HelpCircle } from "lucide-react"

export function AskQuestion() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [course, setCourse] = useState("")
  const [tags, setTags] = useState([])
  const [currentTag, setCurrentTag] = useState("")

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim().toLowerCase()) && tags.length < 5) {
      setTags([...tags, currentTag.trim().toLowerCase()])
      setCurrentTag("")
    }
  }

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log({
      title,
      content,
      course,
      tags,
    })
  }

  const isFormValid = title.length >= 10 && content.length >= 20 && course && tags.length > 0

  return (
    <div className="space-y-6">
      {/* Guidelines */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-base">
            <HelpCircle className="h-5 w-5" />
            <span>How to ask a good question</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Be specific and clear in your title</li>
            <li>• Provide context and what you've tried</li>
            <li>• Include relevant code, formulas, or examples</li>
            <li>• Add appropriate tags to help others find your question</li>
          </ul>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <Label htmlFor="title">Question Title *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's your programming question? Be specific."
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">{title.length}/100 characters (minimum 10 required)</p>
        </div>

        {/* Content */}
        <div>
          <Label htmlFor="content">Question Details *</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Provide more details about your question. Include what you've tried, any error messages, and what you expect to happen."
            className="mt-2"
            rows={8}
          />
          <p className="text-xs text-muted-foreground mt-1">{content.length}/2000 characters (minimum 20 required)</p>
        </div>

        {/* Course */}
        <div>
          <Label htmlFor="course">Course/Subject *</Label>
          <Select value={course} onValueChange={setCourse}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select the relevant course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Computer Science">Computer Science</SelectItem>
              <SelectItem value="Mathematics">Mathematics</SelectItem>
              <SelectItem value="Chemistry">Chemistry</SelectItem>
              <SelectItem value="Physics">Physics</SelectItem>
              <SelectItem value="Biology">Biology</SelectItem>
              <SelectItem value="History">History</SelectItem>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Psychology">Psychology</SelectItem>
              <SelectItem value="Business">Business</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tags */}
        <div>
          <Label htmlFor="tags">Tags * (up to 5)</Label>
          <div className="mt-2 space-y-2">
            <div className="flex space-x-2">
              <Input
                id="tags"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                placeholder="Add tags to help categorize your question"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                disabled={tags.length >= 5}
              />
              <Button type="button" onClick={addTag} disabled={!currentTag.trim() || tags.length >= 5}>
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
            <span>Please fill in all required fields with minimum character requirements</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit" disabled={!isFormValid}>
            Post Question
          </Button>
        </div>
      </form>
    </div>
  )
}
