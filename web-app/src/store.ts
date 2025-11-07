import { create } from 'zustand'

export interface FileItem {
  name: string
}

export interface AppState {
  // Connection state
  isConnected: boolean
  isCheckingConnection: boolean
  connectionError: string | null

  // Files state
  files: FileItem[]
  isLoadingFiles: boolean
  filesError: string | null

  // Current file state
  currentFileName: string | null
  currentFileContent: string
  isLoadingFile: boolean
  fileError: string | null

  // Operation states
  isSaving: boolean
  isDeleting: boolean
  isCreating: boolean

  // Actions
  setConnectionState: (isConnected: boolean, error?: string | null) => void
  setCheckingConnection: (checking: boolean) => void
  setFiles: (files: FileItem[]) => void
  setLoadingFiles: (loading: boolean, error?: string | null) => void
  setCurrentFile: (fileName: string | null, content: string) => void
  setCurrentFileContent: (content: string) => void
  setLoadingFile: (loading: boolean, error?: string | null) => void
  setSaving: (saving: boolean) => void
  setDeleting: (deleting: boolean) => void
  setCreating: (creating: boolean) => void
  reset: () => void
}

const initialState = {
  isConnected: false,
  isCheckingConnection: false,
  connectionError: null,
  files: [],
  isLoadingFiles: false,
  filesError: null,
  currentFileName: null,
  currentFileContent: '',
  isLoadingFile: false,
  fileError: null,
  isSaving: false,
  isDeleting: false,
  isCreating: false,
}

export const useStore = create<AppState>((set) => ({
  ...initialState,

  setConnectionState: (isConnected, error = null) =>
    set({ isConnected, connectionError: error }),

  setCheckingConnection: (checking) =>
    set({ isCheckingConnection: checking }),

  setFiles: (files) => set({ files, filesError: null }),

  setLoadingFiles: (loading, error = null) =>
    set({ isLoadingFiles: loading, filesError: error }),

  setCurrentFile: (fileName, content) =>
    set({
      currentFileName: fileName,
      currentFileContent: content,
      fileError: null,
    }),

  setCurrentFileContent: (content) => set({ currentFileContent: content }),

  setLoadingFile: (loading, error = null) =>
    set({ isLoadingFile: loading, fileError: error }),

  setSaving: (saving) => set({ isSaving: saving }),

  setDeleting: (deleting) => set({ isDeleting: deleting }),

  setCreating: (creating) => set({ isCreating: creating }),

  reset: () => set(initialState),
}))

