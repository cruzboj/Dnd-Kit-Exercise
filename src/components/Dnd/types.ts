import type { ReactNode } from "react";

export interface Container {
  id: string
  title: string
  items: Item[]
}

export interface Item {
  id: string
  content: ReactNode
}
