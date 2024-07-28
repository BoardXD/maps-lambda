import { createRegister } from "../infra/dynamoQueries.js"

export const postEndpoint = async (event) => {
    const { mapID, registerID, register } = typeof event.body === "string" ? JSON.parse(event.body) : event.body
    await createRegister({ mapID, registerID, register })
    return {
        statusCode: 201,
        body: JSON.stringify({ mapID, registerID, register }),
    }
}
