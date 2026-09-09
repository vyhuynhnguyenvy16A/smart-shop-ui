import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { Rating } from "@/components/Rating";
import { StockBadge } from "@/components/StockBadge";
import { CATEGORIES, formatPrice, products, type Product } from "@/lib/products";
import { addToCart } from "@/lib/cart";

type Search = { q?: string | undefined; category?: string | undefined };

export const Route = createFileRoute("/products/")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    q: typeof search["q"] === "string" ? (search["q"] as string) : undefined,
    category: typeof search["category"] === "string" ? (search["category"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "All Products — Northline" },
      {
        name: "description",
        content:
          "Browse every Northline product. Filter by price, category, rating and availability, with ratings on every card.",
      },
      { property: "og:title", content: "All Products — Northline" },
      {
        property: "og:description",
        content: "Filter and sort the full Northline range: audio, footwear, bags and watches.",
      },
    ],
  }),
  component: ProductListing,
});

const SORTS = ["Best Selling", "Price: Low-High", "Newest"] as const;

function ProductListing() {
  const { q, category } = Route.useSearch();
  const [maxPrice, setMaxPrice] = useState(300);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [cats, setCats] = useState<string[]>(category ? [category] : []);
  const [sort, setSort] = useState<(typeof SORTS)[number]>("Best Selling");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [quick, setQuick] = useState<Product | null>(null);

  const list = useMemo(() => {
    let out = products.filter(
      (p) =>
        p.price <= maxPrice &&
        p.rating >= minRating &&
        (!inStockOnly || p.stock !== "out") &&
        (cats.length === 0 || cats.includes(p.category)) &&
        (!q || p.title.toLowerCase().includes(q.toLowerCase())),
    );
    if (sort === "Price: Low-High") out = [...out].sort((a, b) => a.price - b.price);
    if (sort === "Newest") out = [...out].reverse();
    if (sort === "Best Selling") out = [...out].sort((a, b) => b.reviews - a.reviews);
    return out;
  }, [maxPrice, minRating, inStockOnly, cats, q, sort]);

  const toggleCat = (c: string) =>
    setCats((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const filters = (
    <div className="space-y-8">
      <fieldset>
        <legend className="mb-3 text-base font-semibold text-foreground">Category</legend>
        <div className="space-y-2">
          {CATEGORIES.map((c) => (
            <label key={c} className="flex min-h-11 items-center gap-3 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={cats.includes(c)}
                onChange={() => toggleCat(c)}
                className="h-5 w-5 accent-[var(--primary)]"
              />
              {c}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-base font-semibold text-foreground">
          Max price: {formatPrice(maxPrice)}
        </legend>
        <input
          type="range"
          min={50}
          max={300}
          step={10}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="h-11 w-full accent-[var(--primary)]"
          aria-label="Maximum price"
        />
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-base font-semibold text-foreground">Rating</legend>
        <div className="space-y-2">
          {[0, 4, 4.5].map((r) => (
            <label key={r} className="flex min-h-11 items-center gap-3 text-sm text-muted-foreground">
              <input
                type="radio"
                name="rating"
                checked={minRating === r}
                onChange={() => setMinRating(r)}
                className="h-5 w-5 accent-[var(--primary)]"
              />
              {r === 0 ? "All ratings" : `${r}★ & up`}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex min-h-11 items-center gap-3 text-sm text-muted-foreground">
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => setInStockOnly(e.target.checked)}
          className="h-5 w-5 accent-[var(--primary)]"
        />
        In stock only
      </label>
    </div>
  );

  return (
    <div className="container-shop section-y">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        {q ? `Results for “${q}”` : cats.length === 1 ? cats[0] : "All products"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{list.length} products</p>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        <aside className="hidden w-64 shrink-0 lg:block">{filters}</aside>

        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between gap-4">
            <Button
              variant="secondary"
              size="sm"
              className="lg:hidden"
              onClick={() => setFiltersOpen(true)}
            >
              <SlidersHorizontal /> Filters
            </Button>
            <label className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
              Sort
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as (typeof SORTS)[number])}
                className="h-12 rounded-lg border border-input bg-card px-3 text-sm text-foreground"
              >
                {SORTS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((p) => (
              <ProductCard key={p.id} product={p} onQuickView={setQuick} />
            ))}
          </div>
          {list.length === 0 && (
            <p className="rounded-xl bg-card p-8 text-center text-base text-muted-foreground">
              No products match these filters.
            </p>
          )}
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="flex-1 bg-foreground/40" onClick={() => setFiltersOpen(false)} />
          <div className="w-80 max-w-[85%] overflow-y-auto bg-background p-6">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-base font-semibold">Filters</span>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                aria-label="Close filters"
                className="flex h-11 w-11 items-center justify-center"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {filters}
            <Button variant="primary" size="md" className="mt-8 w-full" onClick={() => setFiltersOpen(false)}>
              Show {list.length} products
            </Button>
          </div>
        </div>
      )}

      {quick && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4"
          role="dialog"
          aria-label="Quick view"
          onClick={() => setQuick(null)}
        >
          <div
            className="grid w-full max-w-2xl gap-6 rounded-xl bg-background p-6 sm:grid-cols-2"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={quick.image}
              alt={quick.title}
              width={1024}
              height={1024}
              className="aspect-square w-full rounded-lg object-cover"
            />
            <div>
              <h2 className="text-2xl font-semibold leading-snug text-foreground">{quick.title}</h2>
              <Rating value={quick.rating} count={quick.reviews} className="mt-3" />
              <p className="mt-3 text-xl font-bold text-primary">{formatPrice(quick.price)}</p>
              <StockBadge stock={quick.stock} className="mt-3" />
              <p className="mt-4 text-base text-muted-foreground">{quick.description}</p>
              <Button
                variant="primary"
                size="md"
                className="mt-6 w-full"
                disabled={quick.stock === "out"}
                onClick={() => {
                  addToCart(quick.id);
                  setQuick(null);
                }}
              >
                Add to Cart
              </Button>
              <Button variant="tertiary" size="sm" className="mt-2 w-full" onClick={() => setQuick(null)}>
                Continue shopping
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
