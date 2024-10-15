"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProductForm } from "../context/ProductFormContext";
import Image from "next/image";
import { Star, Upload, Trash } from "lucide-react";

const collections = [
  { id: "642ecc12db889ecd88d81dda", name: "Summer Collection" },
  { id: "2", name: "Winter Collection" },
  { id: "3", name: "Spring Collection" },
  { id: "4", name: "Autumn Collection" },
];

export default function GeneralInformation() {
  const { formState, setFormState, validationErrors } = useProductForm();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        isMain: false,
      }));
      setFormState((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
    }
  };

  const toggleMainImage = (index: number) => {
    setFormState((prev) => ({
      ...prev,
      images: prev.images.map((img, i) => ({ ...img, isMain: i === index })),
    }));
  };

  const removeImage = (index: number) => {
    setFormState((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Label htmlFor="title" className="flex items-center text-lg">
          Product Name
          <span className="text-[#00FF7F] ml-1">*</span>
        </Label>
        <Input
          id="title"
          value={formState.title}
          onChange={(e) =>
            setFormState((prev) => ({ ...prev, title: e.target.value }))
          }
          className="bg-black border-[#333333] text-white placeholder-[#888888]"
          placeholder="Enter product name"
          required
          aria-required="true"
          aria-describedby={validationErrors.title ? "title-error" : undefined}
          data-testid="product-name-input"
        />
        {validationErrors.title && (
          <p id="title-error" className="text-red-500">
            {validationErrors.title}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <Label htmlFor="description" className="flex items-center text-lg">
          Description
          <span className="text-[#00FF7F] ml-1">*</span>
        </Label>
        <Textarea
          id="description"
          value={formState.description}
          onChange={(e) =>
            setFormState((prev) => ({ ...prev, description: e.target.value }))
          }
          className="bg-black border-[#333333] text-white placeholder-[#888888]"
          placeholder="Enter product description"
          required
          aria-required="true"
          aria-describedby={
            validationErrors.description ? "description-error" : undefined
          }
          data-testid="product-description-textarea"
        />
        {validationErrors.description && (
          <p id="description-error" className="text-red-500">
            {validationErrors.description}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <Label className="flex items-center text-lg mb-2">
          Product Images
          <span className="text-[#00FF7F] ml-1">*</span>
        </Label>
        <div className="bg-[#222222] p-4 rounded-md">
          <div className="flex flex-wrap gap-4 mb-4">
            {formState.images.map((img, index) => (
              <div key={index} className="relative">
                {img.preview && (
                  <Image
                    src={img.preview}
                    alt={`Product ${index + 1}`}
                    width={250}
                    height={250}
                    className="object-cover rounded-lg"
                  />
                )}
                <button
                  type="button"
                  onClick={() => toggleMainImage(index)}
                  className={`absolute top-2 left-2 p-1 rounded-full ${
                    img.isMain
                      ? "bg-[#00FF7F] text-black"
                      : "bg-black text-[#CCCCCC]"
                  }`}
                  aria-label={`Set image ${index + 1} as main`}
                >
                  <Star className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-black text-red-500 hover:bg-red-500 hover:text-white"
                  aria-label={`Remove image ${index + 1}`}
                >
                  <Trash className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
          <label className="flex items-center justify-center border-2 border-dashed border-[#444444] rounded-lg p-12 cursor-pointer hover:border-[#00FF7F]">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              aria-label="Upload product images"
            />
            <Upload className="w-12 h-12 mr-4 text-white" />
            <span className="text-white text-lg">Upload Images</span>
          </label>
          <p className="text-[#888888] text-sm mt-2">
            Max file size: 5MB | Supported formats: JPG, PNG
          </p>
        </div>
        {validationErrors.images && (
          <p className="text-red-500">{validationErrors.images}</p>
        )}
      </div>

      <div className="space-y-4">
        <Label htmlFor="collection" className="flex items-center text-lg">
          Collection
          <span className="text-[#00FF7F] ml-1">*</span>
        </Label>
        <Select
          value={formState.collection}
          onValueChange={(value) =>
            setFormState((prev) => ({ ...prev, collection: value }))
          }
          required
          aria-required="true"
        >
          <SelectTrigger className="bg-[#333333] border-[#444444] text-white">
            <SelectValue placeholder="Select a collection" />
          </SelectTrigger>
          <SelectContent
            className="bg-[#333333] border-[#444444]"
            position="popper"
            align="start"
          >
            {collections.map((col) => (
              <SelectItem
                key={col.id}
                value={col.id}
                className="text-white hover:bg-[#444444]"
              >
                {col.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {validationErrors.collection && (
          <p className="text-red-500">{validationErrors.collection}</p>
        )}
      </div>
    </div>
  );
}
