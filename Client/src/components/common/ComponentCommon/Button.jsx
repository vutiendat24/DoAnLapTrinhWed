"use client"

import React from "react"
import { Button } from "@/components/ui/button"

export function AuthButton({ children, type = "submit", variant = "default", onClick, disabled }) {
  const baseClasses =
    variant === "default"
      ? "w-full bg-pink-500 hover:bg-pink-600 text-white"
      : "w-full border-pink-500 text-pink-500 hover:bg-pink-50"

  return (
    <Button type={type} variant={variant} className={baseClasses} onClick={onClick} disabled={disabled}>
      {children}
    </Button>
  )
}
