// window.onload = loaded;

// /**
//  * Simple Function that will be run when the browser is finished loading.
//  */
// function loaded() {
//     // Assign to a variable so we can set a breakpoint in the debugger!
//     const hello = sayHello();
//     console.log(hello);
// }

// /**
//  * This function returns the string 'hello'
//  * @return {string} the string hello
//  */
// export function sayHello() {
//     return 'hello';
// }

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = 'WorkoutLogs';

exports.handler = async (event) => {
    const data = JSON.parse(event.body);

    if (!data.userId || !data.date || !data.exercise) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing required fields' }),
        };
    }

    const params = {
        TableName: tableName,
        Item: {
            userId: data.userId,
            logId: `${data.userId}-${Date.now()}`, // Unique ID
            date: data.date,
            exercise: data.exercise,
            sets: data.sets,
            reps: data.reps,
            weight: data.weight,
            notes: data.notes,
        },
    };

    try {
        await dynamoDb.put(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Workout log added successfully' }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Could not add workout log' }),
        };
    }
};
