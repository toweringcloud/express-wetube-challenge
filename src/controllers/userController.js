import bcrypt from "bcrypt";
import User from "../models/User";

export const signupView = (req, res) => {
  return res.render("users/join", { pageTitle: "Join" });
};
export const signup = async (req, res) => {
  const { username, email, password, password2 } = req.body;
  const pageTitle = "Join";
  if (password !== password2) {
    return res.status(400).render("users/join", {
      pageTitle,
      errorMessage: "😖 Password confirmation does not match.",
    });
  }
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (exists) {
    return res.status(400).render("users/join", {
      pageTitle,
      errorMessage: "😖 This username or email is already taken.",
    });
  }
  try {
    await User.create({
      username,
      email,
      password,
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("home", {
      pageTitle: "Home",
      errorMessage: error._message,
    });
  }
};

export const signinView = (req, res) => {
  return res.render("users/login", { pageTitle: "Login" });
};
export const signin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  const user = await User.findOne({ username, socialOnly: false });
  if (!user) {
    return res.status(400).render("users/login", {
      pageTitle,
      errorMessage: "😖 An account with this username does not exists.",
    });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("users/login", {
      pageTitle,
      errorMessage: "Wrong password",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

export const signout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const readProfile = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate("videos");
  if (!user) {
    return res.status(404).render("404", { pageTitle: "User not found." });
  }
  console.log(`${Date.now()} | ${user.username} | ${user._id}`);
  return res.render("users/profile", {
    pageTitle: user.username,
    user,
  });
};

export const updateProfileView = (req, res) => {
  return res.render("users/edit", { pageTitle: "Edit Profile" });
};
export const updateProfile = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { email, username, nickname, location },
    file,
  } = req;
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      email,
      username,
      nickname,
      location,
      avatarUrl: file ? file.path : avatarUrl,
    },
    { new: true }
  );
  req.session.user = updatedUser;
  return res.redirect("/users/edit");
};

export const changePasswordView = (req, res) => {
  if (req.session.user.socialOnly === true) {
    return res.redirect("/");
  }
  return res.render("users/change-pw", { pageTitle: "Change Password" });
};
export const changePassword = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { oldPassword, newPassword, newPassword2 },
  } = req;
  const user = await User.findById(_id);
  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) {
    return res.status(400).render("users/change-pw", {
      pageTitle: "Change Password",
      errorMessage: "😖 The current password is incorrect",
    });
  }
  if (newPassword !== newPassword2) {
    return res.status(400).render("users/change-pw", {
      pageTitle: "Change Password",
      errorMessage: "😖 The password does not match the confirmation",
    });
  }
  user.password = newPassword;
  await user.save();
  return res.redirect("/logout");
};
