import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;
    console.log(reqBody);

    // Check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 } // 409 Conflict status code for user already exists
      );
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    console.log(savedUser);

    // Send verification email
    // await sendEmail({email, emailType: "VERIFY", userId: savedUser._id})

    return NextResponse.json(
      { message: "User created successfully", success: true, savedUser },
      { status: 201 } // 201 Created status code for successful signup
    );
  } catch (error: any) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}