export interface Repository {
  name: string
  fullName: string
  description: string
  language: string
  stars: number
  url: string
  hasGoodDocs: boolean
  maintainerActive: boolean
}

export interface Issue {
  id: string
  title: string
  url: string
  repository: Repository
  labels: string[]
  createdAt: Date
  updatedAt: Date
  commentsCount: number
  qualityScore: number
  difficulty?: 'beginner' | 'intermediate'
  estimatedTime?: string
}

export interface SearchOptions {
  language?: string
  labels?: string[]
  limit?: number
}
