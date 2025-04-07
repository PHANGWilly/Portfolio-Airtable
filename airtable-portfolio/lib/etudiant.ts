import { getTableRecords } from "@/utils/airtable";
import { Etudiant } from "@/types/Etudiant";

const tableName = process.env.NEXT_PUBLIC_AIRTABLE_TABLE_ETUDIANT!;

export const getEtudiants = async (): Promise<Etudiant[]> => {
  const records = await getTableRecords(tableName);
  return records as Etudiant[];
};

export const createEtudiant = async (fields: Partial<Etudiant["fields"]>) => {
  const Airtable = await import("airtable");
  const base = new Airtable.default({ apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY }).base(
    process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID!
  );
  const table = base(tableName);
  const record = await table.create([{ fields }]);
  return record[0];
};

export const updateEtudiant = async (id: string, fields: Partial<Etudiant["fields"]>) => {
  const Airtable = await import("airtable");
  const base = new Airtable.default({ apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY }).base(
    process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID!
  );
  const table = base(tableName);
  const record = await table.update([{ id, fields }]);
  return record[0];
};

export const deleteEtudiant = async (id: string) => {
  const Airtable = await import("airtable");
  const base = new Airtable.default({ apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY }).base(
    process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID!
  );
  const table = base(tableName);
  await table.destroy([id]);
  return { success: true };
};
