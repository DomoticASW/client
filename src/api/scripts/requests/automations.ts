import { authorizedRequest, deserializeBody } from '@/api/api'
import type { AutomationId } from '@/model/scripts/Script'
import { automationDeserializer, automationsDeserializer } from '../dtos/GetAutomationDTO'

export async function toggleAutomation(
  id: AutomationId,
  enabled: boolean,
  token: string,
): Promise<void> {
  await authorizedRequest('/api/automations/' + id, token, {
    method: 'POST',
    body: JSON.stringify({
      enable: enabled,
    }),
  })
}

export async function findAutomation(id: AutomationId, token: string) {
  const res = await authorizedRequest('/api/automations/' + id, token)
  return await deserializeBody(res, automationDeserializer)
}

export async function getAllAutomations(token: string) {
  const res = await authorizedRequest('/api/automations', token)
  return await deserializeBody(res, automationsDeserializer)
}
