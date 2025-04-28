"use client";
import { Input } from "@/components/ui/input";

type Props = {
  onSearch: (value: string) => void;
};

export default function SearchBar({ onSearch }: Props) {
  return (
    <div className="mb-4">
      <Input placeholder="Rechercher par nom de projet ou matière..." onChange={(e) => onSearch(e.target.value)} />
    </div>
  );
}
