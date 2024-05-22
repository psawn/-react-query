export async function fetchEvents({
  signal,
  searchTerm,
}: {
  signal?: AbortSignal;
  searchTerm?: string;
}) {
  console.log("searchTerm", searchTerm);

  let url = "http://localhost:3000/events";

  if (searchTerm) {
    url += `?search=${searchTerm}`;
  }

  const response = await fetch(url, { signal });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the events") as Error & {
      code: number;
      info: Record<string, string>;
    };
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { events } = await response.json();

  return events;
}

export async function createNewEvent(eventData: unknown) {
  const response = await fetch(`http://localhost:3000/events`, {
    method: "POST",
    body: JSON.stringify(eventData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = new Error("An error occurred while creating the event") as Error & {
      code: number;
      info: Record<string, string>;
    };
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { event } = await response.json();

  return event;
}
