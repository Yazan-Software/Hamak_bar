'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Loader2, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

const emptyProduct = {
  name: '',
  description: '',
  price: 0,
  stock_quantity: 0,
  category: '',
  is_active: true,
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState(emptyProduct)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('name')
    setProducts(data ?? [])
    setLoading(false)
  }

  useEffect(() => { void fetchProducts() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyProduct)
    setDialogOpen(true)
  }

  const openEdit = (product: Product) => {
    setEditing(product)
    setForm({
      name: product.name,
      description: product.description ?? '',
      price: product.price,
      stock_quantity: product.stock_quantity,
      category: product.category ?? '',
      is_active: product.is_active,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    if (editing) {
      const { error } = await supabase.from('products').update(form).eq('id', editing.id)
      if (error) { toast.error('Opslaan mislukt'); setSaving(false); return }
      toast.success('Product bijgewerkt')
    } else {
      const { error } = await supabase.from('products').insert(form)
      if (error) { toast.error('Aanmaken mislukt'); setSaving(false); return }
      toast.success('Product aangemaakt')
    }
    setSaving(false)
    setDialogOpen(false)
    void fetchProducts()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Weet je zeker dat je dit product wilt verwijderen?')) return
    await supabase.from('products').delete().eq('id', id)
    toast.success('Product verwijderd')
    void fetchProducts()
  }

  const adjustStock = async (id: string, delta: number) => {
    const product = products.find((p) => p.id === id)
    if (!product) return
    const newQty = Math.max(0, product.stock_quantity + delta)
    await supabase.from('products').update({ stock_quantity: newQty }).eq('id', id)
    void fetchProducts()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-playfair text-3xl font-bold text-[#FAFAFA]">Producten</h1>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Nieuw Product
        </Button>
      </div>

      <div className="bg-[#111111] border border-[#2A2A2A] rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2A2A2A] text-[#A0A0A0]">
              {['Naam', 'Categorie', 'Prijs', 'Voorraad', 'Status', 'Acties'].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-[#A0A0A0]">Laden...</td></tr>
            ) : products.map((product) => (
              <tr key={product.id} className="border-b border-[#2A2A2A] last:border-0 hover:bg-[#1A1A1A]">
                <td className="px-4 py-3">
                  <p className="text-[#FAFAFA] font-medium">{product.name}</p>
                  {product.description && (
                    <p className="text-[#A0A0A0] text-xs truncate max-w-xs">{product.description}</p>
                  )}
                </td>
                <td className="px-4 py-3 text-[#A0A0A0]">{product.category ?? '–'}</td>
                <td className="px-4 py-3 text-[#C9A96E]">{formatPrice(product.price)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => void adjustStock(product.id, -1)}
                      className="w-5 h-5 rounded border border-[#2A2A2A] text-[#A0A0A0] hover:text-[#C9A96E] hover:border-[#C9A96E] flex items-center justify-center text-xs"
                    >
                      -
                    </button>
                    <span className={`font-medium ${product.stock_quantity === 0 ? 'text-red-400' : product.stock_quantity <= 5 ? 'text-orange-400' : 'text-[#FAFAFA]'}`}>
                      {product.stock_quantity}
                    </span>
                    <button
                      onClick={() => void adjustStock(product.id, 1)}
                      className="w-5 h-5 rounded border border-[#2A2A2A] text-[#A0A0A0] hover:text-[#C9A96E] hover:border-[#C9A96E] flex items-center justify-center text-xs"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={product.is_active ? 'default' : 'outline'}>
                    {product.is_active ? 'Actief' : 'Inactief'}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(product)}
                      className="p-1.5 rounded text-[#A0A0A0] hover:text-[#C9A96E] hover:bg-[#C9A96E]/10"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => void handleDelete(product.id)}
                      className="p-1.5 rounded text-[#A0A0A0] hover:text-red-400 hover:bg-red-400/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Product Bewerken' : 'Nieuw Product'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Naam</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>Beschrijving</Label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="mt-1 flex w-full rounded-md border border-[#2A2A2A] bg-[#111111] px-3 py-2 text-sm text-[#FAFAFA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E] resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Prijs (€)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Voorraad</Label>
                <Input
                  type="number"
                  value={form.stock_quantity}
                  onChange={(e) => setForm({ ...form, stock_quantity: parseInt(e.target.value) })}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label>Categorie</Label>
              <Input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="bijv. Pomade, Beard, Hair"
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDialogOpen(false)}>Annuleren</Button>
            <Button onClick={() => void handleSave()} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Opslaan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
