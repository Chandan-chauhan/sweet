"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import CyberBackground from "@/components/CyberBackground"
import { Sparkles, LogOut, Plus, Pencil, Trash2, Package, Shield, Mail, Lock, X } from "lucide-react"

type Sweet = {
  id: string
  name: string
  description: string
  price: string
  category: string
  image_url: string
  stock: number
}

export default function AdminPage() {
  const [products, setProducts] = useState<Sweet[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Sweet | null>(null)
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [loginLoading, setLoginLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "candy",
    image_url: "",
    stock: 0
  })
  const router = useRouter()

  useEffect(() => {
    checkAdmin()
  }, [])

  async function checkAdmin() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      setLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role === 'admin') {
      setIsAdmin(true)
      fetchProducts()
    } else {
      setLoading(false)
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginError("")
    setLoginLoading(true)

    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    })

    if (error) {
      setLoginError(error.message)
      setLoginLoading(false)
      return
    }

    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      if (profile?.role === 'admin') {
        setIsAdmin(true)
        setLoginLoading(false)
        fetchProducts()
      } else {
        setLoginError("You do not have admin privileges")
        await supabase.auth.signOut()
        setLoginLoading(false)
      }
    }
  }

  async function fetchProducts() {
    setLoading(true)
    const res = await fetch("/api/admin/products")
    if (res.ok) {
      const data = await res.json()
      setProducts(data)
    }
    setLoading(false)
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  async function uploadImage(): Promise<string | null> {
    if (!imageFile) return null

    setUploading(true)
    const supabase = createClient()
    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, imageFile)

    if (uploadError) {
      console.error('Error uploading image:', uploadError)
      setUploading(false)
      return null
    }

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath)

    setUploading(false)
    return data.publicUrl
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    let imageUrl = formData.image_url

    if (imageFile) {
      const uploadedUrl = await uploadImage()
      if (uploadedUrl) {
        imageUrl = uploadedUrl
      } else {
        alert("Failed to upload image")
        return
      }
    }

    const dataToSubmit = { ...formData, image_url: imageUrl }
    
    if (editingProduct) {
      const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSubmit)
      })
      
      if (res.ok) {
        fetchProducts()
        setShowForm(false)
        setEditingProduct(null)
        resetForm()
      }
    } else {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSubmit)
      })
      
      if (res.ok) {
        fetchProducts()
        setShowForm(false)
        resetForm()
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return
    
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "DELETE"
    })
    
    if (res.ok) {
      fetchProducts()
    }
  }

  function handleEdit(product: Sweet) {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image_url: product.image_url,
      stock: product.stock
    })
    setImagePreview(product.image_url)
    setImageFile(null)
    setShowForm(true)
  }

  function resetForm() {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "candy",
      image_url: "",
      stock: 0
    })
    setImageFile(null)
    setImagePreview(null)
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setIsAdmin(false)
    setProducts([])
    setLoginEmail("")
    setLoginPassword("")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center relative overflow-hidden">
        <CyberBackground />
        <div className="text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 animate-pulse mb-4">
            <Package className="w-8 h-8 text-cyan-400" />
          </div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4 relative overflow-hidden">
        <CyberBackground />
        <div className="w-full max-w-md relative z-10">
          <div className="glass-card rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 mb-6 animate-glow">
                <Shield className="w-8 h-8 text-black" />
              </div>
              <h1 className="text-3xl font-bold gradient-text mb-2">Admin Portal</h1>
              <p className="text-slate-400">Enter your admin credentials</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300 text-sm font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="pl-12 bg-slate-900/50 border-cyan-500/20 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 h-12 rounded-xl input-glow"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300 text-sm font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="pl-12 bg-slate-900/50 border-cyan-500/20 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 h-12 rounded-xl input-glow"
                  />
                </div>
              </div>
              {loginError && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  {loginError}
                </div>
              )}
              <Button 
                type="submit" 
                disabled={loginLoading}
                className="w-full cyber-button text-black font-semibold h-12 rounded-xl"
              >
                {loginLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Authenticating...
                  </span>
                ) : "Login to Admin"}
              </Button>
              <div className="text-center pt-4 border-t border-cyan-500/20">
                <p className="text-sm text-slate-500 mb-3">Need an admin account?</p>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/setup")}
                  className="border-cyan-500/30 bg-transparent text-cyan-400 hover:bg-cyan-500/10"
                >
                  Create Admin Account
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#030712] relative overflow-hidden">
      <CyberBackground />
      
      <nav className="glass-card sticky top-0 z-50 border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center animate-glow">
              <Shield className="w-5 h-5 text-black" />
            </div>
            <span className="text-2xl font-bold gradient-text">Admin Dashboard</span>
          </div>
          <Button 
            onClick={handleLogout} 
            variant="outline" 
            className="border-cyan-500/30 bg-transparent text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-100">Product Management</h2>
            <p className="text-slate-500">Manage your store inventory</p>
          </div>
          <Button 
            onClick={() => {
              setShowForm(!showForm)
              setEditingProduct(null)
              resetForm()
            }}
            className={showForm ? "border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20" : "cyber-button text-black font-semibold"}
            variant={showForm ? "outline" : "default"}
          >
            {showForm ? (
              <>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </>
            )}
          </Button>
        </div>

        {showForm && (
          <div className="glass-card rounded-2xl p-8 mb-10">
            <h3 className="text-xl font-bold text-slate-100 mb-6">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-300">Product Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-slate-900/50 border-cyan-500/20 text-slate-100 focus:border-cyan-400 h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-slate-300">Category</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-900/50 border border-cyan-500/20 text-slate-100 rounded-xl px-4 h-12 focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="candy">Candy</option>
                    <option value="chocolate">Chocolate</option>
                    <option value="cake">Cake</option>
                    <option value="cupcake">Cupcake</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-300">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  className="bg-slate-900/50 border-cyan-500/20 text-slate-100 focus:border-cyan-400 h-12 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-slate-300">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="bg-slate-900/50 border-cyan-500/20 text-slate-100 focus:border-cyan-400 h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock" className="text-slate-300">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock.toString()}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    required
                    className="bg-slate-900/50 border-cyan-500/20 text-slate-100 focus:border-cyan-400 h-12 rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image" className="text-slate-300">Product Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="bg-slate-900/50 border-cyan-500/20 text-slate-100 cursor-pointer file:bg-cyan-500/20 file:text-cyan-400 file:border-0 file:mr-4 file:px-4 file:py-2 file:rounded-lg"
                />
                {imagePreview && (
                  <div className="mt-4 relative w-48 h-48 rounded-xl overflow-hidden border-2 border-cyan-500/30">
                    <Image 
                      src={imagePreview} 
                      alt="Preview" 
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
              <Button 
                type="submit" 
                disabled={uploading}
                className="w-full cyber-button text-black font-semibold h-12 rounded-xl"
              >
                {uploading ? "Uploading..." : editingProduct ? "Update Product" : "Add Product"}
              </Button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 animate-pulse mb-4">
              <Package className="w-8 h-8 text-cyan-400" />
            </div>
            <p className="text-slate-400">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="glass-card rounded-2xl overflow-hidden">
                <div className="relative w-full h-48 bg-gradient-to-br from-slate-800/50 to-slate-900/50 flex items-center justify-center overflow-hidden">
                  {product.image_url && !product.image_url.match(/[\u{1F300}-\u{1F9FF}]/u) ? (
                    <Image 
                      src={product.image_url} 
                      alt={product.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-6xl">{product.image_url || "&#127852;"}</span>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-100 mb-2">{product.name}</h3>
                  <p className="text-slate-400 text-sm mb-2 line-clamp-2">{product.description}</p>
                  <p className="text-xs text-slate-500 mb-4">Category: {product.category}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold gradient-text">${product.price}</span>
                    <span className="text-xs text-slate-500 px-2 py-1 rounded-full bg-slate-800">Stock: {product.stock}</span>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleEdit(product)}
                      variant="outline"
                      className="flex-1 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(product.id)}
                      variant="outline"
                      className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
