import { useQuery } from "@tanstack/react-query";
import { FormEvent, useRef, useState } from "react";
import { fetchEvents } from "../../ultis/http";
import LoadingIndicator from "../UI/LoadingIndicator";
import ErrorBlock from "../UI/ErrorBlock";
import EventItem, { TEvent } from "./EventItem";

export default function FindEventSection() {
  const searchElement = useRef<HTMLInputElement>(null);

  const [searchTerm, setSearchTerm] = useState<string | undefined>("");

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events", { search: searchTerm }],
    queryFn: () => fetchEvents(searchTerm),
  });

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSearchTerm(searchElement.current?.value);
  }

  let content = <p>Please enter a search term and to find events.</p>;

  if (isPending) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    content = (
      <ErrorBlock
        title="Error"
        message={
          (error as Error & { code: number; info: Record<string, string> }).info
            ?.message || "Failed to load events"
        }
      />
    );
  }

  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event: TEvent) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="Search events"
            ref={searchElement}
          />
          <button>Search</button>
        </form>
      </header>
      {content}
    </section>
  );
}
