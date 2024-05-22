import { useQuery } from "@tanstack/react-query";
import LoadingIndicator from "../UI/LoadingIndicator";
import ErrorBlock from "../UI/ErrorBlock";
import EventItem, { TEvent } from "./EventItem";
import { fetchEvents } from "../../ultis/http";

export default function NewEventsSection() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
    staleTime: 5000, // wait for 5 seconds before send another request
    // gcTime: 30000, // the cached data will be kept 1.5 minutes then it would be discarded
  });

  let content;

  if (isPending) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    content = (
      <ErrorBlock
        title="An error occurred"
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
    <section className="content-section" id="new-events-section">
      <header>
        <h2>Recently added events</h2>
      </header>
      {content}
    </section>
  );
}
