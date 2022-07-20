import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface IPayload {
  idPerson: string;
}
/* Récupération du header bearer */
const extractBearerToken = (headerValue: string) => {
  if (typeof headerValue !== "string") {
    return false;
  }

  const matches = headerValue.match(/(bearer)\s+(\S+)/i);
  return matches && matches[2];
};

// Verify token to Routes
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.headers.authorization && extractBearerToken(req.headers.authorization);

  if (!token) {
    return res.status(401).json({
      resp: false,
      message: "Access non authoriser",
    });
  }

  try {
    const payload = jwt.verify(
      token,
      `${process.env.TOKEN_SECRET}`
    ) as JwtPayload;

    req.idPerson = payload.idPerson;

    next();
  } catch (err) {
    return res.status(500).json({
      resp: false,
      message: err,
    });
  }
};

// Verify token to Socket
export const verifyTokenSocket = (token: string): [boolean, string] => {
  try {
    const payload = jwt.verify(
      token,
      `${process.env.TOKEN_SECRET}`
    ) as IPayload;

    return [true, payload.idPerson];
  } catch (err) {
    return [false, ""];
  }
};
