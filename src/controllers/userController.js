import sharp from "sharp";
import Task from "../models/task.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";

export const registerUser = async (req, res) => {
  const { name, email, password, age } = req.body;

  if (!name || !email || !password || !age) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      name,
      email,
      password,
      age,
    });

    await newUser.save();

    const token = await newUser.generateAuthToken();

    res.status(201).json({ newUser, token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const uploadUserProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    return res.send("Image Uploaded");
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteUserAvatar = async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    return res.send("Avatar Deleted");
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getUserPRofilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User Not Found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = await user.generateAuthToken();

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const logOut = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (item) => item.token !== req.token
    );
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const logOutAll = async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await User.findById(_id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const _id = req.params.id;

    const user = await User.findById(_id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update user data
    Object.assign(user, req.body);
    await user.save(); // Triggers the pre-save middleware

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateMyUser = async (req, res) => {
  try {
    Object.assign(req.user, req.body);
    await req.user.save();
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const _id = req.params.id;
    const deletedUser = await User.findByIdAndDelete(_id);
    res.status(200).json({ message: "User Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// !Duzgun bir yanasma deil Çünki DRY prinsipini pozuram normalda modelin içərisində yazmalıyam ama hal-hazırda öyrənmə ərəfəsində olduğum üçün bura yenidən qayıdıb düzəltməyə çalışacam

export const deletePersonalUser = async (req, res) => {
  try {
    await Task.deleteMany({ owner: req.user._id });

    await User.findByIdAndDelete(req.user._id);

    res.status(200).json({ message: "User Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
