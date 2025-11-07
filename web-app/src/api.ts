const API_BASE_URL = 'https://localhost:9527'

// Helper function to handle fetch with error handling
async function fetchWithErrorHandling(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `HTTP ${response.status}: ${errorText || response.statusText}`
      )
    }

    return response
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('网络错误：无法连接到本地服务。请确保本地服务已启动。')
    }
    throw error
  }
}

export const api = {
  // Health check
  async checkHealth(): Promise<{ status: string }> {
    const response = await fetchWithErrorHandling(`${API_BASE_URL}/health`)
    return response.json()
  },

  // Get all files
  async getFiles(): Promise<string[]> {
    const response = await fetchWithErrorHandling(`${API_BASE_URL}/files`)
    return response.json()
  },

  // Get file content
  async getFileContent(filename: string): Promise<string> {
    const response = await fetchWithErrorHandling(
      `${API_BASE_URL}/files/${encodeURIComponent(filename)}`
    )
    return response.text()
  },

  // Create file
  async createFile(filename: string, content: string): Promise<void> {
    await fetchWithErrorHandling(`${API_BASE_URL}/files`, {
      method: 'POST',
      body: JSON.stringify({ filename, content }),
    })
  },

  // Update file
  async updateFile(filename: string, content: string): Promise<void> {
    await fetchWithErrorHandling(
      `${API_BASE_URL}/files/${encodeURIComponent(filename)}`,
      {
        method: 'PUT',
        body: JSON.stringify({ content }),
      }
    )
  },

  // Delete file
  async deleteFile(filename: string): Promise<void> {
    await fetchWithErrorHandling(
      `${API_BASE_URL}/files/${encodeURIComponent(filename)}`,
      {
        method: 'DELETE',
      }
    )
  },
}

