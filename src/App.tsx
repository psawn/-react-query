import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import Events from "./components/Events/Events.js";
import EventDetails from "./components/Events/EventDetails.js";
import NewEvent from "./components/Events/NewEvent.js";
import EditEvent, {
  editEventLoader,
  editEventAction,
} from "./components/Events/EditEvent.js";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./ultis/http.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/events" />,
  },
  {
    path: "/events",
    element: <Events />,

    children: [
      {
        path: "/events/new",
        element: <NewEvent />,
      },
    ],
  },
  {
    path: "/events/:id",
    element: <EventDetails />,
    children: [
      {
        path: "/events/:id/edit",
        element: <EditEvent />,
        action: editEventAction,
        loader: editEventLoader,
      },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
