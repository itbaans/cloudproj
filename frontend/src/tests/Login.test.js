import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../Authentication/Login";
import { useAuth } from "../Authentication/AuthContext";

// Mock AuthContext
jest.mock("../Authentication/AuthContext", () => ({
  useAuth: jest.fn(),
}));

// Mock API_BASE_URL
jest.mock("../App/config", () => ({
  API_BASE_URL: "http://mock-api",
}));

// Mock navigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const original = jest.requireActual("react-router-dom");
  return {
    ...original,
    useNavigate: () => mockNavigate,
  };
});

describe("Login Component", () => {
  let mockLogin;

  beforeEach(() => {
    mockLogin = jest.fn();
    useAuth.mockReturnValue({ login: mockLogin });
    jest.clearAllMocks();
  });

  test("renders login form", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Username or Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sign In/i })).toBeInTheDocument();
  });

  test("successful login", async () => {
    // Mock fetch success
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: "mock-token" }),
      })
    );

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Username or Email/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    await waitFor(() =>
      expect(screen.getByText(/Login successful/i)).toBeInTheDocument()
    );

    expect(mockLogin).toHaveBeenCalledWith("mock-token");
    expect(mockNavigate).toHaveBeenCalledWith("/home");
  });

  test("failed login", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: "Invalid credentials" }),
      })
    );

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Username or Email/i), {
      target: { value: "wronguser" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    await waitFor(() =>
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument()
    );

    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
