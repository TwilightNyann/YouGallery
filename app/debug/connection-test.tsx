"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiClient } from "@/lib/api"

export default function ConnectionTest() {
  const [results, setResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addResult = (message: string) => {
    setResults((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testConnection = async () => {
    setIsLoading(true)
    setResults([])

    // 1. Перевіряємо базовий URL
    addResult(`🔧 API Base URL: ${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}`)

    // 2. Тестуємо прямий fetch до health endpoint
    try {
      addResult("🚀 Testing direct fetch to /api/health...")
      const healthUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/health`
      addResult(`🔗 Full health URL: ${healthUrl}`)

      const response = await fetch(healthUrl, {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
        mode: "cors",
      })

      addResult(`📡 Health response status: ${response.status}`)
      addResult(`📡 Health response ok: ${response.ok}`)

      if (response.ok) {
        const data = await response.text()
        addResult(`✅ Health response data: ${data}`)
      } else {
        addResult(`❌ Health response failed: ${response.statusText}`)
      }
    } catch (error) {
      addResult(`💥 Direct fetch error: ${error}`)
    }

    // 3. Тестуємо через apiClient
    try {
      addResult("🚀 Testing apiClient.testConnection()...")
      const result = await apiClient.testConnection()
      addResult(`📡 apiClient test result: ${result}`)
    } catch (error) {
      addResult(`💥 apiClient test error: ${error}`)
    }

    // 4. Тестуємо отримання галерей
    try {
      addResult("🚀 Testing apiClient.getGalleries()...")
      const galleries = await apiClient.getGalleries()
      addResult(`📡 Galleries result: ${JSON.stringify(galleries).substring(0, 200)}...`)
    } catch (error) {
      addResult(`💥 Galleries error: ${error}`)
    }

    setIsLoading(false)
  }

  const testDifferentUrls = async () => {
    setIsLoading(true)
    setResults([])

    const urlsToTest = ["http://localhost:8000", "http://127.0.0.1:8000", process.env.NEXT_PUBLIC_API_URL].filter(
      Boolean,
    )

    for (const baseUrl of urlsToTest) {
      try {
        addResult(`🧪 Testing URL: ${baseUrl}`)
        const response = await fetch(`${baseUrl}/api/health`, {
          method: "GET",
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
          mode: "cors",
        })
        addResult(`📡 ${baseUrl} - Status: ${response.status}, OK: ${response.ok}`)
      } catch (error) {
        addResult(`💥 ${baseUrl} - Error: ${error}`)
      }
    }

    setIsLoading(false)
  }

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>🔧 Connection Diagnostic Tool</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-x-4">
            <Button onClick={testConnection} disabled={isLoading}>
              {isLoading ? "Testing..." : "Test Current Connection"}
            </Button>
            <Button onClick={testDifferentUrls} disabled={isLoading} variant="outline">
              Test Different URLs
            </Button>
            <Button onClick={() => setResults([])} variant="outline">
              Clear Results
            </Button>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Environment Variables:</h3>
            <div className="bg-gray-100 p-3 rounded text-sm">
              <div>NEXT_PUBLIC_API_URL: {process.env.NEXT_PUBLIC_API_URL || "undefined"}</div>
              <div>Current window.location: {typeof window !== "undefined" ? window.location.href : "SSR"}</div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Test Results:</h3>
            <div className="bg-black text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
              {results.length === 0 ? (
                <div className="text-gray-500">No tests run yet. Click a button above to start testing.</div>
              ) : (
                results.map((result, index) => (
                  <div key={index} className="mb-1">
                    {result}
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
