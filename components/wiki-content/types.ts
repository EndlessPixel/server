import type React from "react"

export interface WikiContentProps {
  currentArticle: string
}

export interface ArticleStats {
  likes: number
  skim: number
}

export interface ArticleData {
  title: string
  category: string
  icon: any
  lastUpdated: string
  author: string
  readTime: string
  content: React.ReactNode
}
