import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { CreateTodoRequest } from '../../requests/CreateTodoRequest';
import { getToken, parseUserId } from '../../auth/utils';
import { createLogger } from '../../utils/logger';
import { createTodo } from '../../services/todosService';

const logger = createLogger('createTodos');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  logger.info('Processing current event: ', { event: event });
  //new request from the event
  const newTodo: CreateTodoRequest = JSON.parse(event.body);

  // Get user id
  const authHeader = event.headers.Authorization;
  const jwtToken = getToken(authHeader);
  logger.info('jwtToken: ', { jwtToken: jwtToken });

  const userId = parseUserId(jwtToken);
  logger.info('userId: ', { userId: userId });

  // Create Todo item
  const newItem = await createTodo(newTodo, userId);

  logger.info("Created ", newItem); 

  return {
    statusCode: 201,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item:newItem
    })
  };
};