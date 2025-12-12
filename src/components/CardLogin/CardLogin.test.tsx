import { render, screen, fireEvent } from "@testing-library/react";
import CardLogin from "./index";

describe("CardLogin Component", () => {
  it("renders the card", () => {
    render(<CardLogin />);
    const card = document.querySelector(".card");
    expect(card).toBeInTheDocument();
  });

  it("renders the logo", () => {
    render(<CardLogin />);
    const logo = screen.getByAltText("Logo UN Bet");
    expect(logo).toBeInTheDocument();
  });

  it("renders initial view with login button", () => {
    render(<CardLogin />);
    expect(
      screen.getByRole("button", { name: /iniciar con cuenta un bet/i })
    ).toBeInTheDocument();
  });

  it("renders registration link", () => {
    render(<CardLogin />);
    expect(screen.getByText("Registrarme")).toBeInTheDocument();
  });

  it("shows login form when login button is clicked", () => {
    render(<CardLogin />);
    const loginButton = screen.getByRole("button", {
      name: /iniciar con cuenta un bet/i,
    });
    fireEvent.click(loginButton);

    expect(screen.getByPlaceholderText("Usuario")).toBeInTheDocument();
  });
});
