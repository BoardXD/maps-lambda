import { deleteRegister } from '../infra/dynamoQueries.js'

export const deleteEndpoint = async (event) => {
    const { mapID, registerID } = event?.pathParameters
    await deleteRegister({ mapID, registerID })
    return {
        statusCode: 200,
        body: JSON.stringify({ mapID, registerID }),
    }
}