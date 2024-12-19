import { userModel } from "../model/user.auth.model.js";
import bycrypt from "bcryptjs";

export const reset = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await userModel.findOne({ username });

    if (!user) {
      res?.status(404)?.json({ status: false, message: "user does not exist" });
      return;
    }

    if (user) {
      res
        ?.status(200)
        ?.json({ status: true, message: "user found", data: user?.username });
      return;
    }
  } catch (error) {
    res
      ?.status(500)
      ?.json({ status: false, message: "Internal server error" });
    return;
  }
};

export const createPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { username } = req.body.user;

    const hashedPassword = await bycrypt.hash(password, 10);

    await userModel.findOneAndUpdate(
      { username },
      { password: hashedPassword }
    );
    res?.status(200)?.json({ status: false, message: "password updated" });
    return;
  } catch (error) {
    console.log(error);
    
    res?.status(500)?.json({ status: false, message: "Internal server error" });
    return;
  }
};
