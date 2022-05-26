import * as jwt from "jsonwebtoken";

type DecodeTokenProps = {
  id: number;
  email: string;
  gender: string;
  name: string;
  isAuth: boolean;
  iat: number;
  exp: number;
};

export const decoder = (token: string): DecodeTokenProps => {
  const decodedToken = jwt.decode(token);

  if (decodedToken == null) {
    return {
      id: 0,
      email: "",
      gender: "",
      name: "",
      isAuth: false,
      iat: 0,
      exp: 0,
    };
  }

  if (typeof decodedToken === "string") {
    return {
      id: 0,
      email: "",
      gender: "",
      name: "",
      isAuth: false,
      iat: 0,
      exp: 0,
    };
  }

  return decodedToken as DecodeTokenProps;
};
