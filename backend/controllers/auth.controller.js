import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const {
      sub,
      email,
      name,
      picture,
      email_verified
    } = payload;

    // TODO: Check user in DB
    // let user = await User.findOne({ email });

    // if (!user) create new user

    const jwtToken = jwt.sign(
      { userId: sub, email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      jwt: jwtToken,
      user: { email, name, picture }
    });

  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Invalid Google token"
    });
  }
};
