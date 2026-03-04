import { User } from "../models/user.js";
import bcrypt from "bcrypt";

// EXPORT this function so authRoutes.js can use it
export const register = async (req, res) => {
  //with aync application can do other stuffs while waiting for the database
  try {
    // it takes time so you can send other request meantime
    // GRAB the data the user sent us
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.render("register", {
        error: "All fields are required!",
      });
    }

    // Check username length
    if (username.length < 3) {
      return res.render("register", {
        error: "Username must be at least 3 characters long!",
      });
    }

    // Check password length
    if (password.length < 6) {
      return res.render("register", {
        error: "Password must be at least 6 characters long!",
      });
    }

    // Check email format (basic check)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.render("register", {
        error: "Please enter a valid email address!",
      });
    }
    const existingUser = await User.findOne({ email });
    // use await with every database operation
    if (existingUser) {
      return res.render("register", {
        error: "User with this email already exists!",
      });
    }
    // hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //not saved yet, just prepared
    const newUser = new User({ username, email, password: hashedPassword });
    // SAVE it to the database (this is when it actually goes in!)
    await newUser.save();

    res.redirect("/login"); // on success
  } catch (error) {
    res.render("register", {
      error: "Something went wrong. Please try again.",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.render("login", {
        error: "Invalid email",
      });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      //wrong password
      return res.render("login", {
        error: "Invalid password",
      });
    }
    res.render("dashboard", { username: user.username }); //success
  } catch (error) {
    res.render("login", {
      error: "Something went wrong. Please try again.",
    });
  }
};
