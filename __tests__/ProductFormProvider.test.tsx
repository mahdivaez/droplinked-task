import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductFormProvider, useProductForm } from '../app/context/ProductFormContext'; 

const TestComponent = () => {
  const {
    formState,
    setFormState,
    validationErrors,
    handleSubmit,
    error,
    successMessage,
  } = useProductForm();

  return (
    <div>
      <input
        placeholder="Title"
        value={formState.title}
        onChange={(e) => setFormState({ ...formState, title: e.target.value })}
      />
      <textarea
        placeholder="Description"
        value={formState.description}
        onChange={(e) => setFormState({ ...formState, description: e.target.value })}
      />
      <input
        placeholder="Collection"
        value={formState.collection}
        onChange={(e) => setFormState({ ...formState, collection: e.target.value })}
      />
      <button onClick={handleSubmit}>Submit</button>

      {error && <p role="alert">{error}</p>}
      {successMessage && <p>{successMessage}</p>}
      {Object.keys(validationErrors).map((key) => (
        <p key={key} style={{ color: 'red' }}>{validationErrors[key]}</p>
      ))}
    </div>
  );
};

describe('ProductFormProvider', () => {
  beforeEach(() => {
    render(
      <ProductFormProvider>
        <TestComponent />
      </ProductFormProvider>
    );
  });

  test('initial state should be empty', () => {
    expect(screen.getByPlaceholderText('Title')).toHaveValue('');
    expect(screen.getByPlaceholderText('Description')).toHaveValue('');
    expect(screen.getByPlaceholderText('Collection')).toHaveValue('');
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.queryByText(/Product created successfully!/)).toBeNull();
  });

  test('shows validation errors on empty submit', async () => {
    fireEvent.click(screen.getByText('Submit'));

    // Replace with actual validation messages if different
    expect(await screen.findByText(/Product name is required/)).toBeInTheDocument();
    expect(await screen.findByText(/Description is required/)).toBeInTheDocument();
    expect(await screen.findByText(/Collection is required/)).toBeInTheDocument();
  });

  test('submits the form and resets state', async () => {
    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'Test Product' } });
    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'This is a test description.' } });
    fireEvent.change(screen.getByPlaceholderText('Collection'), { target: { value: 'Test Collection' } });

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.getByText(/Product created successfully!/)).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Title')).toHaveValue('');
      expect(screen.getByPlaceholderText('Description')).toHaveValue('');
      expect(screen.getByPlaceholderText('Collection')).toHaveValue('');
    });
  });

  test('displays error message on failure', async () => {
    // Mock an error scenario
    jest.mock('../app/context/ProductFormContext', () => ({
      ProductFormProvider: ({ children } :any) => <div>{children}</div>,
      useProductForm: () => ({
        formState: { title: '', description: '', collection: '' },
        setFormState: jest.fn(),
        validationErrors: {},
        handleSubmit: jest.fn(),
        error: 'Failed to create product. Please try again.',
        successMessage: null,
      }),
    }));

    render(
      <ProductFormProvider>
        <TestComponent />
      </ProductFormProvider>
    );

    fireEvent.click(screen.getByText('Submit'));
    
    expect(await screen.findByRole('alert')).toHaveTextContent('Failed to create product. Please try again.');
  });
});
