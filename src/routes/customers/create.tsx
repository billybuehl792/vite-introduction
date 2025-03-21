import { createFileRoute, useNavigate } from "@tanstack/react-router";
import CustomerForm from "@/containers/forms/CustomerForm";
import { Stack } from "@mui/material";

export const Route = createFileRoute("/customers/create")({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (!context.auth.user) throw new Error("User not authenticated");
  },
  errorComponent: ({ error }) => <Stack>{error.message}</Stack>,
});

function RouteComponent() {
  /** Values */

  const navigate = useNavigate();

  return <CustomerForm onSuccess={() => navigate({ to: "/customers" })} />;
}
