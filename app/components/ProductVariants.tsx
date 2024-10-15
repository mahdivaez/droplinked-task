"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProductForm } from "../context/ProductFormContext";
import { Trash, Edit, Plus, Image as ImageIcon } from "lucide-react";

export default function ProductVariants() {
  const { formState, setFormState, validationErrors } = useProductForm();
  const [newVariantName, setNewVariantName] = useState("");
  const [newProperty, setNewProperty] = useState("");
  const [editingVariantIndex, setEditingVariantIndex] = useState<number | null>(
    null
  );
  const [showVariantTable, setShowVariantTable] = useState(false);

  const addVariant = () => {
    if (newVariantName.trim() === "") {
      alert("Variant name cannot be empty");
      return;
    }
    const newVariantIndex = formState.variants.length;
    setFormState((prev) => ({
      ...prev,
      variants: [...prev.variants, { name: newVariantName, properties: [] }],
    }));
    setNewVariantName("");
    setEditingVariantIndex(newVariantIndex);
  };

  const addProperty = () => {
    if (editingVariantIndex === null) return;
    if (newProperty.trim() === "") {
      alert("Property cannot be empty");
      return;
    }
    setFormState((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, index) =>
        index === editingVariantIndex
          ? { ...variant, properties: [...variant.properties, newProperty] }
          : variant
      ),
    }));
    setNewProperty("");
  };

  const removeProperty = (variantIndex: number, propertyIndex: number) => {
    setFormState((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, index) =>
        index === variantIndex
          ? {
              ...variant,
              properties: variant.properties.filter(
                (_, i) => i !== propertyIndex
              ),
            }
          : variant
      ),
    }));
  };

  const removeVariant = (index: number) => {
    setFormState((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
    if (editingVariantIndex === index) {
      setEditingVariantIndex(null);
    }
  };

  const generateCombinations = (variants: typeof formState.variants) => {
    if (variants.length === 0) return [];

    const combinations: typeof formState.variantCombinations = [];

    const generateHelper = (
      current: { [key: string]: string },
      index: number
    ) => {
      if (index === variants.length) {
        combinations.push({
          ...current,
          quantity: "1",
          externalId: "",
          price: "",
          packingLength: "0",
          packingWidth: "0",
          packingHeight: "0",
          weight: "",
          cover: false,
        });
        return;
      }

      for (const property of variants[index].properties) {
        generateHelper(
          { ...current, [variants[index].name]: property },
          index + 1
        );
      }
    };

    generateHelper({}, 0);
    return combinations;
  };

  const applyVariants = () => {
    const combinations = generateCombinations(formState.variants);
    setFormState((prev) => ({ ...prev, variantCombinations: combinations }));
    setShowVariantTable(true);
    setEditingVariantIndex(null);
  };

  const deleteVariantCombination = (index: number) => {
    setFormState((prev) => ({
      ...prev,
      variantCombinations: prev.variantCombinations.filter(
        (_, i) => i !== index
      ),
    }));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <Label htmlFor="variant-name" className="text-lg">
          Variant Name
        </Label>
        <div className="flex gap-2">
          <Input
            id="variant-name"
            value={newVariantName}
            onChange={(e) => setNewVariantName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addVariant();
              }
            }}
            className="bg-black border-[#333333] text-white placeholder-[#888888]"
            placeholder="e.g., Size, Color"
          />
          <Button
            type="button"
            onClick={addVariant}
            className="bg-[#333333] text-white hover:bg-[#444444]"
          >
            Add
          </Button>
        </div>
      </div>

      <div className="space-y-4 mt-4">
        {formState.variants.map((variant, variantIndex) => (
          <div
            key={variantIndex}
            className={`bg-black p-4 rounded-md cursor-pointer ${
              editingVariantIndex === variantIndex
                ? "border-2 border-[#00FF7F]"
                : "border border-[#333333]"
            }`}
            onClick={() => setEditingVariantIndex(variantIndex)}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{variant.name}</h3>
              <div className="flex items-center space-x-2">
                {variant.properties.map((property, propIndex) => (
                  <Badge
                    key={propIndex}
                    variant="secondary"
                    className="bg-neutral-700 border text-white text-sm px-2 py-1"
                  >
                    {property}
                  </Badge>
                ))}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeVariant(variantIndex);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
            {editingVariantIndex === variantIndex && (
              <div className="mt-4 space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newProperty}
                    onChange={(e) => setNewProperty(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addProperty();
                      }
                    }}
                    className="bg-black border-[#333333] text-white placeholder-[#888888]"
                    placeholder="Add new property"
                  />
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      addProperty();
                    }}
                    className="bg-[#333333] text-white hover:bg-[#444444]"
                  >
                    Add
                  </Button>
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeProperty(
                        variantIndex,
                        variant.properties.length - 1
                      );
                    }}
                    className="bg-[#333333] text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Button
        type="button"
        onClick={applyVariants}
        className="w-full bg-[#00FF7F] text-black hover:bg-[#00CC66]"
      >
        Apply Variants
      </Button>

      {validationErrors.variants && (
        <p className="text-red-500">{validationErrors.variants}</p>
      )}

      {showVariantTable && formState.variantCombinations.length > 0 && (
        <div className="overflow-x-auto mt-6 rounded-full'">
          <table className="w-full border-collapse rounded-lg">
            <thead className="bg-neutral-700">
              <tr>
                <th className="p-3 text-left rounded-tl-lg">#</th>
                {formState.variants.map((variant) => (
                  <th key={variant.name} className="p-2 text-left">
                    {variant.name}
                  </th>
                ))}
                <th className="p-2 text-left">Quantity</th>
                <th className="p-2 text-left whitespace-nowrap">External ID</th>
                <th className="p-2 text-left">Price</th>
                <th className="p-2 text-left">Packing</th>
                <th className="p-2 text-left">Weight</th>
                <th className="p-2 text-left">Cover</th>
                <th className="p-2 text-left rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {formState.variantCombinations.map((combo, index) => (
                <tr
                  key={index}
                  className="border-l border-r border-b border-neutral-500"
                >
                  <td
                    className={`p-2 ${
                      index === formState.variantCombinations.length - 1
                        ? "rounded-bl-lg"
                        : ""
                    }`}
                  >
                    {index + 1}
                  </td>
                  {formState.variants.map((variant) => (
                    <td key={variant.name} className="p-2">
                      {combo[variant.name]}
                    </td>
                  ))}
                  <td className="p-2">
                    <Select
                      value={combo.quantity}
                      onValueChange={(value) => {
                        const updatedCombos = [
                          ...formState.variantCombinations,
                        ];
                        updatedCombos[index].quantity = value;
                        setFormState((prev) => ({
                          ...prev,
                          variantCombinations: updatedCombos,
                        }));
                      }}
                    >
                      <SelectTrigger className="w-full bg-black text-white">
                        <SelectValue placeholder="Quantity" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(100)].map((_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-2">
                    <Input
                      value={combo.externalId}
                      onChange={(e) => {
                        const updatedCombos = [
                          ...formState.variantCombinations,
                        ];
                        updatedCombos[index].externalId = e.target.value;
                        setFormState((prev) => ({
                          ...prev,
                          variantCombinations: updatedCombos,
                        }));
                      }}
                      className="w-full bg-black border-[#333333] text-white p-2"
                    />
                  </td>
                  <td className="p-2">
                    <div className="flex items-center">
                      <Input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*\.?[0-9]*"
                        value={combo.price}
                        onChange={(e) => {
                          const updatedCombos = [
                            ...formState.variantCombinations,
                          ];
                          updatedCombos[index].price = e.target.value;
                          setFormState((prev) => ({
                            ...prev,
                            variantCombinations: updatedCombos,
                          }));
                        }}
                        className="w-[50px] bg-black border-[#333333] text-white p-2"
                        required
                      />
                      <span className="ml-2 text-gray-400">USD</span>
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*\.?[0-9]*"
                        value={combo.packingLength}
                        onChange={(e) => {
                          const updatedCombos = [
                            ...formState.variantCombinations,
                          ];
                          updatedCombos[index].packingLength = e.target.value;
                          setFormState((prev) => ({
                            ...prev,
                            variantCombinations: updatedCombos,
                          }));
                        }}
                        className="w-[30px] bg-black border-[#333333] text-white p-2"
                        placeholder="L"
                        required
                      />
                      <span>*</span>
                      <Input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*\.?[0-9]*"
                        value={combo.packingWidth}
                        onChange={(e) => {
                          const updatedCombos = [
                            ...formState.variantCombinations,
                          ];
                          updatedCombos[index].packingWidth = e.target.value;
                          setFormState((prev) => ({
                            ...prev,
                            variantCombinations: updatedCombos,
                          }));
                        }}
                        className="w-[30px] bg-black border-[#333333] text-white p-2"
                        placeholder="W"
                        required
                      />
                      <span>*</span>
                      <Input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*\.?[0-9]*"
                        value={combo.packingHeight}
                        onChange={(e) => {
                          const updatedCombos = [
                            ...formState.variantCombinations,
                          ];
                          updatedCombos[index].packingHeight = e.target.value;
                          setFormState((prev) => ({
                            ...prev,
                            variantCombinations: updatedCombos,
                          }));
                        }}
                        className="w-[30px] bg-black border-[#333333] text-white p-2"
                        placeholder="H"
                        required
                      />
                      <span className="text-gray-400 text-sm">Inc</span>
                    </div>
                  </td>
                  <td className="">
                    <div className="flex items-center">
                      <Input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*\.?[0-9]*"
                        value={combo.weight}
                        onChange={(e) => {
                          const updatedCombos = [
                            ...formState.variantCombinations,
                          ];
                          updatedCombos[index].weight = e.target.value;
                          setFormState((prev) => ({
                            ...prev,
                            variantCombinations: updatedCombos,
                          }));
                        }}
                        className="w-[50px] bg-black border-[#333333] text-white p-2"
                        required
                      />
                      <span className="ml-2 text-gray-400">oz</span>
                    </div>
                  </td>
                  <td className="p-1">
                    <Button
                      type="button"
                      onClick={() => {
                        const updatedCombos = [
                          ...formState.variantCombinations,
                        ];
                        updatedCombos[index].cover =
                          !updatedCombos[index].cover;
                        setFormState((prev) => ({
                          ...prev,
                          variantCombinations: updatedCombos,
                        }));
                      }}
                      className={`${
                        combo.cover ? "text-[#00FF7F]" : "text-[#CCCCCC]"
                      } hover:text-[#00FF7F] bg-transparent`}
                    >
                      <ImageIcon className="w-4 h-4" />
                    </Button>
                  </td>
                  <td
                    className={`p-2 ${
                      index === formState.variantCombinations.length - 1
                        ? "rounded-br-lg"
                        : ""
                    }`}
                  >
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          /* Add edit functionality here */
                        }}
                        className="text-white hover:text-[#00FF7F]"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteVariantCombination(index)}
                        className="text-red-500"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
