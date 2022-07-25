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
    req.body.idPerson = idPerson;
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
export const verifySameIdPost = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
  const token =
      req.headers.authorization && extractBearerToken(req.headers.authorization);
  const AuthStr = 'Bearer ' + token;
  const axios = require('axios')
  const idPerson = req.body.idPerson;
  await axios
      .get(`https://outofmemoryerror-back.azurewebsites.net/api/post/getPostById/${req.body.commentId}`, { headers: { Authorization: AuthStr } })
      .then(result => {
        console.log("data : " + result.data.posts)
        console.log("id : " + idPerson);
        if(result.data.posts[0].person_uid !== idPerson)
        {
          return res.status(401).json({
            resp: false,
            message: 'Vous ne pouvez pas éditer ce post',
          }).end();
        }
        next();
      })
      .catch(error => {
        console.error(error)
        return res.status(500).json({
          resp: false,
          message: error.toString(),
        }).end();
      })
};
