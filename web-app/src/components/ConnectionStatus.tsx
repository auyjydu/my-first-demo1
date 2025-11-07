import { useStore } from '../store'
import './ConnectionStatus.css'

interface ConnectionStatusProps {
  onRetry: () => void
}

function ConnectionStatus({ onRetry }: ConnectionStatusProps) {
  const { isConnected, isCheckingConnection, connectionError } = useStore()

  return (
    <div className="connection-status">
      <div className="status-bar">
        <div className="status-indicator">
          <span
            className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}
          />
          <span className="status-text">
            {isCheckingConnection
              ? '检查连接中...'
              : isConnected
              ? '服务已连接'
              : '服务未连接'}
          </span>
        </div>
        {!isConnected && !isCheckingConnection && (
          <div className="status-actions">
            <p className="status-message">
              {connectionError || '请启动本地服务并重试'}
            </p>
            <button onClick={onRetry} className="retry-button">
              重试
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ConnectionStatus

