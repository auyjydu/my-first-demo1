import { useStore } from '../store'
import { api } from '../api'
import './Sidebar.css'

interface SidebarProps {
  onFileListChange: () => void
}

function Sidebar({ onFileListChange }: SidebarProps) {
  const {
    files,
    isLoadingFiles,
    filesError,
    currentFileName,
    isConnected,
    isDeleting,
    setDeleting,
    setCurrentFile,
    setLoadingFile,
  } = useStore()

  const handleFileClick = async (fileName: string) => {
    if (!isConnected || fileName === currentFileName) return

    setLoadingFile(true, null)
    try {
      const content = await api.getFileContent(fileName)
      setCurrentFile(fileName, content)
    } catch (error) {
      setLoadingFile(
        false,
        error instanceof Error ? error.message : '加载文件失败'
      )
    } finally {
      setLoadingFile(false, null)
    }
  }

  const handleDelete = async (fileName: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isConnected || !confirm(`确定要删除文件 "${fileName}" 吗？`)) return

    setDeleting(true)
    try {
      await api.deleteFile(fileName)
      if (currentFileName === fileName) {
        setCurrentFile(null, '')
      }
      onFileListChange()
    } catch (error) {
      alert(error instanceof Error ? error.message : '删除文件失败')
    } finally {
      setDeleting(false)
    }
  }

  const handleCreateFile = async (fileName: string) => {
    const { setCreating } = useStore.getState()
    setCreating(true)
    try {
      await api.createFile(fileName, '')
      onFileListChange()
    } catch (error) {
      alert(error instanceof Error ? error.message : '创建文件失败')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>文件列表</h2>
        <button
          className="new-file-button"
          onClick={() => {
            const fileName = prompt('请输入文件名（例如: newfile.txt）:')
            if (fileName && fileName.trim()) {
              handleCreateFile(fileName.trim())
            }
          }}
          disabled={!isConnected || isDeleting}
        >
          + 新建文件
        </button>
      </div>

      <div className="file-list">
        {isLoadingFiles ? (
          <div className="loading">加载中...</div>
        ) : filesError ? (
          <div className="error">错误: {filesError}</div>
        ) : files.length === 0 ? (
          <div className="empty">暂无文件</div>
        ) : (
          files.map((file) => (
            <div
              key={file.name}
              className={`file-item ${
                currentFileName === file.name ? 'active' : ''
              }`}
              onClick={() => handleFileClick(file.name)}
            >
              <span className="file-name">{file.name}</span>
              <button
                className="delete-button"
                onClick={(e) => handleDelete(file.name, e)}
                disabled={!isConnected || isDeleting}
                title="删除文件"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Sidebar

