import { useState } from "react";
import axios from "axios";

function Signup({ setIsLoggedIn, goToLogin }) {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {

    try {

      await axios.post("http://localhost:5000/api/auth/signup", {
        name,
        email,
        password
      });

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);

      setIsLoggedIn(true);

    } catch (error) {

      console.error(error);
      alert("Signup failed");

    }

  };

  return (
    <div className="auth-wrapper">
      <h1 className="auth-heading">AI Support Bot</h1>
      <div className="auth-card">

        <h2 className="auth-title">Create Account</h2>

        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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

        <button onClick={handleSignup}>
          Signup
        </button>

        <p className="auth-switch">
          Already have an account?{" "}
          <span onClick={goToLogin}>
            Login
          </span>
        </p>

      </div>
    </div>
  );
}

export default Signup;