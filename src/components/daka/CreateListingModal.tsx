'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDakaStore, type Category } from '@/lib/store'
import { UNITS } from '@/lib/constants'
import { toast } from '@/hooks/use-toast'

export function CreateListingModal() {
  const { modal, closeModal, categories, setListings, setStats, setQuartiers, viewState, selectedQuartier, sortBy } = useDakaStore()
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [unit, setUnit] = useState('')
  const [categoryId, setCategoryId] = useState('')

  const handleSubmit = async () => {
    if (!title || !price || !unit || !categoryId) {
      toast({ title: 'Champs requis', description: 'Remplissez tous les champs obligatoires', variant: 'destructive' })
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/listings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, price, unit, categoryId })
      })
      const data = await res.json()
      if (!res.ok) {
        toast({ title: 'Erreur', description: data.error, variant: 'destructive' })
        return
      }

      toast({ title: 'Annonce publiée !', description: `${title} est maintenant en ligne` })
      closeModal()

      // Refresh listings
      const currentView = useDakaStore.getState().viewState
      const currentQuartier = useDakaStore.getState().selectedQuartier
      const currentSort = useDakaStore.getState().sortBy
      const params = new URLSearchParams()
      if (currentView.view === 'category') params.set('category', currentView.slug)
      if (currentQuartier) params.set('quartier', currentQuartier)
      params.set('sort', currentSort)

      const listingsRes = await fetch(`/api/listings?${params.toString()}`)
      const listingsData = await listingsRes.json()
      useDakaStore.getState().setListings(listingsData.listings)
      useDakaStore.getState().setStats(listingsData.stats)
      useDakaStore.getState().setQuartiers(listingsData.quartiers)

      // Reset form
      setTitle('')
      setDescription('')
      setPrice('')
      setUnit('')
      setCategoryId('')
    } catch {
      toast({ title: 'Erreur', description: 'Erreur lors de la publication', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={modal.type === 'createListing'} onOpenChange={() => closeModal()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Publier une annonce</DialogTitle>
          <DialogDescription>Ajoutez votre produit sur DakaMarket</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="listing-title">Nom du produit *</Label>
            <Input
              id="listing-title"
              placeholder="Ex: Viande de bœuf frais"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="listing-desc">Description</Label>
            <Textarea
              id="listing-desc"
              placeholder="Décrivez votre produit..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="listing-price">Prix (FCFA) *</Label>
              <Input
                id="listing-price"
                type="number"
                placeholder="5000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Unité *</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir" />
                </SelectTrigger>
                <SelectContent>
                  {UNITS.map((u) => (
                    <SelectItem key={u} value={u}>{u}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Catégorie *</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat: Category) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full" onClick={handleSubmit} disabled={loading} size="lg">
            {loading ? 'Publication...' : 'Publier l\'annonce'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
