

import { TodoItem } from '../models/TodoItem';
import { TodoAccess } from '../data/todosDataAccess';
import { ImageAccess } from '../data/todosFileAccess';

import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';

import { createLogger } from '../utils/logger';

const logger = createLogger('todosServices');

const todoAccess = new TodoAccess();
const imageAccess = new ImageAccess();

export async function getFileUrl(todoId: string, userId: string): Promise<string> {
  // Get pre-signed URL from filestore
  const url = await imageAccess.getUploadUrl(todoId);
  logger.info('url', { url: url });

  // Write final url to datastore
  await todoAccess.updateTodoUrl(todoId, userId);
  return url;
}

export async function deleteTodo(todoId: string, userId: string) {
  return await todoAccess.deleteTodo(todoId, userId);
}

export async function getTodos(userId: string): Promise<TodoItem[]> {
  return todoAccess.getTodos(userId);
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {

  logger.info('Entering CreateToDo Service');

  const todoId = "RAN_ID" + Math.random();
  const timestamp = new Date().toISOString();

  return await todoAccess.createTodo({
    userId: userId,
    todoId: todoId,
    createdAt: timestamp,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false,
    // attachmentUrl?: string
  });
}

export async function updateTodo(
  todoId: string,
  updateTodoRequest: UpdateTodoRequest,
  userId: string
): Promise<TodoItem> {

  logger.info('Entering UpdateToDO Service');

  return await todoAccess.updateTodo({
    name: updateTodoRequest.name,
    dueDate: updateTodoRequest.dueDate,
    done: updateTodoRequest.done,
  },
  todoId,
  userId);

}