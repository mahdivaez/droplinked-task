import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProductFormProvider } from "../app/context/ProductFormContext";
import GeneralInformation from "../app/components/GeneralInformation"; // Adjust path if necessary

// Test wrapper to provide context
const TestComponent = () => (
  <ProductFormProvider>
    <GeneralInformation />
  </ProductFormProvider>
);

describe("GeneralInformation Component", () => {
  beforeEach(() => {
    render(<TestComponent />);
  });

  test("renders input fields", () => {
    // Check if the input fields are rendered
    expect(screen.getByLabelText(/Product Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Collection/i)).toBeInTheDocument();
  });

  test("allows image uploads", () => {
    // Simulate image upload
    const fileInput = screen.getByLabelText(/Upload product images/i);
    const file = new File(["dummy content"], "example.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Check if the image upload was successful
    expect(screen.getByAltText(/Product 1/i)).toBeInTheDocument();
  });
});
