import { authorizedRequest, deserializeBody } from '@/api/api'
import type { AutomationId, Trigger } from '@/model/scripts/Script'
import { automationDeserializer, automationsDeserializer } from '../dtos/GetAutomationDTO'
import type { Instruction } from '@/model/scripts/Instruction'

export async function editAutomation(
  id: AutomationId,
  automation: { name: string; trigger: Trigger; instructions: Instruction[] },
  token: string
): Promise<void> {
  await authorizedRequest('/api/automations/' + id, token, {
    method: 'PATCH',
    body: JSON.stringify({
      name: automation.name,
      trigger: automation.trigger,
      instructions: automation.instructions,
    }),
  })
}

export async function createAutomation(
  automation: { name: string; trigger: Trigger; instructions: Instruction[] },
  token: string
): Promise<void> {
  await authorizedRequest('/api/automations/', token, {
    method: 'POST',
    body: JSON.stringify({
      name: automation.name,
      trigger: automation.trigger,
      instructions: automation.instructions,
    }),
  })
}

export async function deleteAutomation(id: AutomationId, token: string): Promise<void> {
  await authorizedRequest('/api/automations/' + id, token, { method: 'DELETE' })
}

export async function toggleAutomation(
  id: AutomationId,
  enabled: boolean,
  token: string
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
