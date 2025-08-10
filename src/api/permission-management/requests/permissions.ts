import { authorizedRequest, deserializeBody } from "@/api/api";
import { arrayDeserializer } from "@/api/Deserializer";
import { userDevicePermissionDeserializer } from "../dtos/GetUserDevicePermissionDTO";
import type { UserDevicePermission } from "@/model/permission-management/UserDevicePermission";


export async function getUserDevicesPermissions(email: string, token: string): Promise<UserDevicePermission[]> {
    const res = await authorizedRequest(`/api/permissions/user-device-all/${email}`, token);
    return await deserializeBody(res, arrayDeserializer(userDevicePermissionDeserializer));
}

export async function setUserDevicePermission(email: string, deviceId: string, token: string): Promise<void> {
    await authorizedRequest(`/api/permissions/user-device/${deviceId}`, token, {
        method: 'POST',
        body: JSON.stringify({ "email": email }),
    });
}

export async function deleteUserDevicePermission(email: string, deviceId: string, token: string): Promise<void> {
    await authorizedRequest(`/api/permissions/user-device/${deviceId}`, token, {
        method: 'DELETE',
        body: JSON.stringify({ "email": email }),
    });
}