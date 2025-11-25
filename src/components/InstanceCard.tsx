// src/components/InstanceCard.tsx

import { useState } from 'react'
import { 
  Smartphone, 
  Shield, 
  Copy, 
  Power, 
  PowerOff, 
  Trash2, 
  QrCode,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'
import type { Instance } from '@/types'
import { config } from '@/config/api'
import { formatPhone, copyToClipboard } from '@/lib/utils'

interface InstanceCardProps {
  instance: Instance
  onUpdate: () => void
}

export function InstanceCard({ instance, onUpdate }: InstanceCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showQR, setShowQR] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-success-600 bg-success-100 dark:bg-success-900/30'
      case 'qr':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30'
      case 'disconnected':
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700'
      case 'error':
        return 'text-danger-600 bg-danger-100 dark:bg-danger-900/30'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle2 className="w-4 h-4" />
      case 'qr':
        return <Clock className="w-4 h-4" />
      case 'error':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <XCircle className="w-4 h-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected':
        return 'Conectado'
      case 'qr':
        return 'Aguardando QR'
      case 'disconnected':
        return 'Desconectado'
      case 'error':
        return 'Erro'
      default:
        return 'Offline'
    }
  }

  const handleConnect = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(config.endpoints.instances.connect(instance.id), {
        method: 'POST',
      })
      const data = await response.json()
      
      if (data.success) {
        toast.success('QR Code gerado! Escaneie com WhatsApp')
        setShowQR(true)
        onUpdate()
      } else {
        toast.error(data.error || 'Erro ao conectar')
      }
    } catch (error) {
      toast.error('Erro ao conectar instância')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnect = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(config.endpoints.instances.disconnect(instance.id), {
        method: 'POST',
      })
      const data = await response.json()
      
      if (data.success) {
        toast.success('Instância desconectada')
        onUpdate()
      } else {
        toast.error(data.error || 'Erro ao desconectar')
      }
    } catch (error) {
      toast.error('Erro ao desconectar instância')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Tem certeza que deseja deletar a instância "${instance.name}"?`)) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(config.endpoints.instances.delete(instance.id), {
        method: 'DELETE',
      })
      const data = await response.json()
      
      if (data.success) {
        toast.success('Instância deletada')
        onUpdate()
      } else {
        toast.error(data.error || 'Erro ao deletar')
      }
    } catch (error) {
      toast.error('Erro ao deletar instância')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyApiKey = async () => {
    // Em produção, você pegaria a API Key do backend
    const success = await copyToClipboard(`baileys_${instance.id}`)
    if (success) {
      toast.success('API Key copiada!')
    } else {
      toast.error('Erro ao copiar')
    }
  }

  return (
    <div className="card p-6 hover:shadow-xl transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-primary-100 dark:bg-primary-900/30">
            <Smartphone className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{instance.name}</h3>
            {instance.phone && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formatPhone(instance.phone)}
              </p>
            )}
          </div>
        </div>
        
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${getStatusColor(instance.status)}`}>
          {getStatusIcon(instance.status)}
          <span className="text-sm font-medium">{getStatusText(instance.status)}</span>
        </div>
      </div>

      {/* Proxy Info */}
      {instance.proxy && (
        <div className="flex items-center gap-2 mb-4 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
          <Shield className="w-4 h-4 text-primary-600" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Proxy: {instance.proxy.type.toUpperCase()} - {instance.proxy.host}:{instance.proxy.port}
          </span>
        </div>
      )}

      {/* QR Code */}
      {showQR && instance.qrCode && instance.status === 'qr' && (
        <div className="mb-4 p-4 rounded-lg bg-white dark:bg-gray-900 border-2 border-primary-500">
          <img src={instance.qrCode} alt="QR Code" className="w-full max-w-xs mx-auto" />
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
            Escaneie com WhatsApp
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {instance.status === 'connected' ? (
          <>
            <button
              onClick={handleDisconnect}
              disabled={isLoading}
              className="btn-secondary flex-1 flex items-center justify-center gap-2"
            >
              <PowerOff className="w-4 h-4" />
              Desconectar
            </button>
            <button
              className="btn-secondary flex items-center justify-center gap-2"
              title="Ver grupos"
            >
              <Users className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button
            onClick={handleConnect}
            disabled={isLoading}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            {instance.status === 'qr' ? (
              <>
                <QrCode className="w-4 h-4" />
                Ver QR Code
              </>
            ) : (
              <>
                <Power className="w-4 h-4" />
                Conectar
              </>
            )}
          </button>
        )}

        <button
          onClick={handleCopyApiKey}
          className="btn-secondary flex items-center justify-center gap-2"
          title="Copiar API Key"
        >
          <Copy className="w-4 h-4" />
          API Key
        </button>

        <button
          onClick={handleDelete}
          disabled={isLoading}
          className="btn-danger flex items-center justify-center gap-2"
          title="Deletar instância"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
