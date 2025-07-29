import { authorizedRequest, deserializeBody } from '@/api/api'
import type { Automation, AutomationId } from '@/model/scripts/Script'
import { automationDeserializer, automationsDeserializer } from '../dtos/GetAutomationDTO'

export async function toggleAutomation(automation: Automation, token: string) {
  authorizedRequest('/api/automations/' + automation.id, token, {
    method: 'POST',
    body: JSON.stringify({
      enable: automation.enabled,
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
