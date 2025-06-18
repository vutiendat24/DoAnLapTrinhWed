import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AuthInput({ id, label, type = "text", placeholder, required = false, rightElement }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
        {rightElement}
      </div>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        className="focus:ring-pink-500 focus:border-pink-500"
        required={required}
      />
    </div>
  )
}
