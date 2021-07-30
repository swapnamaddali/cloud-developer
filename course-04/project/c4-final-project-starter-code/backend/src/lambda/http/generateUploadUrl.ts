import 'source-map-support/register'
import { getFileUrl } from '../../services/todosService';
import { getToken, parseUserId } from '../../auth/utils';
import { createLogger } from '../../utils/logger';

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';

const logger = createLogger('generateUploadUrlLogger');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;
  logger.info('Processing event: ', { event: event });

  const authorization = event.headers.Authorization;
  const jwtToken = getToken(authorization);
  const userId = parseUserId(jwtToken);

  const url = await getFileUrl(todoId, userId);

  // Return a presigned URL to upload a file for a TODO item with the provided id
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl: url
    })
  };
}