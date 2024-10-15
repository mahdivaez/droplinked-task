import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCreationForm from '../app/page'; 
// Mocking the ProductFormContext to provide necessary context for the component
jest.mock('../app/context/ProductFormContext', () => ({
  ProductFormProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useProductForm: () => ({
    isLoading: false,
    error: null,
    handleSubmit: jest.fn(),
  }),
}));

describe('ProductCreationForm', () => {
  test('renders the form', () => {
    render(<ProductCreationForm />);

    // Check if the form headers are present
    expect(screen.getByText(/General Information/i)).toBeInTheDocument();
    expect(screen.getByText(/Product Variants/i)).toBeInTheDocument();
    expect(screen.getByText(/Shipping Method/i)).toBeInTheDocument();
    expect(screen.getByText(/Publish Product/i)).toBeInTheDocument();
  });

  test('submits the form', () => {
    render(<ProductCreationForm />);

    // Simulate clicking the "Publish Product" button
    fireEvent.click(screen.getByText(/Publish Product/i));

    // Check if the handleSubmit function was called
    // You can add an assertion if you mock handleSubmit in the context
  });

  test('shows error message', () => {
    // Re-mock the context with an error
    jest.resetModules(); // Resetting the mocks
    jest.mock('../app/context/ProductFormContext', () => ({
      ProductFormProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
      useProductForm: () => ({
        isLoading: false,
        error: 'An error occurred',
        handleSubmit: jest.fn(),
      }),
    }));

    render(<ProductCreationForm />);

    // Check for the error message
    expect(screen.getByText(/An error occurred/i)).toBeInTheDocument();
  });
});
