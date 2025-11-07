import { useStore } from '../store'
import { api } from '../api'
import './Editor.css'

interface EditorProps {
  onFileChange: () => void
}

function Editor({ onFileChange }: EditorProps) {
  const {
    currentFileName,
    currentFileContent,
    setCurrentFileContent,
    isConnected,
    isLoadingFile,
    fileError,
    isSaving,
    setSaving,
  } = useStore()

  const handleSave = async () => {
    if (!currentFileName || !isConnected) return

    setSaving(true)
    try {
      await api.updateFile(currentFileName, currentFileContent)
      alert('文件保存成功！')
    } catch (error) {
      alert(error instanceof Error ? error.message : '保存文件失败')
    } finally {
      setSaving(false)
    }
  }

  const hasChanges = currentFileName !== null

  return (
    <div className="editor">
      <div className="editor-header">
        <div className="editor-title">
          {currentFileName ? (
            <>
              <span className="file-icon">📄</span>
              <span className="file-name">{currentFileName}</span>
            </>
          ) : (
            <span className="no-file">未选择文件</span>
          )}
        </div>
        {hasChanges && (
          <button
            className="save-button"
            onClick={handleSave}
            disabled={!isConnected || isSaving}
          >
            {isSaving ? '保存中...' : '保存'}
          </button>
        )}
      </div>

      <div className="editor-content">
        {isLoadingFile ? (
          <div className="loading">加载文件内容中...</div>
        ) : fileError ? (
          <div className="error">错误: {fileError}</div>
        ) : (
          <textarea
            className="editor-textarea"
            value={currentFileContent}
            onChange={(e) => setCurrentFileContent(e.target.value)}
            placeholder={
              currentFileName
                ? '在此编辑文件内容...'
                : '请从左侧选择或创建一个文件'
            }
            disabled={!isConnected || !currentFileName}
          />
        )}
      </div>
    </div>
  )
}

export default Editor

