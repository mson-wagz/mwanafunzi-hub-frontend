import React, { useEffect, useState } from "react"
import Navigation from "./../components/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, FileText, User, Search } from "lucide-react"

export default function AdminDashboard() {
  const [allResources, setAllResources] = useState([])
  const [approvedIds, setApprovedIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [tab, setTab] = useState("pending")

  useEffect(() => {
    fetchResources()
    // Load approved IDs from localStorage
    const saved = localStorage.getItem("approvedResourceIds")
    if (saved) {
      setApprovedIds(JSON.parse(saved))
    }
  }, [])

  const fetchResources = async () => {
    setLoading(true)
    setError("")
    try {
      const token = localStorage.getItem("token")
      
      if (!token) {
        setError("Please log in as admin to access this page")
        setLoading(false)
        return
      }

      const response = await fetch("https://mwanafunzi-hub-backend.onrender.com/api/resources", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch resources: ${response.status}`)
      }

      const resources = await response.json()
      setAllResources(resources)
    } catch (err) {
      console.error("Error fetching resources:", err)
      setError("Failed to load resources: " + err.message)
    }
    setLoading(false)
  }

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`https://mwanafunzi-hub-backend.onrender.com/api/resources/${id}/approve`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      if (res.ok) {
        // Add to approved list locally
        const newApprovedIds = [...approvedIds, id]
        setApprovedIds(newApprovedIds)
        // Save to localStorage for persistence
        localStorage.setItem("approvedResourceIds", JSON.stringify(newApprovedIds))
      } else {
        const errorData = await res.json()
        setError(errorData.error || "Failed to approve resource")
      }
    } catch (err) {
      console.error("Approve error:", err)
      setError("Failed to approve resource: " + err.message)
    }
  }

  // Filter resources based on local approval state
  const pendingResources = allResources.filter(r => !approvedIds.includes(r.resource_id))
  const approvedResources = allResources.filter(r => approvedIds.includes(r.resource_id))

  const filteredPending = pendingResources.filter(
    (r) =>
      (r.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.description || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.course || "").toLowerCase().includes(search.toLowerCase())
  )

  const filteredApproved = approvedResources.filter(
    (r) =>
      (r.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.description || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.course || "").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Navigation />
      <div className="container py-8 max-w-7xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Admin Resource Dashboard</CardTitle>
            <CardDescription>
              Review and approve resources uploaded by users.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div className="flex gap-2">
                <Button
                  variant={tab === "pending" ? "default" : "outline"}
                  onClick={() => setTab("pending")}
                >
                  Pending Approval ({pendingResources.length})
                </Button>
                <Button
                  variant={tab === "approved" ? "default" : "outline"}
                  onClick={() => setTab("approved")}
                >
                  Approved ({approvedResources.length})
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border rounded-lg px-3 py-2 w-64"
                />
              </div>
            </div>
            {error && <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-4">{error}</div>}
            {loading && (
              <div className="text-center py-16">
                <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-700 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading resources...</p>
              </div>
            )}
            {!loading && tab === "pending" && (
              <div>
                {filteredPending.length === 0 && (
                  <div className="text-center py-8 text-gray-500">No pending resources for approval.</div>
                )}
                <div className="grid gap-6 md:grid-cols-2">
                  {filteredPending.map((resource) => (
                    <div key={resource.resource_id || resource.id} className="border rounded-lg p-4 bg-white shadow-sm">
                      <div className="flex items-center mb-2">
                        <FileText className="h-6 w-6 text-amber-600 mr-2" />
                        <span className="font-semibold">{resource.title}</span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">{resource.description}</div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded border border-amber-200">
                          {resource.course || "No course"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                        <User className="h-4 w-4" />
                        Uploaded by: User {resource.user_id || "Unknown"}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleApprove(resource.resource_id || resource.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {!loading && tab === "approved" && (
              <div>
                {filteredApproved.length === 0 && (
                  <div className="text-center py-8 text-gray-500">No approved resources found.</div>
                )}
                <div className="grid gap-6 md:grid-cols-2">
                  {filteredApproved.map((resource) => (
                    <div key={resource.resource_id || resource.id} className="border rounded-lg p-4 bg-white shadow-sm">
                      <div className="flex items-center mb-2">
                        <FileText className="h-6 w-6 text-green-600 mr-2" />
                        <span className="font-semibold">{resource.title}</span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">{resource.description}</div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded border border-green-200">
                          {resource.course || "No course"}
                        </span>
                        <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded border border-green-200">
                          Approved
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                        <User className="h-4 w-4" />
                        Uploaded by: User {resource.user_id || "Unknown"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}