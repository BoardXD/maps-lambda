import { ScanCommand, PutItemCommand, GetItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { createRegisterCommand, findMapByMapIdCommand, updateRegisterCommand, scanRegister } from "./dynamoCommand"
import { unmarshall } from "@aws-sdk/util-dynamodb"

const client = new DynamoDBClient({ region: process.env.AWS_REGION })

export const createRegister = async ({ mapID, registerID, register }) => {
    const params = createRegisterCommand({ mapID, registerID, register })
    const command = new PutItemCommand(params)
    const response = await client.send(command)
    return response
}

export const findMapByMapId = async ({ mapID }) => {
    const params = findMapByMapIdCommand({ mapID })
    const command = new GetItemCommand(params)
    const response = await client.send(command)
    return response.Item.map((item) => unmarshall(item))
}

export const updateRegister = async ({ mapID, registerID, register }) => {
    const params = updateRegisterCommand({ mapID, registerID, register })
    const command = new PutItemCommand(params)
    const response = await client.send(command)
    return response
}

export const deleteRegister = async ({ mapID, registerID }) => {
    const params = updateRegisterCommand({ mapID, registerID })
    const command = new PutItemCommand(params)
    const response = await client.send(command)
    return response
}

export const findAllRegisters = async ({ pageSize }) => {
    let exclusiveStartKey
    let registers = []
    do {
        const response = await scanRegister({ scanBase: ScanCommand, pageSize, exclusiveStartKey })
        registers = registers.concat(response.items)
        exclusiveStartKey = response.lastEvaluatedKey
    } while (exclusiveStartKey)
    return registers
}
