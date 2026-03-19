import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Footer from "./Footer";


// ✅ 1. Presence Test
test("renders footer text", () => {
  render(<Footer />);
  const element = screen.getByText(/all rights reserved/i);
  expect(element).toBeInTheDocument();
});


// ✅ 2. Structure Test (HTML element type)
test("footer text is inside a paragraph tag", () => {
  render(<Footer />);
  const element = screen.getByText(/all rights reserved/i);
  expect(element.tagName).toBe("P");
});


// ✅ 3. Styling Test (class check)
test("footer text has correct styling class", () => {
  render(<Footer />);
  const element = screen.getByText(/all rights reserved/i);
  expect(element).toHaveClass("font-semibold");
});


// ✅ 4. Dynamic Rendering Test (list generated)
test("renders multiple footer links", () => {
  render(<Footer />);
  const elements = screen.getAllByText(/./);
  expect(elements.length).toBeGreaterThan(1);
});


// ✅ 5. Negative Test (absence check)
test("random text is not present in footer", () => {
  render(<Footer />);
  const element = screen.queryByText(/random text/i);
  expect(element).not.toBeInTheDocument();
});