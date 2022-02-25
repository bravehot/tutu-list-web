/// <reference types="vite/client" />
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

// interface window {
//   $message: MessageProviderInst
// }

interface ImportMetaEnv {
  readonly VITE_AUTHING_ID: string
  readonly VITE_DEV_URL: string
  readonly VITE_STAGING_URL: string
  readonly VITE_PRODUCTION_URL: string

  
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  $message: {
    success: (message: string) => void
    warning: (message: string) => void
    error: (message: string) => void
  }
}
