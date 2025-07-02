import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { FaGoogle, FaLinkedin, FaGithub } from "react-icons/fa";

function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleOAuthSignup = (provider) => {
    window.location.href = `https://your-backend.com/auth/${provider}`;
  };

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

    const { name, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      const response = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name, email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong.");
      }

      setSuccess("Account created successfully. Redirecting...");
      // Optionally redirect
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Form
        className="p-4 border rounded shadow-sm text-center"
        style={{ minWidth: "320px", maxWidth: "400px", width: "100%" }}
        onSubmit={handleSubmit}
      >
        <h2 className="mb-4">Sign Up</h2>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            name="name"
            type="text"
            placeholder="John Doe"
            required
            value={formData.name}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            name="email"
            type="email"
            placeholder="johndoe@gmail.com"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            name="password"
            type="password"
            placeholder="Create a strong password"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="formConfirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            name="confirmPassword"
            type="password"
            placeholder="Re-enter your password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100 mb-3">
          Create Account
        </Button>

        <hr />
        <p className="text-muted">Or sign up with</p>

        <div className="d-flex justify-content-center gap-3 mb-3">
          <Button
            variant="light"
            onClick={() => handleOAuthSignup("google")}
            className="border rounded-circle p-3"
          >
            <FaGoogle size={24} />
          </Button>
          <Button
            variant="light"
            onClick={() => handleOAuthSignup("linkedin")}
            className="border rounded-circle p-3"
          >
            <FaLinkedin size={24} />
          </Button>
          <Button
            variant="light"
            onClick={() => handleOAuthSignup("github")}
            className="border rounded-circle p-3"
          >
            <FaGithub size={24} />
          </Button>
        </div>

        <p className="mt-4 text-center">
          Already have an account? <a href="/login">Login</a>
        </p>
      </Form>
    </Container>
  );
}

export default SignUp;
