'use client'

import { Blueprint3DAppBase, type Blueprint3DAppConfig } from './Blueprint3DAppBase'

interface Blueprint3DAppProps {
  config?: Blueprint3DAppConfig
}

export function Blueprint3DApp({ config }: Blueprint3DAppProps) {
  return <Blueprint3DAppBase config={config} />
}

export default Blueprint3DApp
