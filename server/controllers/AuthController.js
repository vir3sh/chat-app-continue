import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from "../models/UserModel.js";

const JWT_EXPIRATION = '1h'; // Token expiration time
const maxAge = 3 * 24 * 60 * 60; // 3 days in seconds
const SECRET_KEY = process.env.SECRET_KEY || 'your_default_secret_key';

// Helper function to generate JWT tokens
const createToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: JWT_EXPIRATION });
};

export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already in use" });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await User.create({ email, password: hashedPassword });

    // Generate JWT token
    const token = createToken(user);

    // Set a cookie with the token
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie("jwt", token, {
      maxAge: maxAge * 1000, // Convert to milliseconds
      secure: false,
      sameSite:   "none" ,
    });

    // Respond with the new user
    return res.status(201).json({
      success: true,
      message: "Account created successfully!",
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      }
    });
  } catch (error) {
    console.error("Signup Error:", error.message);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Login /////////////////////////////////////////////////////////////////////////////////////////////////////

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = createToken(user);

    // Set a cookie with the token
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie("jwt", token, {
      maxAge: maxAge * 1000, // Convert to milliseconds
      secure:false,
      sameSite: "none",
    });

    // Respond with the user details
    return res.status(200).json({
      success: true,
      message: "Login successful!",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
        profileSetup: user.profileSetup,
      }
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
