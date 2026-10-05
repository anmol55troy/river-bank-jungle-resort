'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { getMediaList, uploadMedia } from '@/lib/services/media'
import type { Media } from '@/lib/types'

export interface GalleryItem {
  image: string | Media
  id?: string | null
}

export interface GalleryPickerProps {
  name: string
  defaultValue?: GalleryItem[] | null
  label?: string
}

export function GalleryPicker({
  name,
  defaultValue = [],
  label = 'Add Gallery Images',
}: GalleryPickerProps) {
  const [items, setItems] = useState<GalleryItem[]>(defaultValue || [])
  const [isOpen, setIsOpen] = useState(false)
  const [mediaList, setMediaList] = useState<Media[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [activeTab, setActiveTab] = useState<'browse' | 'upload'>('browse')

  const loadMedia = async (q = '') => {
    setLoading(true)
    try {
      const res = await getMediaList({ search: q, limit: 40 })
      setMediaList(res.docs)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleOpen = () => {
    setIsOpen(true)
    loadMedia(search)
  }

  const handleAddMedia = (media: Media) => {
    const id = Math.random().toString(36).substring(2, 10)
    setItems((prev) => [...prev, { image: media, id }])
    setIsOpen(false)
  }

  const handleRemove = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newItems.length) return
    const temp = newItems[index]
    newItems[index] = newItems[targetIndex]
    newItems[targetIndex] = temp
    setItems(newItems)
  }

  const handleUploadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setUploadError('')
    const form = e.currentTarget
    const formData = new FormData(form)
    const file = formData.get('file') as File

    if (!file || file.size === 0) {
      setUploadError('Please choose a file.')
      return
    }

    setUploading(true)
    try {
      const res = await uploadMedia(formData)
      if (res.success && res.media) {
        handleAddMedia(res.media)
        form.reset()
      } else {
        setUploadError(res.error || 'Upload failed.')
      }
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  // Generate serialized hidden inputs for each item in the gallery
  return (
    <div className="space-y-3">
      {/* Hidden input storing gallery items as JSON for standard form submission */}
      <input
        type="hidden"
        name={name}
        value={JSON.stringify(
          items.map((item) => ({
            image: typeof item.image === 'object' ? item.image.id : item.image,
            id: item.id || undefined,
          }))
        )}
      />

      {items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {items.map((item, idx) => {
            const mediaObj = typeof item.image === 'object' ? (item.image as Media) : null
            const url = mediaObj?.sizes?.thumbnail?.url || mediaObj?.url

            return (
              <div
                key={item.id || idx}
                className="group relative aspect-4/3 rounded-xl overflow-hidden border border-espresso/20 bg-cream"
              >
                {url ? (
                  <Image src={url} alt={mediaObj?.alt || 'Gallery image'} fill sizes="200px" className="object-cover" unoptimized />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-espresso/40">Image {idx + 1}</div>
                )}

                {/* Overlay actions */}
                <div className="absolute inset-0 bg-espresso/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <div className="flex justify-between items-center text-ivory text-[10px]">
                    <span>#{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemove(idx)}
                      className="p-1 hover:text-rose-300 transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, 'up')}
                      className="p-1 bg-white/20 hover:bg-white/40 disabled:opacity-30 rounded text-ivory cursor-pointer"
                      title="Move backward"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      disabled={idx === items.length - 1}
                      onClick={() => handleMove(idx, 'down')}
                      className="p-1 bg-white/20 hover:bg-white/40 disabled:opacity-30 rounded text-ivory cursor-pointer"
                      title="Move forward"
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="p-6 text-center border-2 border-dashed border-espresso/15 rounded-xl bg-white/40">
          <p className="text-xs text-espresso/60 mb-2">No gallery images added yet.</p>
        </div>
      )}

      <div>
        <Button type="button" variant="secondary" size="sm" onClick={handleOpen}>
          + {label}
        </Button>
      </div>

      {/* Media Picker Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add Image to Gallery" maxWidth="4xl">
        <div className="space-y-4">
          <div className="flex border-b border-espresso/15 gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('browse')}
              className={`pb-2 text-sm font-semibold border-b-2 cursor-pointer ${
                activeTab === 'browse' ? 'border-espresso text-espresso' : 'border-transparent text-espresso/60'
              }`}
            >
              Browse Library
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`pb-2 text-sm font-semibold border-b-2 cursor-pointer ${
                activeTab === 'upload' ? 'border-espresso text-espresso' : 'border-transparent text-espresso/60'
              }`}
            >
              Upload New
            </button>
          </div>

          {activeTab === 'browse' ? (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Search media..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  loadMedia(e.target.value)
                }}
                className="w-full rounded-lg border border-espresso/20 px-3.5 py-1.5 text-xs text-espresso bg-white"
              />

              {loading ? (
                <div className="py-12 text-center text-xs text-espresso/60">Loading...</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-[50vh] overflow-y-auto p-1">
                  {mediaList.map((m) => {
                    const thumb = m.sizes?.thumbnail?.url || m.url
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleAddMedia(m)}
                        className="group relative aspect-4/3 rounded-lg overflow-hidden border border-espresso/15 hover:border-espresso hover:ring-2 hover:ring-espresso/20 bg-cream cursor-pointer"
                      >
                        {thumb && (
                          <Image src={thumb} alt={m.alt || ''} fill sizes="200px" className="object-cover" unoptimized />
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-espresso/80 text-ivory text-[10px] p-1 truncate opacity-0 group-hover:opacity-100">
                          {m.alt || m.filename}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleUploadSubmit} className="space-y-4 max-w-lg mx-auto py-4">
              {uploadError && <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">{uploadError}</div>}
              <div>
                <label className="block text-xs font-semibold text-espresso mb-1">Image File</label>
                <input type="file" name="file" accept="image/*" required className="w-full text-xs border border-espresso/20 rounded-lg p-2 bg-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-espresso mb-1">Alt Text</label>
                <input type="text" name="alt" placeholder="Description of image" className="w-full text-xs border border-espresso/20 rounded-lg px-3 py-2 bg-white" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setActiveTab('browse')}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" isLoading={uploading}>
                  Upload & Add
                </Button>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </div>
  )
}
