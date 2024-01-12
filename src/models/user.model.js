import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
	{
		userName: {
			type: String,
			required: [true, "Username is required"],
			unique: [true, "UserName alredy taken, try other usernames"],
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: [true, "Email alredy in use, try other usernames"],
			match: [
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				"Please provide a valid email",
			],
		},
		dateOfBirth: {
			type: Date,
		},
		password: {
			type: String,
			required: [true, "Password is must"],
		},
		role: {
			type: String,
			enum: ["USER", "ADMIN"],
			default: "USER",
		},
		watchlist: [
			{
				type: Schema.Types.ObjectId,
				ref: "Movie",
			},
		],
		favourites: [
			{
				type: Schema.Types.ObjectId,
				ref: "Movie",
			},
		],
	},
	{ timestamps: true }
);

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	this.password = await bcrypt.hash(this.password, 10);
	next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
	return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateJwtToken = function () {
	return jwt.sign(
		{
			_id: this._id,
			email: this.email,
		},
		process.env.JWT_TOKEN_SECRET,
		{
			expiresIn: process.env.JWT_TOKEN_EXPIRY,
		}
	);
};

export const User = mongoose.model("User", userSchema);
