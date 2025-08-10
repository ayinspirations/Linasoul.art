"use client"

import { ReactNode } from "react"
import { CartProvider } from "./cart/CartProvider"

export default function Providers({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>
}
