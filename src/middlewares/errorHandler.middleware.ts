import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

interface HttpError extends Error {
  status?: number;
}

const errorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.error(err.stack);

  const status = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || "Internal Server Error";

  res.status(status).json({ message });
};

const setupGlobalErrorHandlers = () => {
  process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    // Perform necessary cleanup and exit
    process.exit(1);
  });

  process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    // Perform necessary cleanup
  });
};

export { errorHandler, setupGlobalErrorHandlers };
