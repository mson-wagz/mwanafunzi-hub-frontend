import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { User, Mail, Lock, GraduationCap, Shield, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react"

export default function SignUp() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("student")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")
    try {
      const response = await fetch("https://mwanafunzi-hub-backend.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, role }),
      })
      const data = await response.json()
      if (response.ok) {
        setSuccess("Signup successful! Redirecting...")
        // Store token and role if provided by backend
        if (data.token) localStorage.setItem("token", data.token)
        localStorage.setItem("role", role)
        
        setTimeout(() => {
          if (role === "admin") {
            navigate("/admin-dashboard")
          } else {
            navigate("/profile")
          }
        }, 1200)
      } else {
        setError(data.error || "Signup failed")
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-700 to-orange-600 rounded-2xl mb-4 shadow-lg">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent mb-2">
            Join Mwanafunzi Hub
          </h1>
          <p className="text-gray-600">Create your account to get started</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-amber-100">
          {/* Alerts */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Choose Your Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  role === "student"
                    ? "border-amber-600 bg-amber-50 shadow-md"
                    : "border-gray-200 hover:border-amber-300 bg-white"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <GraduationCap className={`w-8 h-8 ${role === "student" ? "text-amber-700" : "text-gray-400"}`} />
                  <span className={`font-semibold text-sm ${role === "student" ? "text-amber-900" : "text-gray-600"}`}>
                    Student
                  </span>
                </div>
                {role === "student" && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle className="w-5 h-5 text-amber-700" />
                  </div>
                )}
              </button>

              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  role === "admin"
                    ? "border-amber-600 bg-amber-50 shadow-md"
                    : "border-gray-200 hover:border-amber-300 bg-white"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Shield className={`w-8 h-8 ${role === "admin" ? "text-amber-700" : "text-gray-400"}`} />
                  <span className={`font-semibold text-sm ${role === "admin" ? "text-amber-900" : "text-gray-600"}`}>
                    Admin
                  </span>
                </div>
                {role === "admin" && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle className="w-5 h-5 text-amber-700" />
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter your username"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your.email@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Create a strong password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-amber-700 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-amber-700 font-semibold hover:text-amber-800 transition"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}