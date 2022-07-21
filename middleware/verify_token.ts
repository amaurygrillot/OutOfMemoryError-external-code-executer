import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
const {jwt} = require("jsonwebtoken")
interface IPayload {
  idPerson: string;
}
/* Récupération du header bearer */
const extractBearerToken = (headerValue: string) => {
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
      message: "Access non autorisé",
    });
  }

  try {
    const payload = jwt.verify(
      token,
      `${process.env.TOKEN_SECRET}`
    ) as JwtPayload;

    req.body.idPerson = payload.idPerson;

    next();
  } catch (err: any) {
    console.log("error : " + err)
    return res.status(500).json({
      resp: false,
      message: 'there was an error : ' + err.toString(),
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
