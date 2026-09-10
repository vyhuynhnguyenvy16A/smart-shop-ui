import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Package, User, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ORDERS, STATUS_LABEL, StatusBadgeClass } from "@/lib/orders";
import { formatPrice } from "@/lib/products";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Your account & orders — Northline" },
      {
        name: "description",
        content: "See your Northline order history with live status labels, plus your profile and saved address.",
      },
      { property: "og:title", content: "Your account — Northline" },
      { property: "og:description", content: "Order history, profile details and saved addresses." },
    ],
  }),
  component: AccountPage,
});

const TABS = ["Orders", "Profile", "Addresses"] as const;

function AccountPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Orders");

  return (
    <div className="container-shop section-y pb-24 md:pb-12">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Hello, Mai</h1>
      <p className="mt-2 text-sm text-muted-foreground">mai@example.com</p>

      <div className="mt-8 flex gap-2 border-b border-border" role="tablist">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cn(
              "min-h-11 px-4 text-sm font-semibold",
              tab === t
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Orders" && (
        <div className="mt-6 grid gap-4">
          {ORDERS.map((o) => (
            <article key={o.id} className="rounded-xl bg-card p-5">
              <div className="flex flex-wrap items-center gap-3">
                <Package className="h-5 w-5 text-muted-foreground" />
                <span className="text-base font-semibold text-foreground">{o.id}</span>
                <span className="text-sm text-muted-foreground">{o.date}</span>
                <span className={cn(StatusBadgeClass(o.status), "ml-auto")}>
                  {STATUS_LABEL[o.status]}
                </span>
              </div>
              <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
                {o.items.map((i) => (
                  <li key={i.title}>
                    {i.title} · {i.variant} × {i.qty} — {formatPrice(i.price * i.qty)}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-bold text-primary">{formatPrice(o.total)}</span>
                <Button variant="secondary" size="sm" asChild>
                  <Link to="/products" search={{}}>
                    Buy again
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      {tab === "Profile" && (
        <div className="mt-6 max-w-lg rounded-xl bg-card p-6">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Profile details</h2>
          </div>
          <div className="mt-4 grid gap-4">
            {[
              { label: "Full name", value: "Mai Tran" },
              { label: "Email", value: "mai@example.com" },
              { label: "Phone", value: "+84 900 000 000" },
            ].map((f) => (
              <div key={f.label}>
                <label className="mb-1 block text-sm font-semibold text-foreground">{f.label}</label>
                <input
                  defaultValue={f.value}
                  className="h-12 w-full rounded-lg border border-input bg-background px-4 text-base outline-none focus:border-primary"
                />
              </div>
            ))}
            <Button variant="primary" size="md">
              Save changes
            </Button>
          </div>
        </div>
      )}

      {tab === "Addresses" && (
        <div className="mt-6 max-w-lg rounded-xl bg-card p-6">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Default shipping address</h2>
          </div>
          <p className="mt-4 text-base text-muted-foreground">
            Mai Tran
            <br />
            128 Nguyen Hue, District 1
            <br />
            Ho Chi Minh City, 700000
          </p>
          <Button variant="secondary" size="md" className="mt-6">
            Edit address
          </Button>
        </div>
      )}
    </div>
  );
}
