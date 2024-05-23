import {
  Link,
  Params,
  redirect,
  useNavigate,
  useParams,
  useSubmit,
  useNavigation,
} from "react-router-dom";
import Modal from "../UI/Modal.js";
import EventForm from "./EventForm.jsx";
import { TEvent } from "./EventItem.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchEvent, queryClient, updateEvent } from "../../ultis/http.js";
import ErrorBlock from "../UI/ErrorBlock.js";

export default function EditEvent() {
  const navigate = useNavigate();

  const submit = useSubmit();
  const { state } = useNavigation();

  const params = useParams();
  const { id } = params;

  const query = useQuery({
    queryKey: ["events", id],
    queryFn: ({ signal }) => fetchEvent({ id: id!, signal }),
    staleTime: 10000,
  });
  const { isError, error } = query;

  // const { mutate } = useMutation({
  //   mutationFn: updateEvent,
  //   onMutate: async (data) => {
  //     const newEvent = data.event;

  //     await queryClient.cancelQueries({ queryKey: ["events", id] }); // make sure any query with key would be cancel

  //     const previousEvent = queryClient.getQueryData(["events", id]);
  //     queryClient.setQueryData(["events", id], newEvent);

  //     return { previousEvent };
  //   },
  //   onError: (_error, _data, content) => {
  //     queryClient.setQueryData(["events", id], content?.previousEvent);
  //   },
  //   onSettled: () => {
  //     queryClient.invalidateQueries({ queryKey: ["events", id] }); // make sure when mutation finish -> always fetch lastes data from BE behind the scenes
  //   },
  // });

  const data: TEvent = query.data;

  let content;

  if (isError) {
    content = (
      <>
        <div className="center">
          <ErrorBlock
            title="Failed to load event"
            message={
              (error as Error & { code: number; info: Record<string, string> })
                .info?.message || "Failed to load event"
            }
          />
        </div>
        <div className="form-actions">
          <Link to="../" className="button-text">
            Ok
          </Link>
        </div>
      </>
    );
  }

  if (data) {
    content = (
      // <EventForm inputData={data} onSubmit={handleSubmit}>
      //   <Link to="../" className="button-text">
      //     Cancel
      //   </Link>
      //   <button type="submit" className="button">
      //     Update
      //   </button>
      // </EventForm>
      <EventForm inputData={data} onSubmit={handleSubmit}>
        {state === "submitting" ? (
          <p>Sending...</p>
        ) : (
          <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Update
            </button>
          </>
        )}
      </EventForm>
    );
  }

  function handleSubmit(formData: TEvent) {
    // mutate({ id: id!, event: formData });
    // navigate("../");
    submit(formData, { method: "PUT" });
  }

  function handleClose() {
    navigate("../");
  }

  return <Modal onClose={handleClose}>{content}</Modal>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function editEventLoader({ params }: { params: Params }) {
  return queryClient.fetchQuery({
    queryKey: ["events", params.id],
    queryFn: ({ signal }) => fetchEvent({ id: params.id!, signal }),
  });
}

// eslint-disable-next-line react-refresh/only-export-components
export async function editEventAction({
  request,
  params,
}: {
  request: Request;
  params: Params;
}) {
  const formData = await request.formData();
  const updatedEventData = Object.fromEntries(formData) as TEvent;
  await updateEvent({ id: params.id!, event: updatedEventData });
  await queryClient.invalidateQueries({
    queryKey: ["events"],
  });
  return redirect("../");
}
