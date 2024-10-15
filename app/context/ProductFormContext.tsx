"use client";

import React, { createContext, useState, useContext } from "react";

type ProductImage = {
  file: File;
  preview: string;
  isMain: boolean;
};

type Variant = {
  name: string;
  properties: string[];
};

type VariantCombination = {
  [key: string]: string | boolean;
  quantity: string;
  externalId: string;
  price: string;
  packingLength: string;
  packingWidth: string;
  packingHeight: string;
  weight: string;
  cover: boolean;
};

type FormState = {
  title: string;
  description: string;
  images: ProductImage[];
  collection: string;
  variants: Variant[];
  variantCombinations: VariantCombination[];
  shippingMethod: string;
};

type ProductFormContextType = {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  validationErrors: { [key: string]: string };
  setValidationErrors: React.Dispatch<
    React.SetStateAction<{ [key: string]: string }>
  >;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  successMessage: string | null;
  setSuccessMessage: React.Dispatch<React.SetStateAction<string | null>>;
  handleSubmit: () => void;
};

const ProductFormContext = createContext<ProductFormContextType | undefined>(
  undefined
);

export function ProductFormProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [formState, setFormState] = useState<FormState>({
    title: "",
    description: "",
    images: [],
    collection: "",
    variants: [],
    variantCombinations: [],
    shippingMethod: "",
  });

  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Implement API call logic here
      console.log("Form submitted:", formState);
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSuccessMessage("Product created successfully!");

      // Reset form state
      setFormState({
        title: "",
        description: "",
        images: [],
        collection: "",
        variants: [],
        variantCombinations: [],
        shippingMethod: "",
      });
    } catch (error) {
      console.error("Error submitting product:", error);
      setError("Failed to create product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formState.title) errors.title = "Product name is required";
    if (!formState.description) errors.description = "Description is required";
    if (formState.images.length === 0)
      errors.images = "At least one image is required";
    if (!formState.collection) errors.collection = "Collection is required";
    if (formState.variants.length === 0)
      errors.variants = "At least one variant is required";
    if (!formState.shippingMethod)
      errors.shippingMethod = "Shipping method is required";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <ProductFormContext.Provider
      value={{
        formState,
        setFormState,
        validationErrors,
        setValidationErrors,
        isLoading,
        setIsLoading,
        error,
        setError,
        successMessage,
        setSuccessMessage,
        handleSubmit,
      }}
    >
      {children}
    </ProductFormContext.Provider>
  );
}

export function useProductForm() {
  const context = useContext(ProductFormContext);
  if (context === undefined) {
    throw new Error("useProductForm must be used within a ProductFormProvider");
  }
  return context;
}
