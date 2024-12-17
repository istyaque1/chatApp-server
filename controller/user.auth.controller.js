import { userModel } from "../model/user.auth.model.js";
import jwt from "jsonwebtoken";
import cloudinary from "../cloudinary/cloudinary.js";
import bycrypt from "bcryptjs";

export const userRegister = async (req, res) => {
  try {
    const { fullname, username, password, confirmpassword } = req.body;

    if (!fullname || !username || !password) {
      res
        .status(400)
        .json({ status: false, message: "All fields are required..." });
      return;
    }

    const alreadyUser = await userModel.findOne({ username });

    if (password !== confirmpassword) {
      res.status(400).json({
        status: false,
        message: "oops..! , password not matched..try again...",
      });
      return;
    }
    if (alreadyUser) {
      res
        .status(400)
        .json({ status: false, message: "User already exist, please login" });

      return;
    }
    if (req.file) {
      res.status(400).json({ status: false, message: "Image is required" });

      return;
    }

    const upload = await cloudinary.uploader.upload(req.file.path);

    const hashedPassword = await bycrypt.hash(password, 10);

    const newUser = new userModel({
      fullname,
      username,
      password: hashedPassword,
      profilepic: upload?.secure_url,
    });

    await newUser.save();
    res.status(200).json({
      status: true,
      message: "Registered successfull...",
      data: {
        fullname: newUser?.fullname,
        username: newUser?.username,
      },
    });

    return;
  } catch (error) {
    console.log(error);

    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res
        .status(400)
        .json({ status: false, message: "All fields are required..." });
      return;
    }

    const newUser = await userModel.findOne({ username });

    if (!newUser) {
      res
        .status(400)
        .json({ status: false, message: "User not registered..." });
      return;
    }

    const isCorrectPassword = await bycrypt.compare(
      password,
      newUser?.password
    );

    if (!isCorrectPassword) {
      res
        .status(400)
        .json({ status: false, message: "Password not matched..." });
      return;
    }

    const token = jwt.sign({ userID: newUser?._id }, process.env.MY_KEY);

    res.status(200).json({
      status: true,
      message: "LogIn successfull",
      token,
      userId: newUser?._id,
      username: newUser?.username,
      profilepic: newUser?.profilepic,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Internal server error" });
    console.log(error);

    return;
  }
};

export const getUsers = async (req, res) => {
  const loggedInUser = req.user;

  const users = await userModel.find({
    _id: { $ne: loggedInUser?._id },
  });

  res.status(200).json({
    status: true,
    users,
  });

  return;
};
