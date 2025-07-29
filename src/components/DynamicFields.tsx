"use client";

import React from "react";

type FieldTemplate = {
  key: string;
  label: string;
  type: "text" | "number" | "select" | "multiselect" | "boolean";
  options?: string[] | number[];
  required: boolean;
};

type CategoryTemplate = {
  fields: FieldTemplate[];
};

type DynamicFieldsProps = {
  template: CategoryTemplate | null;
  values: Record<string, any>;
  onChange: (values: Record<string, any>) => void;
  disabled?: boolean;
};

export default function DynamicFields({ template, values, onChange, disabled = false }: DynamicFieldsProps) {
  if (!template || !template.fields) {
    return null;
  }

  const handleFieldChange = (key: string, value: any) => {
    onChange({
      ...values,
      [key]: value,
    });
  };

  const renderField = (field: FieldTemplate) => {
    const value = values[field.key] || "";

    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            id={field.key}
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            placeholder={field.label}
          />
        );

      case "number":
        return (
          <input
            type="number"
            id={field.key}
            value={value}
            onChange={(e) => handleFieldChange(field.key, parseFloat(e.target.value) || "")}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            placeholder={field.label}
          />
        );

      case "select":
        return (
          <select
            id={field.key}
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          >
            <option value="">Seçiniz...</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "multiselect":
        return (
          <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={Array.isArray(value) ? value.includes(option) : false}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    if (e.target.checked) {
                      handleFieldChange(field.key, [...currentValues, option]);
                    } else {
                      handleFieldChange(field.key, currentValues.filter(v => v !== option));
                    }
                  }}
                  disabled={disabled}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case "boolean":
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={field.key}
              checked={value === true}
              onChange={(e) => handleFieldChange(field.key, e.target.checked)}
              disabled={disabled}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor={field.key} className="text-sm text-gray-700">
              Evet
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">
        Kategori Özellikleri
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {template.fields.map((field) => (
          <div key={field.key} className="space-y-1">
            <label htmlFor={field.key} className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {renderField(field)}
          </div>
        ))}
      </div>
    </div>
  );
}
