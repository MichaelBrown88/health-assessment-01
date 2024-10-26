'use client'

import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface ContactFormProps {
  onSubmit: (name: string, email: string) => void
  error: string | null
}

export const ContactForm: React.FC<ContactFormProps> = ({ onSubmit, error }) => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(name, email)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="block text-left text-sm font-medium text-[#f7f7f7]">
          Name
        </Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="block text-left text-sm font-medium text-[#f7f7f7]">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full"
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button type="submit" variant="deepSpaceBorder" className="w-full">Submit</Button>
    </form>
  )
}
