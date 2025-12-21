'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import NavAuth from '@/components/NavAuth'
import { Eye, EyeOff } from 'lucide-react'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak cocok')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Terjadi kesalahan')
      }

      // Auto sign in after successful sign up
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      })

      if (result?.error) {
        setError(result.error)
      } else {
        router.push('/') // Redirect after successful login
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <NavAuth />
      <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background: `
            radial-gradient(circle at 20% 30%, rgba(144, 238, 144, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(173, 216, 230, 0.3) 0%, transparent 50%),
            linear-gradient(135deg, #e8f5e8 0%, #f0f8ff 100%)
          `
          }}
        />
        {/* Background Fruit Images */}
        <div className="absolute -top-25 left-0 pointer-events-none overflow-hidden">
          <img
            src="/loginLeft.png"
            alt="Fruits decoration"
            className="object-cover"
            style={{ width: '800px' }}
          />
        </div>

        <div className="absolute -bottom-40 right-0 pointer-events-none overflow-hidden">
          <img
            src="/loginRight.png"
            alt="Fruits decoration"
            className="object-cover"
            style={{ width: '800px' }}
          />
        </div>

        {/* Register Form Container */}
        <div className="relative z-5 flex items-center justify-center w-full h-full">
          <div
            className="bg-white rounded-xl shadow-lg p-10 border border-gray-100"
            style={{ width: '500px', minHeight: 'auto' }}
          >
            <div className="flex flex-col justify-center h-full space-y-6">
              {/* Header */}
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Daftar ke Panganku Fresh
                </h1>
                <p className="text-gray-600 text-sm">
                  Bergabunglah untuk belanja kebutuhan segar Anda
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Input */}
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="peer w-full px-4 pt-6 pb-2 border border-gray-300 rounded-lg 
    focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-900"
                    placeholder=""
                  />
                  <label
                    htmlFor="name"
                    className="absolute left-4 top-2 text-xs text-gray-500 transition-all 
    peer-focus:text-gray-500"
                  >
                    Nama Lengkap
                  </label>
                </div>

                {/* Email Input */}
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="peer w-full px-4 pt-6 pb-2 border border-gray-300 rounded-lg 
    focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-900"
                    placeholder=""
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-4 top-2 text-xs text-gray-500 transition-all 
    peer-focus:text-gray-500"
                  >
                    Email atau Nomor HP
                  </label>
                  <p className="text-sm text-gray-400 ml-1 mt-1">
                    Contoh: email@pangankufresh.com
                  </p>
                </div>

                {/* Password Input */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="peer w-full px-4 pt-6 pb-2 pr-12 border border-gray-300 rounded-lg 
    focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-900"
                    placeholder=""
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-4 top-2 text-xs text-gray-500 transition-all 
    peer-focus:text-gray-500"
                  >
                    Password
                  </label>

                  {/* Toggle show/hide */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Confirm Password Input */}
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="peer w-full px-4 pt-6 pb-2 pr-12 border border-gray-300 rounded-lg 
    focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-900"
                    placeholder=""
                  />
                  <label
                    htmlFor="confirmPassword"
                    className="absolute left-4 top-2 text-xs text-gray-500 transition-all 
    peer-focus:text-gray-500"
                  >
                    Konfirmasi Password
                  </label>

                  {/* Toggle show/hide */}
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Register Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-5 rounded-xl transition-colors duration-200 text-base shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Mendaftarkan...' : 'Daftar'}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Atau Daftar dengan</span>
                </div>
              </div>

              {/* Google Register Button */}
              <button
                onClick={() => signIn("google", { callbackUrl: "/" })}
                className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium py-4 px-5 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-sm hover:shadow-md text-base"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>

              {/* Sign In Link */}
              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  Sudah punya akun?{" "}
                  <Link
                    href="/auth/signin"
                    className="text-green-600 hover:text-green-700 font-semibold transition-colors"
                  >
                    Masuk di sini
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}