import { updateRegister } from '../infra/dynamoQueries'

export const putEndpoint = async (event) => {
    const { mapID, registerID, register } = typeof event.body === "string" ? JSON.parse(event.body) : event.body
    await updateRegister({ mapID, registerID, register })
    return {
        statusCode: 200,
        body: JSON.stringify({ mapID, registerID, register }),
    }
}