import { type RegistrationRequest } from '@/model/users-management/RegistrationRequest';
import { isGetRegistrationRequestDTO } from './GetRegistrationRequestDTO';
import { Deserializer } from "../Deserializer"

export interface GetRegistrationRequestsDTO {
  registrationRequests: RegistrationRequest[];
}

export function isGetRegistrationRequestsDTO(o: unknown): o is GetRegistrationRequestsDTO {
  return o != undefined && typeof o === 'object' &&
    'registrationRequests' in o && Array.isArray(o.registrationRequests) &&
    o.registrationRequests.every(registrationRequest => isGetRegistrationRequestDTO(registrationRequest));
}

export const getRegistrationRequestsDeserializer = 
  Deserializer<GetRegistrationRequestsDTO, GetRegistrationRequestsDTO>(
    isGetRegistrationRequestsDTO,
    (dto) => ({
        registrationRequests: dto.registrationRequests
    }),
    (obj) => `Unable to deserialize ${obj} into a GetRegistrationRequestsDTO since it was not a valid GetRegistrationRequestsDTO`
  )
