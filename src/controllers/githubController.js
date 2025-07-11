import axios from "axios";
import User from "../models/User";

export const githubLogin = (req, res) => {
  const baseUrl = `${process.env.GITHUB_AUTH_URL}/authorize`;
  const config = {
    client_id: process.env.GITHUB_CLIENT_ID,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const githubCallback = async (req, res) => {
  const baseUrl = `${process.env.GITHUB_AUTH_URL}/access_token`;
  const configObj = {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code: req.query.code,
  };
  const loginParams = new URLSearchParams(configObj).toString();
  const tokenRes = await (
    await axios.post(`${baseUrl}?${loginParams}`, {
      headers: { Accept: "application/json" },
    })
  ).data;

  const tokenFirst = tokenRes.split("&")[0].split("=");
  if ("access_token" == tokenFirst[0]) {
    const access_token = tokenFirst[1];
    const baseUrl = `${process.env.GITHUB_API_URL}/user`;

    const userData = await (
      await axios.get(baseUrl, {
        headers: { Authorization: `token ${access_token}` },
      })
    ).data;

    const emailData = await (
      await axios.get(`${baseUrl}/emails`, {
        headers: { Authorization: `token ${access_token}` },
      })
    ).data;
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );

    if (!emailObj) {
      return res.redirect("/login");
    }

    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        socialOnly: true,
        username: userData.login,
        email: emailObj.email,
        nickname: userData.name,
        location: userData.location,
        avatarUrl: userData.avatar_url,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};
