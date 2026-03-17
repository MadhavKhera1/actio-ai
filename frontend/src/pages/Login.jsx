import { useState } from "react";
import axios from "axios";
import Signup from "./Signup";

function Login({ setIsLoggedIn }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSignup, setShowSignup] = useState(false);

  if (showSignup) {
    return (
      <Signup
        setIsLoggedIn={setIsLoggedIn}
        goToLogin={() => setShowSignup(false)}
      />
    );
  }

  const handleLogin = async () => {

    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);

      setIsLoggedIn(true);

    } catch (error) {

      console.error(error);
      alert("Invalid credentials");

    }

  };

  return (
    <div className="auth-wrapper">
      <h1 className="auth-heading">AI Support Bot</h1>
      <div className="auth-card">

        <h2 className="auth-title">Login</h2>

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>
          Login
        </button>

        <p className="auth-switch">
          Don't have an account?{" "}
          <span onClick={() => setShowSignup(true)}>
            Signup
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;