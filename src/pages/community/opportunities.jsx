import Navigation from "@/components/navigation";
import React, { useState } from "react";
import { Search, Filter, TrendingUp, Briefcase, Code, GraduationCap, ExternalLink, Plus, X } from "lucide-react";
import opportunitiesData from "./data/opportunities.json"; // 👈 Direct JSON import

const FILTERS = ["Internship", "Hackathon", "Job", "Scholarship", "Workshop"];

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState(opportunitiesData || []); // 👈 Use imported JSON as initial state
  const [filter, setFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    company: "",
    tags: "",
    link: "",
    description: "",
  });

  const filtered = opportunities
    .filter((o) => !filter || o.tags.includes(filter))
    .filter((o) =>
      !searchQuery ||
      o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "recent") return b.id - a.id;
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return 0;
    });

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = () => {
    if (!form.title || !form.company || !form.tags || !form.link) return;
    setOpportunities([
      ...opportunities,
      {
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()),
        id: Date.now(),
      },
    ]);
    setForm({ title: "", company: "", tags: "", link: "", description: "" });
    setShowForm(false);
  };

  const getTagIcon = (tag) => {
    if (tag.includes("Internship")) return <Briefcase className="w-3 h-3" />;
    if (tag.includes("Hackathon")) return <Code className="w-3 h-3" />;
    if (tag.includes("Job")) return <TrendingUp className="w-3 h-3" />;
    return <GraduationCap className="w-3 h-3" />;
  };

  const stats = {
    total: opportunities.length,
    internships: opportunities.filter(o => o.tags.includes("Internship")).length,
    jobs: opportunities.filter(o => o.tags.includes("Job")).length,
    hackathons: opportunities.filter(o => o.tags.includes("Hackathon")).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Navigation />

      <section className="max-w-7xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent mb-4">
            Discover Your Next Opportunity
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Connect with internships, jobs, hackathons, and educational resources shared by the community
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-amber-600">
            <div className="text-3xl font-bold text-amber-700">{stats.total}</div>
            <div className="text-gray-600 text-sm mt-1">Total Opportunities</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-600">
            <div className="text-3xl font-bold text-green-700">{stats.internships}</div>
            <div className="text-gray-600 text-sm mt-1">Internships</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-600">
            <div className="text-3xl font-bold text-orange-700">{stats.jobs}</div>
            <div className="text-gray-600 text-sm mt-1">Job Openings</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-amber-500">
            <div className="text-3xl font-bold text-amber-600">{stats.hackathons}</div>
            <div className="text-gray-600 text-sm mt-1">Hackathons</div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, company, or tags..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-600 outline-none"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer"
              >
                <option value="recent">Most Recent</option>
                <option value="title">Alphabetical</option>
              </select>
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg flex items-center gap-2 font-semibold"
            >
              {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {showForm ? "Cancel" : "Post Opportunity"}
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(filter === f ? "" : f)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  filter === f
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {f}
              </button>
            ))}
            {filter && (
              <button
                onClick={() => setFilter("")}
                className="px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-600 hover:bg-red-200"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>

        {/* Post Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border-2 border-blue-100">
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Share an Opportunity
            </h3>
            <div className="space-y-4">
              <input name="title" value={form.title} onChange={handleFormChange} placeholder="Title *" className="w-full px-4 py-3 border rounded-xl" />
              <input name="company" value={form.company} onChange={handleFormChange} placeholder="Company/Organization *" className="w-full px-4 py-3 border rounded-xl" />
              <textarea name="description" value={form.description} onChange={handleFormChange} placeholder="Description" rows="3" className="w-full px-4 py-3 border rounded-xl resize-none" />
              <input name="tags" value={form.tags} onChange={handleFormChange} placeholder="Tags * (comma separated)" className="w-full px-4 py-3 border rounded-xl" />
              <input name="link" value={form.link} onChange={handleFormChange} placeholder="Application Link *" className="w-full px-4 py-3 border rounded-xl" />
              <button onClick={handleFormSubmit} className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold">
                Submit Opportunity
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="mb-4 text-gray-600 font-medium">
          Showing {filtered.length} {filtered.length === 1 ? "opportunity" : "opportunities"}
        </div>

        <div className="grid gap-6">
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No opportunities found</h3>
              <p className="text-gray-600">Try adjusting your filters or search query</p>
            </div>
          ) : (
            filtered.map((opp) => (
              <div
                key={opp.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 hover:text-blue-600">{opp.title}</h3>
                      <div className="flex items-center gap-2 text-gray-600 mb-3">
                        <Briefcase className="w-4 h-4" />
                        <span className="font-medium">{opp.company}</span>
                      </div>
                      {opp.description && <p className="text-gray-600 mb-4">{opp.description}</p>}
                      <div className="flex flex-wrap gap-2">
                        {opp.tags.map((tag, i) => (
                          <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                            {getTagIcon(tag)}
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <a
                      href={opp.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg font-semibold whitespace-nowrap"
                    >
                      Apply Now
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
