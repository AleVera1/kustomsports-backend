import logger from "../loggers/Log4jsLogger.js";

export default function loggerMiddleware(ctx, next) {
  logger.info(`[${ctx.method}] ${ctx.originalUrl}`);
  next();
}
