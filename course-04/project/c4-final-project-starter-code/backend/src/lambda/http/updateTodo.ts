import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { updateTodo } from '../../services/todosService';
import { createLogger } from '../../utils/logger';
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest';
import { TodoItem } from '../../models/TodoItem';
import { getToken, parseUserId } from '../../auth/utils';

const logger = createLogger('getTodos');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;
  logger.info('Processing event: ', {event: event});

  const updateRequest : UpdateTodoRequest = JSON.parse(event.body);
  const authorization = event.headers.Authorization;
  const jwtToken = getToken(authorization);
  const userId = parseUserId(jwtToken);
  
  try{ 
    const updatedTodo: TodoItem = await updateTodo(todoId, updateRequest, userId);

    logger.info('updatedTodo: ', { updatedTodo: updatedTodo });

    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        updatedTodo
      })
    };
  } catch (e) {

    return {
      statusCode: 404,
      body: `error ${e}`
    };
  }
}
