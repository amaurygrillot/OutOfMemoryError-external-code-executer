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
        .get(`https://outofmemoryerror-back.azurewebsites.net/api/post/getPostById/${req.params.post_uid}`, { headers: { Authorization: AuthStr } })
        .then(result => {
          console.log("data : " + result.data.posts[0].person_uid)
          console.log("id : " + idPerson);
          if(result.data.posts[0].person_uid !== idPerson && idPerson !== req.params.user_uid)
          {
            return res.status(403).json({
              resp: false,
              message: 'Vous ne pouvez pas éditer ce post',
            }).end();
          }
        })
        .catch(error => {
          console.error(error)
          return res.status(500).json({
            resp: false,
            message: error.toString(),
          }).end();
        })
    next();
  } catch (err: any) {
    console.log("error : " + err)
    return res.status(500).json({
      resp: false,
      message: err.toString(),
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
