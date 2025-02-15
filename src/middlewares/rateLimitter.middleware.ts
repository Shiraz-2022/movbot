import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 1000,
  max: 5,
  message: "Too many requests. Try again later.",
});

export default limiter;
