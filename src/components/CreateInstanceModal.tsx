// src/components/CreateInstanceModal.tsx

import { useState } from 'react'
import { X, Plus, Shield, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { config, PROXY_TYPES } from '@/config/api'
import type { CreateInstanceRequest } from '@/types'

interface CreateInstanceModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CreateInstanceModal({ isOpen, onClose, onSuccess }: CreateInstanceModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<CreateInstanceRequest>({
    name: '',
    proxyEnabled: false,
    proxyType: 'socks5',
    proxyHost: '',
    proxyPort: 1080,
    proxyUsername: '',
    proxyPassword: '',
  })

  const [showApiKey, setShowApiKey] = useState(false)
  const [apiKey, setApiKey] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error('Nome é obrigatório')
      return
    }

    if (formData.proxyEnabled) {
      if (!formData.proxyHost || !formData.proxyPort) {
        toast.error('Host e porta do proxy são obrigatórios')
        return
      }
    }

    setIsLoading(true)
    try {
      const response = await fetch(config.endpoints.instances.create, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Instância criada com sucesso!')
        setApiKey(data.apiKey)
        setShowApiKey(true)
        onSuccess()
      } else {
        toast.error(data.error || 'Erro ao criar instância')
      }
    } catch (error) {
      toast.error('Erro ao criar instância')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      name: '',
      proxyEnabled: false,
      proxyType: 'socks5',
      proxyHost: '',
      proxyPort: 1080,
      proxyUsername: '',
      proxyPassword: '',
    })
    setShowApiKey(false)
    setApiKey('')
    onClose()
  }

  const copyApiKey = async () => {
    try {
      await navigator.clipboard.writeText(apiKey)
      toast.success('API Key copiada!')
    } catch {
      toast.error('Erro ao copiar')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
              <Plus className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Nova Instância</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Crie uma nova instância do WhatsApp
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {showApiKey ? (
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="inline-flex p-4 rounded-full bg-success-100 dark:bg-success-900/30 mb-4">
                <AlertCircle className="w-8 h-8 text-success-600 dark:text-success-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Instância Criada!</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Guarde sua API Key em um local seguro. Você precisará dela para enviar mensagens.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                API Key:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={apiKey}
                  readOnly
                  className="input flex-1 font-mono text-sm"
                />
                <button onClick={copyApiKey} className="btn-primary px-4">
                  Copiar
                </button>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                ⚠️ <strong>Importante:</strong> Esta API Key não será exibida novamente. 
                Salve-a agora em um local seguro!
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={handleClose} className="btn-primary flex-1">
                Entendi
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Nome da Instância *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Marketing, Vendas, Suporte..."
                className="input"
                required
              />
            </div>

            {/* Toggle Proxy */}
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.proxyEnabled}
                  onChange={(e) => setFormData({ ...formData, proxyEnabled: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary-600" />
                  <div>
                    <span className="font-medium">Usar Proxy</span>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Recomendado para evitar bloqueios
                    </p>
                  </div>
                </div>
              </label>
            </div>

            {/* Configurações de Proxy */}
            {formData.proxyEnabled && (
              <div className="space-y-4 p-4 rounded-lg border-2 border-primary-200 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-900/10">
                <h4 className="font-medium flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Configurações do Proxy
                </h4>

                {/* Tipo de Proxy */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tipo de Proxy *
                  </label>
                  <select
                    value={formData.proxyType}
                    onChange={(e) => setFormData({ ...formData, proxyType: e.target.value })}
                    className="input"
                  >
                    {PROXY_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label} - {type.description}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Host e Porta */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Host *
                    </label>
                    <input
                      type="text"
                      value={formData.proxyHost}
                      onChange={(e) => setFormData({ ...formData, proxyHost: e.target.value })}
                      placeholder="proxy.exemplo.com"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Porta *
                    </label>
                    <input
                      type="number"
                      value={formData.proxyPort}
                      onChange={(e) => setFormData({ ...formData, proxyPort: parseInt(e.target.value) })}
                      placeholder="1080"
                      className="input"
                    />
                  </div>
                </div>

                {/* Autenticação (opcional) */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <label className="block text-sm font-medium mb-3">
                    Autenticação (Opcional)
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={formData.proxyUsername}
                      onChange={(e) => setFormData({ ...formData, proxyUsername: e.target.value })}
                      placeholder="Usuário"
                      className="input"
                    />
                    <input
                      type="password"
                      value={formData.proxyPassword}
                      onChange={(e) => setFormData({ ...formData, proxyPassword: e.target.value })}
                      placeholder="Senha"
                      className="input"
                    />
                  </div>
                </div>

                {/* Preview */}
                <div className="p-3 rounded bg-gray-100 dark:bg-gray-800 font-mono text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Preview:</span>
                  <br />
                  {formData.proxyType}://{formData.proxyUsername && '***@'}{formData.proxyHost || 'host'}:{formData.proxyPort}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="btn-secondary flex-1"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary flex-1"
                disabled={isLoading}
              >
                {isLoading ? 'Criando...' : 'Criar Instância'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
