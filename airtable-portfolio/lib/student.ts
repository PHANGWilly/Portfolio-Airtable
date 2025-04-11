import { getTableRecords } from "@/utils/airtable";
import { Student } from "@/types/Student";

const tableName = process.env.AIRTABLE_TABLE_STUDENT!;

export const getStudents = async (): Promise<Student[]> => {
  const records = await getTableRecords(tableName);
  return records as Student[];
};

export const createStudent = async (fields: Partial<Student["fields"]>) => {
  const Airtable = await import("airtable");
  const base = new Airtable.default({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID!
  );
  const table = base(tableName);
  const record = await table.create([{ fields }]);
  return record[0];
};

export const updateStudent = async (id: string, fields: Partial<Student["fields"]>) => {
  const Airtable = await import("airtable");
  const base = new Airtable.default({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID!
  );
  const table = base(tableName);
  const record = await table.update([{ id, fields }]);
  return record[0];
};

export const deleteStudent = async (id: string) => {
  const Airtable = await import("airtable");
  const base = new Airtable.default({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID!
  );
  const table = base(tableName);
  await table.destroy([id]);
  return { success: true };
};
