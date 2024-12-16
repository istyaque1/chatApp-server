import { userModel } from "../model/user.auth.model.js";
import jwt from "jsonwebtoken";

const protedtedRoute = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  const verify = jwt.verify(token, process.env.MY_KEY);

  const userID = verify?.userID;

  const user = await userModel.findById(userID).select("-password");

  req.user = user;
  next();
};

export default protedtedRoute;
