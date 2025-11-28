"use client";

import React, { useState } from "react";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import SearchIcon from "./ui/SearchIcon";

interface SearchFormProps {
  onSearch: (city: string) => void;
  disabled?: boolean;
}

export default function SearchForm({
  onSearch,
  disabled = false,
}: SearchFormProps) {
  const [city, setCity] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row max-w-[800px] mx-auto gap-4 p-5"
    >
      <Input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Digite o nome da cidade..."
        disabled={disabled}
        className="flex-1"
      />

      <Button type="submit" disabled={disabled} className="w-full sm:w-auto">
        <>
          <span className="mr-2">
            <SearchIcon />
          </span>
          Buscar
        </>
      </Button>
    </form>
  );
}
