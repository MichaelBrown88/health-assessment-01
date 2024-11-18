import * as functions from 'firebase-functions/v2';

export const logger = functions.logger;

export function logError(error: unknown, context: string) {
  logger.error(`Error in ${context}:`, error);
}

export function logInfo(message: string, data?: Record<string, unknown>) {
  logger.info(message, data);
}
