export interface User {
  id: number
  email: string
  name: string
  phone?: string
  is_active: boolean
  created_at: string
}

export interface Gallery {
  id: number
  name: string
  shooting_date: string
  is_public: boolean
  is_password_protected: boolean
  cover_photo_id?: number
  view_count: number
  owner_id: number
  created_at: string
  updated_at?: string
}

export interface Scene {
  id: number
  name: string
  order_index: number
  gallery_id: number
  created_at: string
  updated_at?: string
}

export interface Photo {
  id: number
  filename: string
  original_filename: string
  file_path: string
  file_size: number
  mime_type: string
  width?: number
  height?: number
  order_index: number
  scene_id: number
  created_at: string
  url?: string
  is_favorite?: boolean
}

export interface SceneWithPhotos extends Scene {
  photos: Photo[]
}

export interface GalleryWithScenes extends Gallery {
  scenes: SceneWithPhotos[]
}

export interface ContactMessage {
  id: number
  name: string
  email: string
  message: string
  is_read: boolean
  created_at: string
}

export interface ApiError {
  detail: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
}

export interface FavoriteResponse {
  is_favorite: boolean
}
