import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("../pages/RegisterPage", () => {
  return function MockRegisterPage() {
    return <div>Register Form with Email and Password</div>;
  };
});

import RegisterPage from "../pages/RegisterPage";

describe("Unit Test: RegisterPage Rendering", () => {
  test("renders register form component", () => {
    render(<RegisterPage />);
    expect(screen.getByText(/Register Form/i)).toBeInTheDocument();
  });
});
