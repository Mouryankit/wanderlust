// import { useState } from "react";
// import { signup } from "../services/authService";

// function Signup() {

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: ""
//   });

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await signup(form);
//       alert(res.data.message);
//     } catch (err) {
//       alert(err.response.data.message);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input name="name" placeholder="Name" onChange={handleChange}/> <br></br>
//       <input name="email" placeholder="Email" onChange={handleChange}/> <br></br>
//       <input name="password" type="password" placeholder="Password" onChange={handleChange}/> <br></br>
//       <button type="submit">Signup</button>
//     </form>
//   );
// }

// export default Signup;



import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
import "../../styles/pages/auth.css";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/signup", {
        username,
        email,
        password,
      });

      alert("Signup Successful");

      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <form className="auth-form" onSubmit={handleSignup}>
          <h2>Create account</h2>
          <p>Join Wanderlust to get started</p>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Sign up</button>

          <div className="auth-link">
            <span>Already have an account?</span>
            <Link to="/login">Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;