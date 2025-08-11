// src/tests/SignUp.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SignUp from "../Authentication/SignUp";

// Mock navigate from react-router-dom
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.useFakeTimers();

beforeEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

describe("SignUp Page", () => {
  test("renders form fields", () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
  });

  test("shows error when passwords do not match", async () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "JohnDoe" } });
    fireEvent.change(screen.getByLabelText(/Email address/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "Password1" } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "Password2" } });

    fireEvent.click(screen.getByRole("button", { name: /Create Account/i }));

    expect(await screen.findByText(/Passwords do not match/i)).toBeInTheDocument();
  });

  test("successful signup calls API and navigates", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: "Success" }),
      })
    );

    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "JohnDoe" } });
    fireEvent.change(screen.getByLabelText(/Email address/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "Password1" } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "Password1" } });

    fireEvent.click(screen.getByRole("button", { name: /Create Account/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/auth\/signup$/),
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: expect.any(String),
        })
      );
      expect(screen.getByText(/Account created successfully/i)).toBeInTheDocument();
    });

    jest.runAllTimers();
  });

  test("shows error on failed signup", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: "Email already exists" }),
      })
    );

    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "JohnDoe" } });
    fireEvent.change(screen.getByLabelText(/Email address/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "Password1" } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "Password1" } });

    fireEvent.click(screen.getByRole("button", { name: /Create Account/i }));

    expect(await screen.findByText(/Email already exists/i)).toBeInTheDocument();
  });

  test("shows generic error on network failure", async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error("Network error")));

    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "JohnDoe" } });
    fireEvent.change(screen.getByLabelText(/Email address/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "Password1" } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "Password1" } });


    fireEvent.click(screen.getByRole("button", { name: /Create Account/i }));

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  test("disables button while submitting", async () => {
    let resolveFetch;
    global.fetch = jest.fn(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
    );

    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "JohnDoe" } });
    fireEvent.change(screen.getByLabelText(/Email address/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "Password1" } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "Password1" } });

    fireEvent.click(screen.getByRole("button", { name: /Create Account/i }));

    expect(screen.getByRole("button", { name: /Create Account/i })).toBeDisabled();

    resolveFetch({ ok: true, json: () => Promise.resolve({ message: "Success" }) });
  });

  test("does not call API if required fields are empty", () => {
    global.fetch = jest.fn();

    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /Create Account/i }));

    expect(global.fetch).not.toHaveBeenCalled();
  });
});
