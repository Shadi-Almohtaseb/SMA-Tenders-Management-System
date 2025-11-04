import { Tender } from "@/types/tender";

const STORAGE_KEY = "sma_tenders";

export const loadTenders = (): Tender[] => {
  if (typeof window === "undefined") return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading tenders:", error);
    return [];
  }
};

export const saveTenders = (tenders: Tender[]): void => {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tenders));
  } catch (error) {
    console.error("Error saving tenders:", error);
  }
};

export const addTender = (tender: Omit<Tender, "id" | "createdAt">): Tender => {
  const tenders = loadTenders();
  const newTender: Tender = {
    ...tender,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  saveTenders([...tenders, newTender]);
  return newTender;
};

export const updateTender = (id: string, updates: Partial<Tender>): void => {
  const tenders = loadTenders();
  const updatedTenders = tenders.map((t) =>
    t.id === id ? { ...t, ...updates } : t
  );
  saveTenders(updatedTenders);
};

export const deleteTender = (id: string): void => {
  const tenders = loadTenders();
  saveTenders(tenders.filter((t) => t.id !== id));
};
