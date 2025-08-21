import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { ScanCommandInput, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { QueryCommand } from '@aws-sdk/client-dynamodb';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
const { v4: uuidv4 } = require('uuid');

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

// Main Lambda handler
export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    switch (event.httpMethod) {
        case 'GET':
            return handleGetRequest(event);
        case 'POST':
            return handlePostRequest(event);
        case 'PUT':
            return handlePutRequest(event);
        case 'DELETE':
            return handleDeleteRequest(event);
        default:
            return {
                statusCode: 405,
                body: JSON.stringify({ message: 'Method Not Allowed' }),
            };
    }
};



// Function to handle GET requests
const handleGetRequest = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const channel = event.queryStringParameters?.channel;
    let params: ScanCommandInput = {
        TableName: 'TVSchedule',
    };

    try {
        if (channel) {
            params = {
                ...params,
                FilterExpression: '#channel = :channel',
                ExpressionAttributeNames: {
                    '#channel': 'channel',
                },
                ExpressionAttributeValues: {
                    ':channel': channel,
                },
            };
        }

        const data = await dynamoDb.send(new ScanCommand(params));
        return {
            statusCode: 200,
            body: JSON.stringify(data.Items || []),
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error occurred while processing GET request',
                error: (err as Error).message,
            }),
        };
    }
};

// Function to handle POST requests
const handlePostRequest = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const body = JSON.parse(event.body || '{}');
        // validate the body
        if (!body.title || !body.channel || !body.time) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing required fields: title, channel, time' }),
            };
        }
        // add a uuid for the id
        body.id = uuidv4();

        const params = {
            TableName: 'TVSchedule',
            Item: body,
        };

        await dynamoDb.send(new PutCommand(params));
        return {
            statusCode: 201,
            body: JSON.stringify({
                message: 'Item created successfully',
                item: body,
            }),
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error occurred while processing POST request',
                error: (err as Error).message,
            }),
        };
    }
};

// Function to handle PUT requests
const handlePutRequest = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const body = JSON.parse(event.body || '{}');
        const { id, ...updateFields } = body;

        if (!id) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing required field: id' }),
            };
        }

        const updateExpression = Object.keys(updateFields)
            .map((key) => `#${key} = :${key}`)
            .join(', ');
        const expressionAttributeNames = Object.keys(updateFields).reduce((acc, key) => {
            acc[`#${key}`] = key;
            return acc;
        }, {} as Record<string, string>);
        const expressionAttributeValues = Object.keys(updateFields).reduce((acc, key) => {
            acc[`:${key}`] = updateFields[key];
            return acc;
        }, {} as Record<string, any>);

        const params = {
            TableName: 'TVSchedule',
            Key: { id },
            UpdateExpression: `SET ${updateExpression}`,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
        };

        await dynamoDb.send(new UpdateCommand(params));
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Item updated successfully' }),
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error occurred while processing PUT request',
                error: (err as Error).message,
            }),
        };
    }
};

// Function to handle DELETE requests
const handleDeleteRequest = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { id } = JSON.parse(event.body || '{}');

        if (!id) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing required field: id' }),
            };
        }

        const params = {
            TableName: 'TVSchedule',
            Key: { id },
        };

        await dynamoDb.send(new DeleteCommand(params));
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Item deleted successfully' }),
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error occurred while processing DELETE request',
                error: (err as Error).message,
            }),
        };
    }
};





