import { useEffect } from 'react'
import { useStore } from './store'
import { api } from './api'
import ConnectionStatus from './components/ConnectionStatus'
import Sidebar from './components/Sidebar'
import Editor from './components/Editor'
import './App.css'

function App() {
  const {
    isConnected,
    isCheckingConnection,
    setConnectionState,
    setCheckingConnection,
    setFiles,
    setLoadingFiles,
  } = useStore()

  // Check connection on mount
  useEffect(() => {
    checkConnection()
  }, [])

  // Load files when connected
  useEffect(() => {
    if (isConnected) {
      loadFiles()
    }
  }, [isConnected])

  const checkConnection = async () => {
    setCheckingConnection(true)
    setConnectionState(false, null)
    try {
      await api.checkHealth()
      setConnectionState(true, null)
    } catch (error) {
      setConnectionState(
        false,
        error instanceof Error ? error.message : '连接失败'
      )
    } finally {
      setCheckingConnection(false)
    }
  }

  const loadFiles = async () => {
    setLoadingFiles(true, null)
    try {
      const fileNames = await api.getFiles()
      setFiles(fileNames.map((name) => ({ name })))
    } catch (error) {
      setLoadingFiles(
        false,
        error instanceof Error ? error.message : '加载文件列表失败'
      )
    } finally {
      setLoadingFiles(false, null)
    }
  }

  return (
    <div className="app">
      <ConnectionStatus onRetry={checkConnection} />
      <div className="app-content">
        <Sidebar onFileListChange={loadFiles} />
        <Editor onFileChange={loadFiles} />
      </div>
    </div>
  )
}

export default App

