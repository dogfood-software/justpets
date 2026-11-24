/// <reference types="vite/client" />

interface ImportMetaEnv {
  // API Configuration
  readonly VITE_API_URL: string
  // readonly VITE_API_VERSION: string
  // readonly VITE_API_KEY?: string

  // Feature Flags
  // readonly VITE_ENABLE_NEW_UI: string
  // readonly VITE_ENABLE_ANALYTICS: string
  // readonly VITE_DEBUG_MODE?: string

  // Authentication
  // readonly VITE_AUTH0_DOMAIN: string
  // readonly VITE_AUTH0_CLIENT_ID: string

  // App Configuration
  // readonly VITE_APP_NAME: string
  // readonly VITE_APP_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
