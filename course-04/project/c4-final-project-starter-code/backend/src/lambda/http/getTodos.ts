import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import { getTodos } from '../../services/todosService';

import { getToken, parseUserId } from '../../auth/utils';
import { createLogger } from '../../utils/logger';

const logger = createLogger('getTodos');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  logger.info('Processing event: ', {event: event});

  const authorization = event.headers.Authorization;
  const jwtToken = getToken(authorization);
  const userId = parseUserId(jwtToken);
 
  logger.info('useris: ', { string: userId });

  const todos = await getTodos(userId);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items: todos
    })
  }
}

