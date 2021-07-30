import * as AWS from 'aws-sdk';

import { TodoItem } from '../models/TodoItem';
import { TodoUpdate } from '../models/TodoUpdate';

import { createLogger } from '../utils/logger';

const logger = createLogger('todosDataAccess');

const docClient = new AWS.DynamoDB.DocumentClient();
const todosTable = process.env.TODO_TABLE;
const bucketName = process.env.TODO_IMAGES_S3_BUCKET;
const USER_INDEX = process.env.USER_ID_INDEX;

export class TodoAccess {

  async getTodos(userId: string): Promise<TodoItem[]> {
    logger.info('Getting all todos');

    const result = await docClient.query({
      TableName: todosTable,
      IndexName: USER_INDEX,
      KeyConditionExpression: '#userId =:i',
      ExpressionAttributeNames: {
        '#userId': 'userId'
      },
      ExpressionAttributeValues: {
        ':i': userId
      }
    }).promise();

    const items = result.Items;

    return items as TodoItem[];
  }

  async createTodo(todo: TodoItem): Promise<TodoItem> {
    logger.info(`Creating a todo`, {
      todoId: todo.todoId
    });

    await docClient.put({
      TableName: todosTable,
      Item: todo
    }).promise();

    return todo;
  }

  async deleteTodo(todoId: string, userId: string) {
    
    logger.info(`Deleting a todo`, {
      todoId: todoId,
      userId: userId
    });

    const params = {
      TableName: todosTable,
      Key: {
        userId: userId,
        todoId: todoId
      }
    };

    await docClient.delete(params, function (err, data) {
      if (err) {
        console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
      } else {
        console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
      }
    }).promise();
  }

  async updateTodo(todo: TodoUpdate, todoId: string, userId: string) {
    logger.info(`Updating a todo`, {
      todoId: todoId,
      userId: userId
    });

    const params = {
      TableName: todosTable,
      Key: {
        userId: userId,
        todoId: todoId
      },
      ExpressionAttributeNames: {
        '#todo_name': 'name',
      },
      ExpressionAttributeValues: {
        ':name': todo.name,
        ':dueDate': todo.dueDate,
        ':done': todo.done,
      },
      UpdateExpression: 'SET #todo_name = :name, dueDate = :dueDate, done = :done',
      ReturnValues: 'ALL_NEW',
    };

    const result = await docClient.update(params).promise();

    logger.info(`Update statement has completed without error`, { result: result });

    return result.Attributes as TodoItem;
  }

  async updateTodoUrl(todoId: string, userId: string) {
    logger.info(`Updating a todo's URL for item:`, {
      todoId: todoId,
      userId: userId
    });

    const url = `https://${bucketName}.s3.amazonaws.com/${todoId}`;

    const params = {
      TableName: todosTable,
      Key: {
        userId: userId,
        todoId: todoId
      },
      ExpressionAttributeNames: {
        '#todo_attachmentUrl': 'attachmentUrl'
      },
      ExpressionAttributeValues: {
        ':attachmentUrl': url
      },
      UpdateExpression: 'SET #todo_attachmentUrl = :attachmentUrl',
      ReturnValues: 'ALL_NEW',
    };

    const result = await docClient.update(params).promise();

    logger.info(`Update statement has completed without error`, { result: result });

    return result.Attributes as TodoItem;
  }
}