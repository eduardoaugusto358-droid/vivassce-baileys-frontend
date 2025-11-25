// src/pages/Dashboard.tsx

import { useState } from 'react'
import { Plus, RefreshCw, Activity, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { useInstances } from '@/hooks/useInstances'
import { InstanceCard } from '@/components/InstanceCard'
import { CreateInstanceModal } from '@/components/CreateInstanceModal'
import { StatsCard } from '@/components/StatsCard'

export function Dashboard() {
  const { instances, total, isLoading, mutate } = useInstances()
  const [showCreateModal, setShowCreateModal] = useState(false)

  const stats = {
    total: instances?.length || 0,
    connected: instances?.filter(i => i.status === 'connected').length || 0,
    disconnected: instances?.filter(i => i.status === 'disconnected').length || 0,
    qr: instances?.filter(i => i.status === 'qr').length || 0,
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                Vivassce Baileys Manager
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Gerencie suas instâncias do WhatsApp
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => mutate()}
                className="btn-secondary flex items-center gap-2"
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Atualizar
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nova Instância
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total de Instâncias"
            value={stats.total}
            icon={Activity}
            color="primary"
          />
          <StatsCard
            title="Conectadas"
            value={stats.connected}
            icon={CheckCircle2}
            color="success"
          />
          <StatsCard
            title="Aguardando QR"
            value={stats.qr}
            icon={Clock}
            color="warning"
          />
          <StatsCard
            title="Desconectadas"
            value={stats.disconnected}
            icon={XCircle}
            color="gray"
          />
        </div>

        {/* Instances Grid */}
        {isLoading && !instances ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : instances && instances.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {instances.map((instance) => (
              <InstanceCard
                key={instance.id}
                instance={instance}
                onUpdate={() => mutate()}
              />
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <div className="inline-flex p-4 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
              <Activity className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Nenhuma instância criada</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Comece criando sua primeira instância do WhatsApp
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Criar Primeira Instância
            </button>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <CreateInstanceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          mutate()
          // Não fecha o modal para mostrar a API Key
        }}
      />
    </div>
  )
}
