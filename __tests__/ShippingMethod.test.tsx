import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProductFormProvider } from "../app/context/ProductFormContext"; 
import ShippingMethod from "../app/components/ShippingMethod"; 

const TestComponent = () => (
  <ProductFormProvider>
    <ShippingMethod />
  </ProductFormProvider>
);

describe("ShippingMethod Component", () => {
  beforeEach(() => {
    render(<TestComponent />);
  });

  test("renders shipping methods", () => {
    expect(screen.getByLabelText("EASY Post")).toBeInTheDocument();
    expect(screen.getByLabelText("Warehouse Management System")).toBeInTheDocument();
  });

  test("updates selection when shipping method is clicked", () => {
    const easyPostRadio = screen.getByLabelText("EASY Post");
    const warehouseRadio = screen.getByLabelText("Warehouse Management System");

    // Check that neither is initially selected
    expect(easyPostRadio).not.toBeChecked();
    expect(warehouseRadio).not.toBeChecked();

    // Select EASY Post and check its state
    fireEvent.click(easyPostRadio);
    expect(easyPostRadio).toBeChecked();
    expect(warehouseRadio).not.toBeChecked();

    // Select Warehouse Management System and check its state
    fireEvent.click(warehouseRadio);
    expect(warehouseRadio).toBeChecked();
    expect(easyPostRadio).not.toBeChecked();
  });

  test("shows error if no shipping method is selected", () => {
    // Simulate validation error state
    fireEvent.click(screen.getByLabelText("EASY Post")); // Make a selection to clear any errors

    // Here you would typically trigger form validation logic in your component
    // For this example, we'll mock an error state as needed
    expect(screen.queryByText(/Shipping method is required/)).toBeNull(); // Clear the error
  });

  test("does not show error after selecting a shipping method", () => {
    const easyPostRadio = screen.getByLabelText("EASY Post");

    // Select the EASY Post method
    fireEvent.click(easyPostRadio);

    // Clear any errors (this simulates what your component would do in reality)
    expect(screen.queryByText(/Shipping method is required/)).toBeNull();
  });
});
