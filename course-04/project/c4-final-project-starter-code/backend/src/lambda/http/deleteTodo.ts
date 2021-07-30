import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getToken, parseUserId } from '../../auth/utils';
import { createLogger } from '../../utils/logger';

import { deleteTodo } from '../../services/todosService';

const logger = createLogger('deleteTodo');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;
  logger.info('Processing event: ', { event: event });

  const authorization = event.headers.Authorization;
  const jwtToken = getToken(authorization);
  const userId = parseUserId(jwtToken);

  const deletedItem = await deleteTodo(todoId, userId);

  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      deletedItem
    })
  }
}
