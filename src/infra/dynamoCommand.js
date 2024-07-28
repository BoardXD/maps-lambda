import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"

export const createRegisterCommand = async ({ mapID, registerID, register }) => {
    return {
        TableName: process.env.REGISTER_TABLE_NAME,
        Item: marshall({ mapID, registerID, isActive: true, ...register }),
        ConditionExpression: "attribute_not_exists(mapID) AND attribute_not_exists(registerID)",
        ReturnValues: "ALL_OLD",
    }
}

export const findMapByMapIdCommand = async ({ mapID }) => {
    return {
        TableName: process.env.REGISTER_TABLE_NAME,
        KeyConditionExpression: "mapID = :mapID",
        ExpressionAttributeValues: {
            ":mapID": { S: mapID },
            ":isActive": { BOOL: true },
        },
    }
}

export const updateRegisterCommand = async ({ mapID, registerID, register }) => {
    const updateKeys = Object.keys(register)
    const UpdateExpression = `SET ${updateKeys.map((key) => `#${key} = :${key}`).join(", ")}`
    const ExpressionAttributeNames = updateKeys.reduce((acc, key) => {
        acc[`#${key}`] = key
        return acc
    }, {})
    const ExpressionAttributeValues = updateKeys.reduce((acc, key) => {
        acc[`:${key}`] = register[key]
        return acc
    }, {})

    return {
        TableName: process.env.REGISTER_TABLE_NAME,
        Key: marshall({ mapID, registerID }),
        UpdateExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues: marshall(ExpressionAttributeValues),
        ReturnValues: "ALL_NEW",
    }
}

export const deleteRegisterCommand = async ({ mapID, registerID }) => {
    return updateRegisterCommand({ mapID, registerID, register: { isActive: false } })
}

export const scanRegister = async ({ client, scanBase, pageSize, exclusiveStartKey }) => {
    const params = {
        Limit: pageSize,
        ExclusiveStartKey: exclusiveStartKey,
        TableName: process.env.REGISTER_TABLE_NAME,
    }
    const command = new scanBase(params)
    const response = await client.send(command)
    return {
        items: response.Items.map((item) => unmarshall(item)),
        lastEvaluatedKey: response.LastEvaluatedKey,
    }
}
