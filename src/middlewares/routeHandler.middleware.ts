import { Request, Response, NextFunction } from "express";

// Augment the Express Response interface to include custom error and success methods.
declare module "express-serve-static-core" {
  interface Response {
    error: (code: number, message: string) => Response;
    success: (code: number, message: string, result?: any) => Response;
  }
}

// Custom route handler to add success and error methods to the response object.
const routeHandler = (req: Request, res: Response, next: NextFunction) => {
  res.error = (code: number, message: string) => {
    return res.status(code).json({ success: false, message });
  };

  res.success = (code: number, message: string, result: any) => {
    return res.status(code).json({ success: true, message, result });
  };

  return next();
};

export default routeHandler;
