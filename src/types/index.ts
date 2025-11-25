// src/types/index.ts

export type InstanceStatus = 'connected' | 'disconnected' | 'qr' | 'error' | 'offline'

export interface ProxyConfig {
  type: string
  host: string
  port: number
  hasAuth: boolean
}

export interface Instance {
  id: string
  name: string
  phone: string | null
  status: InstanceStatus
  qrCode: string | null
  proxy: ProxyConfig | null
  createdAt: string
}

export interface Group {
  id: string
  name: string
  participants: number
  description?: string
  createdAt?: number
  isAdmin?: boolean
}

export interface MessageLog {
  id: number
  instance_id: string
  group_id: string
  message_type: string
  message_content: string
  has_mentions: boolean
  status: 'pending' | 'sent' | 'error'
  error: string | null
  sent_at: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface CreateInstanceRequest {
  name: string
  proxyEnabled: boolean
  proxyType?: string
  proxyHost?: string
  proxyPort?: number
  proxyUsername?: string
  proxyPassword?: string
}

export interface CreateInstanceResponse {
  success: boolean
  instanceId: string
  name: string
  apiKey: string
  proxy: ProxyConfig | null
  status: string
  message: string
}

export interface Stats {
  total: number
  connected: number
  disconnected: number
  qr: number
  error: number
}

export interface StatusResponse {
  status: string
  service: string
  timestamp: string
  stats: Stats
}
