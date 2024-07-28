import { findMapByMapId , findAllRegisters } from '../infra/dynamoQueries.js'

export const scanEndpoint = async (event) => {
    const pageSize = event?.queryStringParameters?.pageSize || 100
    const registers = await findAllRegisters({ pageSize })
    return {
        statusCode: 200,
        body: JSON.stringify(registers)
    }
}

export const getEndpoint = async (event) => {
    const mapID = event?.pathParameters?.mapID
    const map = await findMapByMapId({ mapID })
    return {
        statusCode: 200,
        body: JSON.stringify(map)
    }
}