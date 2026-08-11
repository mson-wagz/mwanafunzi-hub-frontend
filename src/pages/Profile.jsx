import React, { useState, useEffect } from "react"
import Navigation from "./../components/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Edit, Calendar } from "lucide-react"

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [editMode, setEditMode] = useState(false)
  const [editProfile, setEditProfile] = useState({ full_name: "", bio: "" })

  
  useEffect(() => {
    console.log("Starting to fetch profile...")
    fetch("https://mwanafunzi-hub-backend.onrender.com/api/auth/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        console.log("Response received, status:", res.status)
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => {
        console.log("Raw API response:", data) // Debug
        // Handle wrapped response: { success: true, data: {...} }
        const userData = data.data || data
        console.log("User data:", userData) // Debug
        setUser(userData)
        setEditProfile({ full_name: userData.full_name || "", bio: userData.bio || "" })
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error loading profile:", err)
        setError("Failed to load profile. Please try logging in again.")
        setLoading(false)
      })
  }, [])

  const handleEditProfile = async (e) => {
    e.preventDefault()
    
    console.log("User object:", user)
    console.log("User ID:", user?.user_id || user?.id)

    try {
      const res = await fetch(`https://mwanafunzi-hub-backend.onrender.com/api/users/${user?.user_id || user?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(editProfile),
      })
      
      console.log("Update response status:", res.status)
      const data = await res.json()
      console.log("Update response data:", data)
      
      if (res.ok) {
        // Handle response - it returns the user directly, not wrapped in { user: {...} }
        const updatedUser = data.user || data
        setUser(updatedUser)
        setEditMode(false)
        setError("") // Clear any errors
      } else {
        setError(data.error || "Failed to update profile.")
      }
    } catch (err) {
      console.error("Update error:", err)
      setError("Failed to update profile.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="text-lg font-semibold">Loading profile...</span>
      </div>
    )
  }

  if (error && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="text-lg text-red-500">{error}</span>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="text-lg text-red-500">Failed to load profile.</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container py-8">
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={"/placeholder.svg"} alt={user?.full_name || user?.username || ""} />
                <AvatarFallback className="text-2xl">
                  {((user?.full_name ?? user?.username ?? "") + "")
                    .split(" ")
                    .filter(Boolean)
                    .map((n) => n[0]?.toUpperCase() ?? "")
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-balance">{user?.full_name || user?.username}</h1>
                    <p className="text-lg text-muted-foreground">{user?.role}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                  <Button variant="outline" onClick={() => setEditMode(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>
                <p className="text-muted-foreground text-pretty mb-4">{user?.bio || "No bio yet."}</p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Joined {user?.created_at ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "Unknown"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {editMode && (
              <form onSubmit={handleEditProfile} className="mt-8 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <Input
                    value={editProfile.full_name}
                    onChange={(e) => setEditProfile({ ...editProfile, full_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bio</label>
                  <Textarea
                    value={editProfile.bio}
                    onChange={(e) => setEditProfile({ ...editProfile, bio: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Save</Button>
                  <Button type="button" variant="outline" onClick={() => setEditMode(false)}>
                    Cancel
                  </Button>
                </div>
                {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}