import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Footer from "../components/Footer";
import { footerLinks } from "../constants";

test("renders all footer links from data", () => {
  render(<Footer />);
  
  footerLinks.forEach((link) => {
    const element = screen.getByText(link);
    expect(element).toBeInTheDocument();
  });
});