// src/config/api.ts

/**
 * Configuração da API
 * URL do backend pode ser configurada via variável de ambiente
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002'

export const config = {
  apiUrl: API_URL,
  endpoints: {
    status: `${API_URL}/api/status`,
    instances: {
      create: `${API_URL}/api/instance/create`,
      list: `${API_URL}/api/instance/list`,
      connect: (id: string) => `${API_URL}/api/instance/${id}/connect`,
      disconnect: (id: string) => `${API_URL}/api/instance/${id}/disconnect`,
      qr: (id: string) => `${API_URL}/api/instance/${id}/qr`,
      status: (id: string) => `${API_URL}/api/instance/${id}/status`,
      groups: (id: string) => `${API_URL}/api/instance/${id}/groups`,
      delete: (id: string) => `${API_URL}/api/instance/${id}`,
    },
    send: {
      text: `${API_URL}/api/send/text`,
      media: `${API_URL}/api/send/media`,
      document: `${API_URL}/api/send/document`,
      audio: `${API_URL}/api/send/audio`,
    },
  },
}

/**
 * Tipos de proxy suportados
 */
export const PROXY_TYPES = [
  { value: 'socks5', label: 'SOCKS5', description: 'Recomendado - Rápido e confiável' },
  { value: 'socks4', label: 'SOCKS4', description: 'Versão antiga do SOCKS' },
  { value: 'http', label: 'HTTP', description: 'Proxy HTTP padrão' },
  { value: 'https', label: 'HTTPS', description: 'Proxy HTTP com SSL' },
  { value: 'socks5-tls', label: 'SOCKS5 TLS', description: 'SOCKS5 com criptografia extra' },
] as const

export type ProxyType = typeof PROXY_TYPES[number]['value']
