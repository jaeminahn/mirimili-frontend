export interface TypeRecord {
  id: number;
  label: string;
}

export interface MosAndUnitRecord {
  id: number;
  type: string;
  category: string;
  label: string;
  code?: string;
}

export function extractCategories(data: MosAndUnitRecord[]): string[] {
  const uniqueLabels = new Set(data.map((item) => item.category));
  return Array.from(uniqueLabels);
}
