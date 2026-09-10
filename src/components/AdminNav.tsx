import { Link } from "@tanstack/react-router";

export function AdminNav() {
  const cls =
    "min-h-11 rounded-lg px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-card hover:text-foreground [&.active]:bg-primary [&.active]:text-primary-foreground";

  return (
    <nav aria-label="Admin" className="mb-8 flex flex-wrap items-center gap-2">
      <span className="mr-4 text-sm font-bold uppercase tracking-wide text-muted-foreground">
        Admin
      </span>
      <Link to="/admin/orders" className={cls}>
        Orders
      </Link>
      <Link to="/admin/products" className={cls}>
        Products
      </Link>
      <Link to="/" className={cls}>
        Back to store
      </Link>
    </nav>
  );
}
