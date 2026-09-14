import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  beforeLoad: () => {
    throw redirect({ to: "/login", search: { redirect: undefined } });
  },
  component: () => null,
});
