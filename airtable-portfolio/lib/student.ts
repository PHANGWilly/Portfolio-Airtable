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

export const syncStudentProjects = async (
  projectId: string,
  selectedStudentIds: string[],
  previousStudentIds: string[]
) => {
  const Airtable = await import("airtable");
  const base = new Airtable.default({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID!
  );
  const table = base(process.env.AIRTABLE_TABLE_STUDENT!);

  const toRemove = previousStudentIds.filter((id) => !selectedStudentIds.includes(id));
  const toAdd = selectedStudentIds.filter((id) => !previousStudentIds.includes(id));

  const updates = [];

  for (const id of toRemove) {
    const studentRecord: any = await table.find(id);
    const updated = (studentRecord.fields.projects || []).filter((pid: string) => pid !== projectId);
    updates.push({ id, fields: { projects: updated } });
  }

  for (const id of toAdd) {
    const studentRecord: any = await table.find(id);
    const updated = Array.from(new Set([...(studentRecord.fields.projects || []), projectId]));
    updates.push({ id, fields: { projects: updated } });
  }

  if (updates.length > 0) {
    await table.update(updates);
  }
};

