const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
app.use(express.json());
app.use(cors('http://localhost:3000'));

const users = [
    {
      id: "1",
      username: "Sagala",
      password: "Sunda0908",
      isAdmin: true,
    },
    {
      id: "2",
      username: "rapla",
      password: "Rapla0908",
      isAdmin: false,
    },
  ];

  let refreshTokens = [];
  let Tokens = [];

app.post("/api/refresh", (req, res) => {
  //take the refresh token from the user
  const refreshToken = req.body.token;

  //send error if there is no token || it's invalid
  if (!refreshToken) return res.status(401).json("You are not authenticated!");
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json("Refresh token is not valid!");
  }
  jwt.verify(refreshToken, "myRefreshSecretKey", (err, user) => {
    console.log("user", user)
    err && console.log(err);
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    refreshTokens.push(newRefreshToken);

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });

  //if everything is ✅, create new access token, 🔄 token and send to ⛄️
});

const generateAccessToken = (user) => {
  return jwt.sign({id: user.id, isAdmin: user.isAdmin }, "mySecretKey", {
    expiresIn: "95s",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, "myRefreshSecretKey");
};

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => {
    return u.username === username && u.password === password;
  });
  if (user) {
    //Generate an access token
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    refreshTokens.push(refreshToken);
    Tokens.push(accessToken);
    res.json({
      username: user.username,
      isAdmin: user.isAdmin,
      accessToken,
      refreshToken,
    });
  } else {
    res.status(400).json("Username or password incorrect!");
  }
});

const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    console.log("Token", Tokens);
    console.log("token given", token);
    jwt.verify(token, "mySecretKey", (err, user) => {
      if (err) {
        console.log("user token", user)
        console.log(err);
        return res.status(403).json("Token is not valid!");
      }

      req.user = user;
      console.log("user token", user)
      next();
    });
  } else {
    res.status(401).json("You are not authenticated!");
  }
};

app.delete("/api/delete/:userId", verify, (req, res) => {
  if (req.user.id === req.params.userId || req.user.isAdmin) {
    console.log("req.user.id", req.user.id);
    res.status(200).json("User has been deleted.");
  } else {
    res.status(403).json("You are not allowed to delete this user!");
  }
});

app.post("/api/logout", verify, (req, res) => {
  const refreshToken = req.body.token;
  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  res.status(200).json("You logged out successfully.");
});

app.listen(5050, () => {
  console.log("Server is running on port 5050.");
} );