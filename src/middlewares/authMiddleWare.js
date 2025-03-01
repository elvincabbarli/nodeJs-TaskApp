import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const authToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findOne({
      _id: verified._id,
      "tokens.token": token,
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid token or user not found" });
    }
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
