export const fetchScholarshipDetail = async <T = unknown>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch scholarship');
  }
  return response.json() as Promise<T>;
};
