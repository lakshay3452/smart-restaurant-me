import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function AdminLogin() {

  const navigate = useNavigate()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e) => {

    e.preventDefault()

    if (username === "admin" && password === "123456") {
      localStorage.setItem("adminAuth", "true")
      navigate("/admin")
    } else {
      alert("Invalid admin credentials")
    }

  }

  return (

    <div className="min-h-screen bg-black flex items-center justify-center px-4">

      <div className="bg-gray-900 p-8 rounded-xl w-full max-w-md">

        <h2 className="text-3xl text-white font-serif mb-6 text-center">
          Admin Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 outline-none"
          />

          <button
            type="submit"
            className="w-full bg-amber-500 py-3 rounded-lg font-semibold text-black"
          >
            Login
          </button>

        </form>

      </div>

    </div>

  )

}