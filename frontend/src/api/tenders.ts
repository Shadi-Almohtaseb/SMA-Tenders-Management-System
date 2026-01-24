export interface Tender {
  id: number;
  title: string;
}

export interface TendersResponse {
  data: Tender[];
  total: number;
  page: number;
  pageSize: number;
}

export const fetchTenders = async (
  page: number = 1,
  pageSize: number = 5,
  //   token: string
): Promise<TendersResponse> => {
  try {
    const response = await fetch(`http://localhost:5000/tenders?page=${page}&pageSize=${pageSize}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `SMA-AUTH=4431962d5f367beda2a408c9a7ada7f2e62188f8fdd1c6d08c905bcb23fee952`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error fetching tenders: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
