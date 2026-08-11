// ResourcesPage.jsx
import React, { useEffect, useState } from "react"
import Navigation from "./../components/navigation"
import { Search, Upload, Download, FileText, Image, FileSpreadsheet, Eye, X, Filter, Grid, List, CloudUpload } from "lucide-react"

export default function ResourcesPage() {
  const [resources, setResources] = useState([])
  const [filteredResources, setFilteredResources] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCourse, setSelectedCourse] = useState("all")
  const [selectedFileType, setSelectedFileType] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [viewMode, setViewMode] = useState("grid")
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [selectedResource, setSelectedResource] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [dragActive, setDragActive] = useState(false)

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    course: "",
    file: null,
  })
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")

  // Fetch all resources
  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      setLoading(true)
      const response = await fetch("https://mwanafunzi-hub-backend.onrender.com/api/resources")
      const data = await response.json()
      
      if (response.ok) {
        setResources(data)
      } else {
        setError("Failed to fetch resources")
      }
    } catch (err) {
      setError("Error loading resources")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Filter and sort resources
  useEffect(() => {
    let filtered = [...resources]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((resource) => {
        const title = (resource.title || "").toLowerCase()
        const description = (resource.description || "").toLowerCase()
        const course = (resource.course || "").toLowerCase()
        const query = searchQuery.toLowerCase()
        
        return title.includes(query) || description.includes(query) || course.includes(query)
      })
    }

    // Apply course filter
    if (selectedCourse !== "all") {
      filtered = filtered.filter((resource) => resource.course === selectedCourse)
    }

    // Apply file type filter
    if (selectedFileType !== "all") {
      filtered = filtered.filter((resource) => getFileType(resource.file_path) === selectedFileType)
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.uploaded_at || b.uploadDate || 0) - new Date(a.uploaded_at || a.uploadDate || 0)
      }
      if (sortBy === "title") {
        return (a.title || "").localeCompare(b.title || "")
      }
      return 0
    })

    setFilteredResources(filtered)
  }, [searchQuery, selectedCourse, selectedFileType, sortBy, resources])

  // Get file type from path
  const getFileType = (filePath) => {
    if (!filePath) return "unknown"
    const ext = filePath.split(".").pop().toLowerCase()
    if (["pdf"].includes(ext)) return "PDF"
    if (["doc", "docx"].includes(ext)) return "DOCX"
    if (["ppt", "pptx"].includes(ext)) return "PPTX"
    if (["jpg", "jpeg", "png", "gif"].includes(ext)) return "Image"
    if (["xls", "xlsx"].includes(ext)) return "Excel"
    return "Other"
  }

  // Get file icon
  const getFileIcon = (filePath) => {
    const type = getFileType(filePath)
    switch (type) {
      case "PDF":
      case "DOCX":
      case "PPTX":
        return <FileText className="w-5 h-5" />
      case "Image":
        return <Image className="w-5 h-5" />
      case "Excel":
        return <FileSpreadsheet className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  // Handle file upload
  const handleUploadFormChange = (e) => {
    const { name, value } = e.target
    setUploadForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setUploadForm((prev) => ({ ...prev, file }))
    }
  }

  // Drag and drop handlers
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
      setUploadForm((prev) => ({ ...prev, file: e.dataTransfer.files[0] }))
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault();
  
    // Access user_id directly from localStorage
    const userId = localStorage.getItem("user_id");

    console.log("User ID being sent:", userId);

    if (!uploadForm.title || !uploadForm.file || !userId) {
      setUploadError("Please fill in all required fields");
      return;
    }
  
    const formData = new FormData();
    formData.append("title", uploadForm.title);
    formData.append("description", uploadForm.description || "");
    formData.append("file", uploadForm.file);
    formData.append("user_id", userId);
  
    // append topicIds[] if you have them
    uploadForm.topicIds?.forEach((topicId) => {
      formData.append("topicIds[]", topicId);
    });
  
    try {
      setUploading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("https://mwanafunzi-hub-backend.onrender.com/api/resources", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log("Upload success:", data);
        setShowUploadModal(false);
        setUploadForm({ title: "", description: "", course: "", file: null });
        setUploadError("");
        fetchResources();
      } else {
        console.error("Upload failed:", data);
        setUploadError(data.error || "Upload failed");
      }
    } catch (err) {
      console.error("Error uploading resource:", err);
      setUploadError("Error uploading resource");
    } finally {
      setUploading(false);
    }
  };

  // Handle download
  const handleDownload = async (resourceId, fileName) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `https://mwanafunzi-hub-backend.onrender.com/api/resources/${resourceId}/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = fileName || "download"
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        alert("Download failed")
      }
    } catch (err) {
      console.error("Download error:", err)
      alert("Error downloading resource")
    }
  }

  // Handle preview
  const handlePreview = (resource) => {
    setSelectedResource(resource)
    setShowPreviewModal(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent mb-2">
                Resources Hub
              </h1>
              <p className="text-gray-600">Discover, share, and organize academic resources with the community</p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-amber-700 to-orange-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all flex items-center gap-2 font-semibold"
            >
              <Upload className="w-5 h-5" />
              Upload Resource
            </button>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search resources, topics..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition"
                />
              </div>

              {/* Course Filter */}
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none bg-white cursor-pointer"
              >
                <option value="all">All Courses</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Physics">Physics</option>
                <option value="Biology">Biology</option>
                <option value="History">History</option>
                <option value="Literature">Literature</option>
              </select>

              {/* File Type Filter */}
              <select
                value={selectedFileType}
                onChange={(e) => setSelectedFileType(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none bg-white cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="PDF">PDF</option>
                <option value="DOCX">DOCX</option>
                <option value="PPTX">PPTX</option>
                <option value="Image">Image</option>
                <option value="Excel">Excel</option>
              </select>

              {/* View Mode */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 rounded-xl transition ${
                    viewMode === "grid"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 rounded-xl transition ${
                    viewMode === "list"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Results and Sort */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {filteredResources.length} of {resources.length} resources
              </p>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none bg-white cursor-pointer"
                >
                  <option value="recent">Most Recent</option>
                  <option value="title">Alphabetical</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-700 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading resources...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 mb-6">
            {error}
          </div>
        )}

        {/* Resources Grid/List */}
        {!loading && !error && (
          <>
            {viewMode === "grid" ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredResources.map((resource) => (
                  <div
                    key={resource.resource_id || resource.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-amber-200"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-amber-100 rounded-xl text-amber-700">
                            {getFileIcon(resource.file_path)}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 line-clamp-1">{resource.title}</h3>
                            <p className="text-sm text-gray-500">{getFileType(resource.file_path)}</p>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{resource.description}</p>

                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium border border-amber-200">
                          {resource.course}
                        </span>
                        {resource.status === "pending" && (
                          <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-medium border border-yellow-200">
                            Pending
                          </span>
                        )}
                        {resource.status === "approved" && (
                          <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200">
                            Approved
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePreview(resource)}
                          className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition flex items-center justify-center gap-2 text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          Preview
                        </button>
                        <button
                          onClick={() =>
                            handleDownload(resource.resource_id || resource.id, resource.title)
                          }
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-700 to-orange-600 text-white rounded-xl hover:shadow-lg transition flex items-center justify-center gap-2 text-sm font-medium"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredResources.map((resource) => (
                  <div
                    key={resource.resource_id || resource.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 hover:border-amber-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="p-3 bg-amber-100 rounded-xl text-amber-700">
                          {getFileIcon(resource.file_path)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-1">{resource.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium border border-amber-200">
                              {resource.course}
                            </span>
                            <span className="text-xs text-gray-500">{getFileType(resource.file_path)}</span>
                            {resource.status === "pending" && (
                              <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-medium border border-yellow-200">
                                Pending
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePreview(resource)}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition flex items-center gap-2 text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          Preview
                        </button>
                        <button
                          onClick={() =>
                            handleDownload(resource.resource_id || resource.id, resource.title)
                          }
                          className="px-4 py-2 bg-gradient-to-r from-amber-700 to-orange-600 text-white rounded-xl hover:shadow-lg transition flex items-center gap-2 text-sm font-medium"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {filteredResources.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No resources found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or upload a new resource</p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-amber-700 to-orange-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all inline-flex items-center gap-2 font-semibold"
                >
                  <Upload className="w-5 h-5" />
                  Upload First Resource
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">
                Upload New Resource
              </h2>
              <button
                onClick={() => {
                  setShowUploadModal(false)
                  setUploadForm({ title: "", description: "", course: "", file: null })
                  setUploadError("")
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {uploadError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {uploadError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={uploadForm.title}
                  onChange={handleUploadFormChange}
                  placeholder="e.g., Calculus Study Notes"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                <textarea
                  name="description"
                  value={uploadForm.description}
                  onChange={handleUploadFormChange}
                  placeholder="Brief description of the resource..."
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Course *</label>
                <select
                  name="course"
                  value={uploadForm.course}
                  onChange={handleUploadFormChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none bg-white cursor-pointer"
                  required
                >
                  <option value="">Select a course</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Physics">Physics</option>
                  <option value="Biology">Biology</option>
                  <option value="History">History</option>
                  <option value="Literature">Literature</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">File *</label>
                
                {/* Drag and Drop Zone */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition ${
                    dragActive
                      ? "border-amber-600 bg-amber-50"
                      : "border-gray-300 hover:border-amber-400"
                  }`}
                >
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required
                  />
                  <CloudUpload className={`w-12 h-12 mx-auto mb-4 ${dragActive ? "text-amber-600" : "text-gray-400"}`} />
                  <p className="text-gray-700 font-medium mb-1">
                    {uploadForm.file ? uploadForm.file.name : "Drop your file here or click to browse"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Supported: PDF, DOCX, PPTX, Images, Excel (Max 10MB)
                  </p>
                </div>
              </div>

              <button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full py-3 bg-gradient-to-r from-amber-700 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {uploading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </span>
                ) : (
                  "Upload Resource"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && selectedResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{selectedResource.title}</h2>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
                <p className="text-gray-600">{selectedResource.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Course</h3>
                  <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm font-medium border border-amber-200">
                    {selectedResource.course}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">File Type</h3>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                    {getFileType(selectedResource.file_path)}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Uploaded By</h3>
                <p className="text-gray-600">{selectedResource.uploaded_by || "Anonymous"}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Upload Date</h3>
                <p className="text-gray-600">
                  {new Date(selectedResource.uploaded_at || selectedResource.uploadDate).toLocaleDateString()}
                </p>
              </div>

              <button
                onClick={() => {
                  handleDownload(
                    selectedResource.resource_id || selectedResource.id,
                    selectedResource.title
                  )
                  setShowPreviewModal(false)
                }}
                className="w-full py-3 bg-gradient-to-r from-amber-700 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Resource
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}