import jwt from "jsonwebtoken";

const generateUserToken = (res, user) => {
 
  if (user) {
    const payload = {
      id: user.id,
      email: user.email,
    };

    const token = jwt.sign(payload, "rapido", {
      expiresIn: "30d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, 
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, 
    });
    
    return res.status(200).json({
      message: "Login successful",
      token, 
    });
  }
};

export default generateUserToken;
