import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Camera } from "lucide-react"




export function ProfileEdit({ user, onSave }) {
  const [formData, setFormData] = useState({
    name: user.name,
    bio: user.bio,
    university: user.university,
    major: user.major,
    year: user.year,
    location: user.location,
    avatar: user.avatar,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...user,
      ...formData,
    })
  }

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          avatar: e.target?.result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar Upload */}
      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={formData.avatar || "/placeholder.svg"} alt={formData.name} />
          <AvatarFallback className="text-lg">
            {((formData.name ?? "") + "")
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <Label htmlFor="avatar-upload" className="cursor-pointer">
            <div className="flex items-center space-x-2 text-sm text-primary hover:text-primary/80">
              <Camera className="h-4 w-4" />
              <span>Change Photo</span>
            </div>
          </Label>
          <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF. Max size 2MB.</p>
        </div>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
            placeholder="City, State/Country"
            className="mt-2"
          />
        </div>
      </div>

      {/* Bio */}
      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
          placeholder="Tell us about yourself, your interests, and goals..."
          className="mt-2"
          rows={4}
        />
        <p className="text-xs text-muted-foreground mt-1">{formData.bio.length}/500 characters</p>
      </div>

      {/* Academic Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="university">University</Label>
          <Input
            id="university"
            value={formData.university}
            onChange={(e) => setFormData((prev) => ({ ...prev, university: e.target.value }))}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="major">Major</Label>
          <Select value={formData.major} onValueChange={(value) => setFormData((prev) => ({ ...prev, major: value }))}>
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Computer Science">Computer Science</SelectItem>
              <SelectItem value="Mathematics">Mathematics</SelectItem>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Physics">Physics</SelectItem>
              <SelectItem value="Chemistry">Chemistry</SelectItem>
              <SelectItem value="Biology">Biology</SelectItem>
              <SelectItem value="Psychology">Psychology</SelectItem>
              <SelectItem value="Business">Business</SelectItem>
              <SelectItem value="History">History</SelectItem>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="year">Academic Year</Label>
          <Select value={formData.year} onValueChange={(value) => setFormData((prev) => ({ ...prev, year: value }))}>
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Freshman">Freshman</SelectItem>
              <SelectItem value="Sophomore">Sophomore</SelectItem>
              <SelectItem value="Junior">Junior</SelectItem>
              <SelectItem value="Senior">Senior</SelectItem>
              <SelectItem value="Graduate">Graduate</SelectItem>
              <SelectItem value="PhD">PhD</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Privacy Settings */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3">Privacy Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Show profile to other users</p>
                <p className="text-xs text-muted-foreground">Allow others to view your profile and activity</p>
              </div>
              <Button variant="outline" size="sm">
                Public
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Show saved resources</p>
                <p className="text-xs text-muted-foreground">Display your bookmarked resources on your profile</p>
              </div>
              <Button variant="outline" size="sm">
                Visible
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Allow mentorship requests</p>
                <p className="text-xs text-muted-foreground">Let other students request mentorship from you</p>
              </div>
              <Button variant="outline" size="sm">
                Enabled
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  )
}
