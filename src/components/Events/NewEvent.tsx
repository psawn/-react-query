import { Link, useNavigate } from "react-router-dom";
import Modal from "../UI/Modal";
import EventForm from "./EventForm";
import { useMutation } from "@tanstack/react-query";
import { createNewEvent, queryClient } from "../../ultis/http";
import ErrorBlock from "../UI/ErrorBlock";
import { TEvent } from "./EventItem";

export default function NewEvent() {
  const navigate = useNavigate();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createNewEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] }); // force invalidate queries with old data
      navigate("/events");
    },
  });

  function handleSubmit(formData: TEvent) {
    mutate({ event: formData });
  }

  return (
    <Modal
      onClose={() => {
        navigate("../");
      }}
    >
      <EventForm onSubmit={handleSubmit}>
        {isPending && "Submitting..."}
        {!isPending && (
          <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Create
            </button>
          </>
        )}
      </EventForm>
      {isError && (
        <ErrorBlock
          title="Failed to create new event"
          message={
            (error as Error & { code: number; info: Record<string, string> })
              .info?.message || "Invalid input"
          }
        />
      )}
    </Modal>
  );
}
