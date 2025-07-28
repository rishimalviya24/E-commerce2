  import mongoose, { mongo } from "mongoose";
  import bcrypt from "bcryptjs";
  import jwt from "jsonwebtoken";
  import config from "../config/config.js";

  const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: [true, "Username is already exist"],
      trim: true,
      lowercase: true,
      minlength: [3, "Username must be atleast 3 character"],
      maxlength: [20, "Username must be atmost 20 character"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email is already exist"],
      trim: true,
      lowercase: true,
      minlength: [6, "Email must be atleast 6 character"],
      maxlength: [50, "Email must be atmost 50 character"],
    },
    profileImage: {
      type: String,
      default:
        "https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg",
    },
    password: {
      type: String,
    },
  });

  userSchema.statics.hashPassword = async function (password) {
    if (!password) {
      throw new Error("Password is required");
    }
    const salt = await bcrypt.genSalt(10);

    return bcrypt.hash(password, 10);
  };

  userSchema.methods.comparePassword = async function (password) {
    if (!password) {
      throw new Error("Password is required");
    }

    if (!this.password) {
      throw new Error("Password is required");
    }

    return bcrypt.compare(password, this.password);
  };

  userSchema.methods.generateToken = function () {
    const token = jwt.sign(
      {
        _id: this._id,
        username: this.username,
        email: this.email,
      },
      config.JWT_SECRET,
      {
        expiresIn: config.JWT_EXPIRES_IN,
      }
    );
    return token;
  };

userSchema.statics.verifyToken = function (token) {
    if (!token) {
        throw new Error("Token is required");
    }


    return jwt.verify(token, config.JWT_SECRET);
}


const userModel = mongoose.model("user", userSchema);

  export default userModel;
