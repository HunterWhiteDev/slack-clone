import { Button, Input } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./Login.css";
import { useStateValue } from "../../StateProvider";
import { signInWithEmail, auth, signUp } from "../../firebase";
import { actionTypes } from "../../reducer";
import { useHistory } from "react-router-dom";
function Login() {
  const [login, setLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [{ user }, dispatch] = useStateValue();

  const history = useHistory();

  useEffect(() => {
    history.push("/");
  }, []);

  const signIn = () => {
    if (login) {
      signInWithEmail(auth, email, password)
        .then((authUser) => {
          dispatch({ user: authUser.user, type: actionTypes.SET_USER });
        })
        .catch((error) => alert(error.message));
    } else {
      if (password !== confirmPassword) return alert("Passwords must match.");
      signUp(auth, email, password)
        .then()
        .catch((error) => alert(error.message));
    }
  };
  return (
    <div className="login">
      <div className="login__container">
        <img
          src="https://cdn.mos.cms.futurecdn.net/SDDw7CnuoUGax6x9mTo7dd-1024-80.jpg.webp"
          alt=""
        />
        <h1>Sign in to Slack Clone</h1>

        <p className="login__warning">
          Note: This is a clone of Slack for demonstration purposes. Do not
          login with your actual Slack credentials.
        </p>

        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
        />
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          type="password"
        />
        {login ? (
          <>
            <p>
              Don't have an account yet?{" "}
              <span
                onClick={() => setLogin(!login)}
                className="login__containerSignInText"
              >
                Sign Up Now!
              </span>
            </p>
          </>
        ) : (
          <>
            <Input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="confirm password"
              type="password"
            />
            <p>
              Already have an account?{" "}
              <span
                className="login__containerSignInText"
                onClick={() => setLogin(!login)}
              >
                Login Here
              </span>
            </p>
          </>
        )}

        <Button onClick={signIn}>{login ? "Login" : "Sign Up"}</Button>
      </div>
    </div>
  );
}

export default Login;
