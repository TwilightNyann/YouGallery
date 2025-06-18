"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, CheckCircle, XCircle, AlertCircle } from "lucide-react"

export default function DebugPanel() {
  const [apiStatus, setApiStatus] = useState<"loading" | "connected" | "error">("loading")
  const [apiUrl, setApiUrl] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [lastCheck, setLastCheck] = useState<Date | null>(null)

  const checkApiConnection = async () => {
    setApiStatus("loading")
    setErrorMessage("")

    const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
    setApiUrl(url)

    try {
      const response = await fetch(`${url}/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setApiStatus("connected")
        console.log("API Health Check:", data)
      } else {
        setApiStatus("error")
        setErrorMessage(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      setApiStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Unknown error")
      console.error("API Connection Error:", error)
    }

    setLastCheck(new Date())
  }

  useEffect(() => {
    checkApiConnection()
  }, [])

  const getStatusIcon = () => {
    switch (apiStatus) {
      case "loading":
        return <RefreshCw className="h-4 w-4 animate-spin" />
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusBadge = () => {
    switch (apiStatus) {
      case "loading":
        return <Badge variant="secondary">Checking...</Badge>
      case "connected":
        return <Badge className="bg-green-500">Connected</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          API Connection Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">Status:</span>
          {getStatusBadge()}
        </div>

        <div className="flex items-center justify-between">
          <span className="font-medium">API URL:</span>
          <code className="text-sm bg-gray-100 px-2 py-1 rounded">{apiUrl}</code>
        </div>

        {errorMessage && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded">
            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
            <div>
              <p className="font-medium text-red-800">Connection Error:</p>
              <p className="text-sm text-red-600">{errorMessage}</p>
            </div>
          </div>
        )}

        {lastCheck && (
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Last checked:</span>
            <span>{lastCheck.toLocaleTimeString()}</span>
          </div>
        )}

        <Button onClick={checkApiConnection} className="w-full" disabled={apiStatus === "loading"}>
          <RefreshCw className={`h-4 w-4 mr-2 ${apiStatus === "loading" ? "animate-spin" : ""}`} />
          Check Connection
        </Button>

        {apiStatus === "error" && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <h4 className="font-medium text-yellow-800 mb-2">Troubleshooting Tips:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>
                • Check if Docker containers are running: <code>docker-compose ps</code>
              </li>
              <li>
                • Verify backend logs: <code>docker-compose logs backend</code>
              </li>
              <li>• Ensure NEXT_PUBLIC_API_URL is set correctly</li>
              <li>• Try accessing {apiUrl}/docs directly in browser</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
