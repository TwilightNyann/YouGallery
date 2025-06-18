const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor() {
    this.baseURL = API_BASE_URL
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("access_token")
    }
    console.log("ApiClient initialized with baseURL:", this.baseURL)
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", token)
    }
    console.log("Token set successfully")
  }

  clearToken() {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token")
    }
    console.log("Token cleared")
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    console.log(`Making ${options.method || "GET"} request to ${url}`)

    const headers: HeadersInit = {
      ...options.headers,
    }

    // Add ngrok-skip-browser-warning header for ngrok
    if (this.baseURL.includes("ngrok")) {
      headers["ngrok-skip-browser-warning"] = "true"
    }

    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json"
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
      console.log("Using auth token:", this.token.substring(0, 10) + "...")
    } else {
      console.log("No auth token available")
    }

    const config: RequestInit = {
      ...options,
      headers,
      mode: "cors",
      credentials: "omit",
    }

    try {
      console.log("Request config:", {
        method: config.method,
        headers: config.headers,
        url,
      })

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      console.log(`Response received: ${response.status} ${response.statusText}`)

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`

        try {
          const errorData = await response.json()
          console.log("Error response data:", errorData)

          if (errorData.detail && Array.isArray(errorData.detail)) {
            errorMessage = errorData.detail
              .map((err: any) => `${err.loc ? err.loc.join(".") + ": " : ""}${err.msg}`)
              .join("; ")
          } else if (errorData.detail) {
            errorMessage = errorData.detail
          } else if (errorData.message) {
            errorMessage = errorData.message
          }
        } catch (e) {
          console.log("Could not parse error response as JSON")
          errorMessage = response.statusText || errorMessage
        }

        if (response.status === 401) {
          console.log("401 Unauthorized - clearing token")
          this.clearToken()
          if (typeof window !== "undefined") {
            window.location.href = "/login"
          }
        }

        throw new Error(errorMessage)
      }

      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        try {
          const data = await response.json()
          console.log("Response data:", data)
          return data
        } catch (e) {
          console.log("Response was not valid JSON")
          return null as unknown as T
        }
      }

      console.log("Response has no JSON content")
      return null as unknown as T
    } catch (error) {
      console.error("Request failed:", error)

      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(`Cannot connect to API server at ${url}. Please check if the server is running.`)
      }

      throw error
    }
  }

  // Test connection method
  async testConnection(): Promise<{ success: boolean; details: any }> {
    try {
      console.log(`Testing connection to ${this.baseURL}/api/health`)

      const response = await fetch(`${this.baseURL}/api/health`, {
        method: "GET",
        mode: "cors",
        headers: {
          Accept: "application/json",
          ...(this.baseURL.includes("ngrok") ? { "ngrok-skip-browser-warning": "true" } : {}),
        },
      })

      console.log("Health check response:", response.status, response.statusText)

      return {
        success: response.ok,
        details: {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
        },
      }
    } catch (error) {
      console.error("Health check failed:", error)

      return {
        success: false,
        details: {
          error: error instanceof Error ? error.message : String(error),
        },
      }
    }
  }

  // Auth endpoints
  async register(userData: {
    name: string
    email: string
    password: string
    phone?: string
  }) {
    return this.request<{ message: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async login(credentials: { email: string; password: string }) {
    console.log("Attempting login with:", { email: credentials.email })

    const response = await this.request<{ access_token: string; token_type: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })

    console.log("Login successful, setting token")
    this.setToken(response.access_token)
    return response
  }

  async getCurrentUser() {
    return this.request("/api/auth/me")
  }

  async logout() {
    this.clearToken()
  }

  // User profile endpoints
  async updateProfile(userData: {
    name?: string
    email?: string
    phone?: string
  }) {
    return this.request("/api/users/profile", {
      method: "PUT",
      body: JSON.stringify(userData),
    })
  }

  async updatePassword(passwordData: {
    current_password: string
    new_password: string
  }) {
    return this.request("/api/users/password", {
      method: "PUT",
      body: JSON.stringify(passwordData),
    })
  }

  async deleteAccount() {
    console.log("Attempting to delete account")
    return this.request("/api/users/account", {
      method: "DELETE",
    })
  }

  // Gallery endpoints
  async createGallery(galleryData: {
    name: string
    shooting_date: string
    is_public?: boolean
    is_password_protected?: boolean
    password?: string
  }) {
    return this.request("/api/galleries/", {
      method: "POST",
      body: JSON.stringify(galleryData),
    })
  }

  async getGalleries() {
    return this.request("/api/galleries/")
  }

  async getGallery(galleryId: number) {
    return this.request(`/api/galleries/${galleryId}`)
  }

  async getPublicGallery(galleryId: number) {
    console.log(`🔍 Getting public gallery ${galleryId}`)
    try {
      const result = await this.request(`/api/galleries/${galleryId}/public`)
      console.log(`✅ Successfully got public gallery ${galleryId}:`, result)
      return result
    } catch (error) {
      console.error(`❌ Failed to get public gallery ${galleryId}:`, error)
      throw error
    }
  }

  async updateGallery(
    galleryId: number,
    galleryData: {
      name?: string
      shooting_date?: string
      is_public?: boolean
      is_password_protected?: boolean
      password?: string
    },
  ) {
    return this.request(`/api/galleries/${galleryId}`, {
      method: "PUT",
      body: JSON.stringify(galleryData),
    })
  }

  async deleteGallery(galleryId: number) {
    console.log(`🗑️ apiClient.deleteGallery: STARTED for gallery ID: ${galleryId}`)
    console.log(`🗑️ Base URL: ${this.baseURL}`)
    console.log(`🗑️ Full URL will be: ${this.baseURL}/api/galleries/${galleryId}`)
    console.log(`🗑️ Has auth token: ${!!this.token}`)

    try {
      const result = await this.request(`/api/galleries/${galleryId}`, {
        method: "DELETE",
      })

      console.log(`✅ apiClient.deleteGallery: SUCCESS for gallery ID: ${galleryId}`)
      console.log(`✅ Result:`, result)
      return result
    } catch (error) {
      console.error(`❌ apiClient.deleteGallery: ERROR for gallery ID: ${galleryId}:`, error)
      throw error
    }
  }

  async checkGalleryPassword(galleryId: number, password: string) {
    return this.request<{ access_granted: boolean }>(`/api/galleries/${galleryId}/check-password`, {
      method: "POST",
      body: JSON.stringify({ password }),
    })
  }

  // Scene endpoints
  async getScenes(galleryId: number) {
    return this.request(`/api/galleries/${galleryId}/scenes`)
  }

  async getPublicScenes(galleryId: number) {
    return this.request(`/api/galleries/${galleryId}/scenes/public`)
  }

  async createScene(galleryId: number, sceneData: { name: string; order_index?: number }) {
    return this.request(`/api/galleries/${galleryId}/scenes`, {
      method: "POST",
      body: JSON.stringify(sceneData),
    })
  }

  async updateScene(sceneId: number, sceneData: { name?: string; order_index?: number }) {
    return this.request(`/api/galleries/scenes/${sceneId}`, {
      method: "PUT",
      body: JSON.stringify(sceneData),
    })
  }

  async deleteScene(sceneId: number) {
    return this.request(`/api/galleries/scenes/${sceneId}`, {
      method: "DELETE",
    })
  }

  // Photo endpoints
  async uploadPhoto(sceneId: number, file: File) {
    const formData = new FormData()
    formData.append("files", file)

    return this.request(`/api/galleries/scenes/${sceneId}/photos/upload`, {
      method: "POST",
      body: formData,
    })
  }

  async getPhotos(sceneId: number) {
    return this.request(`/api/galleries/scenes/${sceneId}/photos`)
  }

  async getPublicScenePhotos(sceneId: number) {
    return this.request(`/api/galleries/scenes/${sceneId}/photos/public`)
  }

  async deletePhoto(photoId: number) {
    return this.request(`/api/photos/${photoId}`, {
      method: "DELETE",
    })
  }

  async setGalleryCover(photoId: number) {
    console.log(`🖼️ Setting gallery cover for photo ${photoId}`)
    return this.request(`/api/photos/${photoId}/set-cover`, {
      method: "PUT",
    })
  }

  // Favorites methods
  async toggleFavorite(photoId: number, sessionId?: string) {
    console.log(`💖 Toggling favorite for photo ${photoId}, session: ${sessionId || "none"}`)
    try {
      const result = await this.request<{ is_favorite: boolean }>("/api/photos/favorites", {
        method: "POST",
        body: JSON.stringify({
          photo_id: photoId,
          session_id: sessionId,
        }),
      })
      console.log(`✅ Toggle favorite result:`, result)
      return result
    } catch (error) {
      console.error(`❌ Error toggling favorite:`, error)
      throw error
    }
  }

  async getUserFavorites(sessionId?: string) {
    console.log(`🔍 Getting user favorites, session: ${sessionId || "none"}`)
    const params = sessionId ? `?session_id=${sessionId}` : ""
    try {
      const result = await this.request<any[]>(`/api/photos/favorites${params}`)
      console.log(`✅ Got ${result.length} favorites`)
      return result
    } catch (error) {
      console.error(`❌ Error getting favorites:`, error)
      throw error
    }
  }

  async getGalleryFavorites(galleryId: number) {
    console.log(`🔍 Getting favorites for gallery ${galleryId}`)
    try {
      const result = await this.request<any[]>(`/api/galleries/${galleryId}/favorites`)
      console.log(`✅ Got ${result.length} favorites for gallery ${galleryId}`)
      return result
    } catch (error) {
      console.error(`❌ Error getting gallery favorites:`, error)
      throw error
    }
  }

  // Contact endpoint
  async sendContactMessage(messageData: {
    name: string
    email: string
    message: string
  }) {
    return this.request("/api/contact/", {
      method: "POST",
      body: JSON.stringify(messageData),
    })
  }
}

export const apiClient = new ApiClient()
export default apiClient
