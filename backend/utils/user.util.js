import jwt from "jsonwebtoken";

const generateUserToken = (res, user) => {
  console.log(user)
  if (user) {
    const payload = {
      id: user.id,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "30d",
    });

    

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, 
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    console.log("Token generated and set in cookie",token);
    return res.status(200).json({
      message: "Login successful",
      token, // optional: only if you want to send via API
    });
  }
};

export default generateUserToken;
