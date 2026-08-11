import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Mail, Lock, GraduationCap, Shield, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("student")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("https://mwanafunzi-hub-backend.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })
      const data = await response.json()
      if (response.ok) {
        setSuccess("Login successful! Redirecting...")
        
        // CRITICAL: Save the token to localStorage
        localStorage.setItem("token", data.token)
        
        // Store the role - use backend role if available, otherwise use selected role
        const userRole = data.user?.role || role
        localStorage.setItem("role", userRole)

        // ✅ Save user object so we can get the id later
        // ✅ Ensure the user_id is stored consistently
        // ✅ Ensure the user_id is stored consistently
        // ✅ Ensure the user_id is stored consistently
        const user = {
          id: data.user.user_id || data.user.id,  // support both cases
          username: data.user.username,
          email: data.user.email,
          name: data.user.full_name,
          role: data.user.role
        };
        
        localStorage.setItem("user", JSON.stringify(user));
        
        
        // Navigate based on role
        setTimeout(() => {
          if (userRole === "admin") {
            navigate("/admin-dashboard")
          } else {
            navigate("/profile")
          }
        }, 1200)
      } else {
        setError(data.error || "Login failed")
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = () => {
    window.location.href = "https://mwanafunzi-hub-backend.onrender.com/api/auth/google"
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
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to continue to Mwanafunzi Hub</p>
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

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            className="w-full flex items-center justify-center py-3 px-4 mb-6 border-2 border-gray-200 rounded-xl shadow-sm text-sm font-semibold bg-white hover:bg-gray-50 hover:border-amber-300 transition-all"
          >
            <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M21.35 11.1h-9.18v2.98h5.27c-.23 1.22-1.39 3.59-5.27 3.59-3.17 0-5.76-2.62-5.76-5.85s2.59-5.85 5.76-5.85c1.81 0 3.02.77 3.72 1.43l2.54-2.47C16.13 3.97 14.3 3 12.17 3 6.61 3 2.09 7.52 2.09 13.08s4.52 10.08 10.08 10.08c5.81 0 9.63-4.09 9.63-9.86 0-.66-.07-1.31-.2-1.9z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
            </div>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Sign in as
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
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
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

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-xs text-amber-700 hover:text-amber-800 font-medium transition"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
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
            </div>

            {/* Submit Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-amber-700 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-amber-700 font-semibold hover:text-amber-800 transition"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Protected by industry-standard encryption
        </p>
      </div>
    </div>
  )
}