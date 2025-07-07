import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { FaGoogle, FaLinkedin, FaGithub } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";

function Login() {


  const [formData, setFormData] = useState({
    usernameOrEmail: "", // username or email
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate("/screen");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { usernameOrEmail, password  } = formData;
      
    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameOrEmail, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Login failed.");
      }

      setSuccess("Login successful!");

      // Optional: store token
      if (result.token) {
        localStorage.setItem("token", result.token);
      }
      navigate('/screen');
      
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Form
        onSubmit={handleSubmit}
        className="p-4 border rounded shadow-sm text-center"
        style={{ minWidth: "320px", maxWidth: "400px", width: "100%" }}
      >
        <h2 className="mb-4">Welcome to note-taker</h2>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control
            type="text"
            placeholder="Enter username or email"
            name="usernameOrEmail"
            value={formData.usernameOrEmail}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100 mb-3">
          Login
        </Button>

        <hr />
        
        <p className="mt-4 text-center">
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </Form>
    </Container>
  );
}

export default Login;
