const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const generateToken = require("../utils/generateToken");


const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({
        message: "Email already in use",
      });
    }

    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return res.status(400).json({
        message: "Username already in use",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error " + error,
      error,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // const token = jwt.sign(
    //   { id: user._id },
    //   process.env.JWT_SECRET,
    //   { expiresIn: "7d" }
    // );
    const token = generateToken(user._id);

    res.json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    // For JWT, we just tell the client to discard the token.
    // If we had a blacklist or refresh tokens, we'd handle them here.
    res.json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error during logout", error });
  }
};

exports.googleLogin = async (req, res) => {
  // console.log("not working");
  // console.log(req.body); 
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "ID token is required" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name } = payload;

    if (!email) {
      return res
        .status(400)
        .json({ message: "Google account has no email associated" });
    }

    let user = await User.findOne({ googleId: sub });

    if (!user) {
      user = await User.findOne({ email });
    }

    if (!user) {
      const usernameFromEmail = email.split("@")[0];

      user = await User.create({
        username: name || usernameFromEmail,
        email,
        googleId: sub,
        password: "",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login with Google successful",
      token,
      user,
    });
  }
  // catch (error) {
  //   res.status(401).json({
  //     message: "Google login failed",
  //     error,
  //   });
  // }
  catch (error) {
    console.log("GOOGLE ERROR:", error);
    res.status(401).json({
      message: "Google login failed",
      error: error.message
    });
  }
};


