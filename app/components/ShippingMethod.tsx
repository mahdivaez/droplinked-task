"use client"

import React from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useProductForm } from "../context/ProductFormContext"

export default function ShippingMethod() {
  const { formState, setFormState, validationErrors } = useProductForm()

  return (
    <div>
      <RadioGroup
        value={formState.shippingMethod}
        onValueChange={(value) => setFormState((prev) => ({ ...prev, shippingMethod: value }))}
        className="space-y-4"
      >
        {["easy_post", "warehouse"].map((method) => (
          <Card
            key={method}
            className={`bg-[#222222] border-[#444444] cursor-pointer ${
              formState.shippingMethod === method ? "border-white" : ""
            }`}
          >
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <RadioGroupItem
                  value={method}
                  id={method}
                  className="border-[#CCCCCC] text-[#00FF7F]"
                />
                <div>
                  <Label htmlFor={method} className="text-xl font-semibold text-white">
                    {method === "easy_post" ? "EASY Post" : "Warehouse Management System"}
                  </Label>
                  <p className="text-sm text-gray-400 mt-2">
                    {method === "easy_post"
                      ? "Responsible for shipping customer orders."
                      : "Handles product fulfillment and shipping directly from the warehouse."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </RadioGroup>
      {validationErrors.shippingMethod && (
        <p className="text-red-500 mt-2">{validationErrors.shippingMethod}</p>
      )}
    </div>
  )
}
