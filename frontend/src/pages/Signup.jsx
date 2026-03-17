import { useState } from "react";
import axios from "axios";

function Signup({ setIsLoggedIn }) {

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

      // after signup → auto login
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);

      setIsLoggedIn(true);

    } catch (error) {

      console.error("Signup failed", error);
      alert("Signup failed");

    }

  };

  return (

    <div className="auth-container">

      <h2>Signup</h2>

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

    </div>

  );

}

export default Signup;