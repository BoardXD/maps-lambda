import { deleteEndpoint } from "./handlers/delete"
import { getEndpoint, scanEndpoint } from "./handlers/get"
import { postEndpoint } from "./handlers/post"
import { putEndpoint } from "./handlers/put"

export const handler = async (event) => {
    try {
        const { httpMethod } = event
        switch (httpMethod) {
            case "POST":
                return postEndpoint(event)
            case "PUT":
                return putEndpoint(event)
            case "DELETE":
                return deleteEndpoint(event)
            case "GET":
                if (event?.pathParameters?.mapID) {
                    return getEndpoint(event)
                } else {
                    return scanEndpoint(event)
                }
            default:
                return {
                    statusCode: 405,
                    body: JSON.stringify({ error: "Method Not Allowed" }),
                }
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        }
    }
}
