import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import toast from "react-hot-toast"
import { Eye, EyeOff, ShieldCheck, Loader2 } from "lucide-react"

export default function AdminLogin() {

  const navigate = useNavigate()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {

    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.post("/api/admin/login", {
        username,
        password
      })

      if (response.data.token) {
        localStorage.setItem("adminAuth", response.data.token)
        toast.success("Welcome back, Admin!")
        navigate("/admin")
      } else {
        toast.error("Invalid credentials")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }

  }

  return (

    <div className="min-h-screen bg-black flex items-center justify-center px-4">

      <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 p-8 sm:p-10 rounded-2xl w-full max-w-md shadow-2xl">

        {/* Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500/10 rounded-2xl mb-4">
            <ShieldCheck className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-amber-500 text-2xl font-serif tracking-wide">LaCasa</h1>
          <h2 className="text-white text-lg font-medium mt-1">Admin Panel</h2>
          <p className="text-gray-500 text-sm mt-1">Sign in to manage your restaurant</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="text-gray-400 text-sm mb-1.5 block">Username</label>
            <input
              type="text"
              placeholder="Enter admin username"
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
              required
              autoComplete="username"
              className="w-full p-3.5 rounded-xl bg-gray-800/80 border border-gray-700 text-white placeholder-gray-500 outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1.5 block">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full p-3.5 pr-12 rounded-xl bg-gray-800/80 border border-gray-700 text-white placeholder-gray-500 outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 py-3.5 rounded-xl font-semibold text-black disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing in...
              </>
            ) : "Sign In"}
          </button>

        </form>

        <p className="text-gray-600 text-xs text-center mt-6">
          Protected area — authorized personnel only
        </p>

      </div>

    </div>

  )

}