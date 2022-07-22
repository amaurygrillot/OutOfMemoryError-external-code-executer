import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface IPayload {
  idPerson: string;
}
/* Récupération du header bearer */
const extractBearerToken = (headerValue: string) => {
  console.log(headerValue)
  const matches = headerValue.match(/(bearer)\s+(\S+)/i);
  return matches && matches[2];
};

// Verify token to Routes
export const  verifyToken = async (
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
    const jwt = require("jsonwebtoken");
    const payload = jwt.verify(
      token,
      `${process.env.TOKEN_SECRET}`
    ) as JwtPayload;
    payload
    const idPerson = payload.idPerson;
    const axios = require('axios')
    const AuthStr = 'Bearer ' + token;
    await axios
        .get('https://outofmemoryerror-back.azurewebsites.net/api/post/getAllPosts', { headers: { Authorization: AuthStr } })
        .then(result => {
          console.log("data : " + result.data.posts[0].person_uid)
          console.log("id : " + idPerson);
          if(result.data.posts[0].person_uid !== idPerson)
          {
            return res.status(403).json({
              resp: false,
              message: 'you are not allowed to edit this post',
            }).end();
          }
          else
          {
            req.body.idPerson = idPerson;
          }
        })
        .catch(error => {
          console.error(error)
        })
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
