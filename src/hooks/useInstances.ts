// src/hooks/useInstances.ts

import useSWR from 'swr'
import { config } from '@/config/api'
import type { Instance } from '@/types'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useInstances() {
  const { data, error, isLoading, mutate } = useSWR(
    config.endpoints.instances.list,
    fetcher,
    {
      refreshInterval: 5000, // Atualiza a cada 5s
      revalidateOnFocus: true,
    }
  )

  return {
    instances: data?.instances as Instance[] | undefined,
    total: data?.total as number | undefined,
    isLoading,
    isError: error,
    mutate,
  }
}

export function useInstance(id: string | undefined) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? config.endpoints.instances.status(id) : null,
    fetcher,
    {
      refreshInterval: 3000, // Atualiza a cada 3s
    }
  )

  return {
    instance: data as Instance | undefined,
    isLoading,
    isError: error,
    mutate,
  }
}

export function useGroups(instanceId: string | undefined) {
  const { data, error, isLoading, mutate } = useSWR(
    instanceId ? config.endpoints.instances.groups(instanceId) : null,
    fetcher
  )

  return {
    groups: data?.groups,
    total: data?.total,
    isLoading,
    isError: error,
    mutate,
  }
}

export function useStatus() {
  const { data, error, isLoading } = useSWR(
    config.endpoints.status,
    fetcher,
    {
      refreshInterval: 10000, // Atualiza a cada 10s
    }
  )

  return {
    status: data,
    isLoading,
    isError: error,
  }
}
