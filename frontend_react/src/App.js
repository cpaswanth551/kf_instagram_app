import { useEffect, useState } from "react";
import "./App.css";
import Posts from "./Posts";
import { Box, Button, Input, makeStyles, Modal } from "@mui/material";
import ImageUpload from "./ImageUpload";

const BASE_URL = "http://localhost:8000/";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function App() {
  const [posts, setPost] = useState([]);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [username, setUsername] = useState(() =>
    window.localStorage.getItem("username")
  );
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [authToken, setAuthToken] = useState(() =>
    window.localStorage.getItem("authToken")
  );
  const [authTokenType, setAuthTokenType] = useState(() =>
    window.localStorage.getItem("authTokenType")
  );
  const [userId, setUserId] = useState(() =>
    window.localStorage.getItem("userId")
  );

  useEffect(() => {
    authToken
      ? window.localStorage.setItem("authToken", authToken)
      : window.localStorage.removeItem("authToken");
    authTokenType
      ? window.localStorage.setItem("authTokenType", authTokenType)
      : window.localStorage.removeItem("authTokenType");
    username
      ? window.localStorage.setItem("username", username)
      : window.localStorage.removeItem("username");
    userId
      ? window.localStorage.setItem("userId", userId)
      : window.localStorage.removeItem("userId");
  }, [authToken, authTokenType, userId]);

  useEffect(() => {
    fetch(BASE_URL + "post/all")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const result = data.sort((a, b) => {
          const t_a = a.timestamp.split(/[-T:]/);
          const t_b = b.timestamp.split(/[-T:]/);
          const d_a = new Date(
            Date.UTC(t_a[0], t_a[1] - 1, t_a[2], t_a[3], t_a[4], t_a[5])
          );
          const d_b = new Date(
            Date.UTC(t_b[0], t_b[1] - 1, t_b[2], t_b[3], t_b[4], t_b[5])
          );
          return d_b - d_a;
        });
        return result;
      })
      .then((data) => {
        setPost(data);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      });
  }, []);

  const signOut = (event) => {
    setAuthToken(null);
    setAuthTokenType(null);
    setUserId("");
    setUsername("");
  };

  const signIn = (event) => {
    event?.preventDefault();
    let formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    const requestOptions = {
      method: "POST",
      body: formData,
    };

    fetch(BASE_URL + "login", requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        console.log(data);
        setAuthToken(data.access_token);
        setAuthTokenType(data.token_type);
        setUserId(data.user_id);
        setUsername(data.username);
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });

    setOpenSignIn(false);
  };
  const signUP = (event) => {
    event?.preventDefault();
    const json_string = JSON.stringify({
      username: username,
      email: email,
      password: password,
    });
    const requestOption = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: json_string,
    };

    fetch(BASE_URL + "user/", requestOption)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        // console.log(data);
        signIn();
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });

    setOpenSignUp(false);
  };

  return (
    <div className="app">
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <Box sx={modalStyle}>
          <form className="app_signin" onSubmit={signIn}>
            <center>
              <img
                className="app_headerImage"
                src="https://www.virtualstacks.com/wp-content/uploads/2019/11/instagram-logo-name-300x78.png"
                alt="Instagram"
              />
            </center>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Login
            </Button>
          </form>
        </Box>
      </Modal>
      <Modal open={openSignUp} onClose={() => setOpenSignUp(false)}>
        <Box sx={modalStyle}>
          <form className="app_signin" onSubmit={signUP}>
            <center>
              <img
                className="app_headerImage"
                src="https://www.virtualstacks.com/wp-content/uploads/2019/11/instagram-logo-name-300x78.png"
                alt="Instagram"
              />
            </center>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Sign UP
            </Button>
          </form>
        </Box>
      </Modal>
      <div className="app_header">
        <img
          className="app_headerImage"
          src="https://www.virtualstacks.com/wp-content/uploads/2019/11/instagram-logo-name-300x78.png"
          alt="Instagram"
        />
        <div>
          {authToken ? (
            <Button onClick={() => signOut()}>Logout</Button>
          ) : (
            <div>
              <Button onClick={() => setOpenSignIn(true)}>Login</Button>
              <Button onClick={() => setOpenSignUp(true)}> Signup</Button>
            </div>
          )}
        </div>
      </div>
      <div className="app_posts">
        {posts.map((post) => (
          <Posts
            key={post.id}
            post={post}
            authToken={authToken}
            authTokenType={authTokenType}
            username={username}
          />
        ))}
      </div>
      {authToken ? (
        <ImageUpload
          authToken={authToken}
          authTokenType={authTokenType}
          userId={userId}
        />
      ) : (
        <h3>You need to login to upload</h3>
      )}
    </div>
  );
}

export default App;
