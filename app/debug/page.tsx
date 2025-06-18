"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

export default function DebugPage() {
  const [apiUrl, setApiUrl] = useState(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000")
  const [testResult, setTestResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Display environment variables
    console.log("Environment variables:", {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    })
  }, [])

  const testConnection = async () => {
    setIsLoading(true)
    setError(null)
    setTestResult(null)

    try {
      const response = await fetch(`${apiUrl}/api/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      })

      const data = await response.json()
      setTestResult({
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        data,
      })
    } catch (err) {
      console.error("Connection test failed:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
      setTestResult({
        success: false,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testRegister = async () => {
    setIsLoading(true)
    setError(null)
    setTestResult(null)

    try {
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          name: "Test User",
          email: `test${Date.now()}@example.com`,
          password: "password123",
        }),
      })

      let data
      try {
        data = await response.json()
      } catch (e) {
        data = { text: await response.text() }
      }

      setTestResult({
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        data,
      })
    } catch (err) {
      console.error("Register test failed:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
      setTestResult({
        success: false,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">API Connection Diagnostics</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Environment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <Label>NEXT_PUBLIC_API_URL</Label>
              <div className="text-sm bg-gray-100 p-2 rounded">{process.env.NEXT_PUBLIC_API_URL || "Not set"}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test API Connection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiUrl">API URL</Label>
              <Input
                id="apiUrl"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="Enter API URL"
              />
            </div>

            <div className="flex space-x-2">
              <Button onClick={testConnection} disabled={isLoading}>
                {isLoading ? "Testing..." : "Test Connection"}
              </Button>
              <Button onClick={testRegister} disabled={isLoading} variant="outline">
                {isLoading ? "Testing..." : "Test Register"}
              </Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {testResult && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Test Result:</h3>
                <div
                  className={`p-3 rounded ${
                    testResult.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  <p>
                    <strong>Success:</strong> {testResult.success ? "Yes" : "No"}
                  </p>
                  {testResult.status && (
                    <p>
                      <strong>Status:</strong> {testResult.status} {testResult.statusText}
                    </p>
                  )}
                </div>

                <Separator className="my-4" />

                <h3 className="font-semibold mb-2">Response Data:</h3>
                <pre className="bg-gray-100 p-3 rounded overflow-auto max-h-60 text-xs">
                  {JSON.stringify(testResult.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Network Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            Open your browser&apos;s developer tools (F12) and check the Network tab to see all API requests and
            responses.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              console.log("Opening developer tools instructions")
            }}
          >
            How to open developer tools
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
