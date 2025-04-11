import { getTableRecords } from "@/utils/airtable";
import { Subject } from "@/types/Subject";

const tableName = process.env.AIRTABLE_TABLE_SUBJECT!;

export const getSubjects = async (): Promise<Subject[]> => {
  const records = await getTableRecords(tableName);
  return records as Subject[];
};

export const createSubject = async (fields: Partial<Subject["fields"]>) => {
  const Airtable = await import("airtable");
  const base = new Airtable.default({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID!
  );
  const table = base(tableName);
  const record = await table.create([{ fields }]);
  return record[0];
};

export const updateSubject = async (id: string, fields: Partial<Subject["fields"]>) => {
  const Airtable = await import("airtable");
  const base = new Airtable.default({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID!
  );
  const table = base(tableName);
  const record = await table.update([{ id, fields }]);
  return record[0];
};

export const deleteSubject = async (id: string) => {
  const Airtable = await import("airtable");
  const base = new Airtable.default({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID!
  );
  const table = base(tableName);
  await table.destroy([id]);
  return { success: true };
};
