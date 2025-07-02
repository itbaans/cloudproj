const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const generateToken = require("../utils/jwt");

// for node mailer
const crypto = require("crypto");
const transporter = require("../mail");

const signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ error: "Username, email, and password are required." });
  }

  try {
    const existingUsername = await userModel.findUserByUsername(username);
    if (existingUsername) {
      return res.status(409).json({ error: "Username is already taken." });
    }

    const existingEmail = await userModel.findUserByEmail(email);
    if (existingEmail) {
      return res.status(409).json({ error: "Email is already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const token = crypto.randomBytes(32).toString("hex");

    const newUser = await userModel.createUser(
      username,
      email,
      hashedPassword,
      token
    );

    // Send verification email
    const verificationUrl = `http://localhost:5000/auth/verify/${token}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your email",
      html: `<h2>Welcome to note-taker-prototype!</h2><p>Click the link below to verify your email:</p>
           <a href="${verificationUrl}">Verify Email</a>`,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(201)
      .json({ message: "Account created. Please verify your email." });

    res.status(201).json({
      message: "User created",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const verifyEmail = async (req, res) => {
  const { token } = req.params;

  const user = await userModel.findUserByVerificationToken(token);

  if (!user) {
    return res.status(400).json({ error: "Invalid or expired token." });
  }

  await userModel.markUserAsVerified(user.id);

  res.send("<h2>Email verified successfully! You can now log in.</h2>");
};


const login = async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  // 1. Basic validation
  if (!usernameOrEmail || !password) {
    return res
      .status(400)
      .json({ error: "Username/email and password are required." });
  }

  // 2. Find user
  const user = await userModel.findUserByUsernameOrEmail(usernameOrEmail);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials." });
  }
  
  if (!user.is_verified) {
  return res.status(403).json({ error: "Email not verified." });
}

  // 3. Compare password
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    return res.status(401).json({ error: "Wrong Password" });
  }

  await userModel.updateLastLogin(user.id);

  const token = generateToken(user.id);
  // 4. Login success
  res.status(200).json({
    message: "Login successful",
    token: token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
};

module.exports = {
  signup,
  login,
  verifyEmail
};
