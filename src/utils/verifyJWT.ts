import { verify } from "jsonwebtoken";

export const verifyJWT = (token: string): boolean => {
  const SECRET = process.env.APP_SECRET || "";
  console.log(SECRET);
  try {
    return !!verify(token, SECRET);
  } catch (err) {
    console.log(err);
    return false;
  }
};
