import { QueryClient } from "@tanstack/react-query";
import { TEvent } from "../components/Events/EventItem";

export const queryClient = new QueryClient();

export async function fetchEvents({
  signal,
  searchTerm,
  max,
}: {
  signal?: AbortSignal;
  searchTerm?: string;
  max?: number;
}) {
  let url = "http://localhost:3000/events";

  const params = [];

  if (searchTerm) {
    params.push(`search=${encodeURIComponent(searchTerm)}`);
  }

  if (max) {
    params.push(`max=${encodeURIComponent(max)}`);
  }

  if (params.length > 0) {
    url += `?${params.join("&")}`;
  }

  const response = await fetch(url, { signal });

  if (!response.ok) {
    const error = new Error(
      "An error occurred while fetching the events"
    ) as Error & {
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

export async function fetchEvent({
  id,
  signal,
}: {
  id: string;
  signal: AbortSignal;
}) {
  const response = await fetch(`http://localhost:3000/events/${id}`, {
    signal,
  });

  if (!response.ok) {
    const error = new Error(
      "An error occurred while fetching the event"
    ) as Error & {
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

export async function createNewEvent(eventData: unknown) {
  const response = await fetch(`http://localhost:3000/events`, {
    method: "POST",
    body: JSON.stringify(eventData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = new Error(
      "An error occurred while creating the event"
    ) as Error & {
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

export async function fetchSelectableImages({
  signal,
}: {
  signal: AbortSignal;
}) {
  const response = await fetch(`http://localhost:3000/events/images`, {
    signal,
  });

  if (!response.ok) {
    const error = new Error(
      "An error occurred while fetching the images"
    ) as Error & {
      code: number;
      info: Record<string, string>;
    };
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { images } = await response.json();

  return images;
}

export async function deleteEvent({ id }: { id: string }) {
  const response = await fetch(`http://localhost:3000/events/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = new Error(
      "An error occurred while deleting the event"
    ) as Error & {
      code: number;
      info: Record<string, string>;
    };
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return response.json();
}

export async function updateEvent({
  id,
  event,
}: {
  id: string;
  event: TEvent;
}) {
  const response = await fetch(`http://localhost:3000/events/${id}`, {
    method: "PUT",
    body: JSON.stringify({ event }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = new Error(
      "An error occurred while updating the event"
    ) as Error & {
      code: number;
      info: Record<string, string>;
    };
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return response.json();
}
