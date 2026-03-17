import { useState } from "react";
import axios from "axios";
import Signup from "./Signup";

function Login({ setIsLoggedIn }){
    const [email,setEmail]= useState("");
    const [password,setPassword]= useState("");
    const [showSignup, setShowSignup] = useState(false);

    const handleLogin = async()=>{
        try{
            const res = await axios.post(
                "http://localhost:5000/api/auth/login",
                {
                    email,
                    password
                }
            );

            //store token
            localStorage.setItem("token",res.data.token);
            setIsLoggedIn(true);

        } catch(error){
            console.error("Login failed", error);
            alert("Invalid credentials");

        }
    };

    if (showSignup) {
        return <Signup setIsLoggedIn={setIsLoggedIn} />;
    
    }
    return(
        <div className= "auth-container">

            <h2>Login</h2>

            <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e)=> setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e)=> setPassword(e.target.value)}
            />

            <button onClick={handleLogin}>

                Login

            </button>

            <p>
                Don't have an account?{" "}
                <span
                    style={{ color: "blue", cursor: "pointer" }}
                    onClick={() => setShowSignup(true)}
                >
                    Signup
                </span>
            </p>
        </div>
    );
}

export default Login;
