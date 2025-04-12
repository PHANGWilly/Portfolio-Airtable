import { getTableRecords } from "@/utils/airtable";
import { Student } from "@/types/Student";

const tableName = "student";

export const getStudents = async (): Promise<Student[]> => {
  const records = await getTableRecords(tableName);
  return records as Student[];
};

export const createStudent = async (fields: Partial<Student["fields"]>) => {
  const Airtable = await import("airtable");
  const base = new Airtable.default({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID!
  );
  const table = base("student"); 

  const safeFields: Partial<Student["fields"]> = {
    ...(fields.firstname && { firstname: fields.firstname }),
    ...(fields.lastname && { lastname: fields.lastname }),
    ...(fields.email && { email: fields.email }),
    ...(fields.class && { class: fields.class }),
    ...(Array.isArray(fields.projects) && { projects: fields.projects }),
  };

  const record = await table.create([{ fields: safeFields }]);
  return record[0];
};

export const updateStudent = async (id: string, fields: Partial<Student["fields"]>) => {
  const Airtable = await import("airtable");
  const base = new Airtable.default({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID!
  );
  const table = base("student");

  const safeFields: Partial<Student["fields"]> = {
    ...(fields.firstname && { firstname: fields.firstname }),
    ...(fields.lastname && { lastname: fields.lastname }),
    ...(fields.email && { email: fields.email }),
    ...(fields.class && { class: fields.class }),
    ...(Array.isArray(fields.projects) && { projects: fields.projects }),
  };

  const record = await table.update([{ id, fields: safeFields }]);
  return record[0];
};

export const deleteStudent = async (id: string) => {
  const Airtable = await import("airtable");
  const base = new Airtable.default({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID!
  );
  const table = base("student"); 
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
  const table = base("student"); 

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
