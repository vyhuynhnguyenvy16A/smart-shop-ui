# E-commerce Experience Builder

giúp tôi thiết kế giao diện cho 1 web ecommerce với rule như sau: # E-commerce Design System

## 1. Color System (Conversion-Focused)

- Primary CTA: #2563eb (blue-600) - "Add to Cart", "Buy Now"

- Secondary: #64748b (slate-500) - "Learn More", "View Details"

- Background: #ffffff

- Surface (cards): #f8fafc (slate-50)

- Text primary: #0f172a (slate-900)

- Text secondary: #475569 (slate-600)

- Success: #16a34a (green-600) - "In Stock", "Free Shipping"

- Warning: #d97706 (amber-600) - "Low Stock", "Sale Ends Soon"

- Danger: #dc2626 (red-600) - "Out of Stock", "Error"

- NEVER use more than 3 colors per screen

## 2. Typography (Readability First)

- Font: Inter, system-ui, -apple-system, sans-serif

- Product title: 1.5rem (24px), weight 600

- Price: 1.25rem (20px), weight 700, primary color

- Body: 1rem (16px), weight 400, line-height 1.6

- Small (badges, meta): 0.875rem (14px)

- NEVER use font size < 14px

## 3. Spacing (8-Point Grid)

- Product card padding: 16px

- Section padding: 48px vertical, 24px horizontal

- Gap between products: 24px

- Button padding: 12px 32px

- Form input height: 48px (touch-friendly)

## 4. Critical Components

### Product Card

- Image ratio: 1:1 or 4:3, aspect-ratio maintained

- Border radius: 12px

- Shadow: 0 1px 3px rgba(0,0,0,0.1)

- Hover: scale 1.02, shadow-lg

- Must show: image, title (max 2 lines), price, rating, "Add to Cart" button

- Out-of-stock: grayscale image + badge

### Product Page

- Image gallery: minimum 4 images, swipeable on mobile

- Title: above fold, never truncated

- Price: prominent, near "Add to Cart"

- "Add to Cart" button: full-width on mobile, sticky on scroll

- Reviews: stars + count visible without scrolling

- Trust badges: "Free Shipping", "30-Day Returns", secure payment icons

### Navigation

- Max 7 main categories (cognitive load limit) [32]

- Search bar: top-right, minimum 300px width, autocomplete

- Cart icon: always visible, show item count

- Mobile: hamburger menu + bottom navigation for key actions

### Checkout Flow

- Max 3 steps: Cart → Shipping/Payment → Confirmation [38]

- Guest checkout: ALWAYS available (no forced account creation) [38]

- Progress indicator: step 1/3, 2/3, 3/3

- Form fields: only essential (remove optional fields)

- Payment: Apple Pay, Google Pay, PayPal visible above fold [38]

- Trust signals: SSL badge, money-back guarantee near "Pay Now"

### Buttons (CTA Hierarchy)

- Primary (Buy Now, Add to Cart): filled bg, white text, 48px height

- Secondary (View Details, Learn More): outline, primary color

- Tertiary (Continue Shopping, Back): text-only, underline on hover

- ALL buttons: 44px minimum touch target [41]

## 5. Conversion Rules (NON-NEGOTIABLE)

### Homepage

- Hero: single clear headline + 1 primary CTA [41]

- Social proof: ratings, customer count, press logos visible immediately [41]

- Featured products: 4-8 items max, above fold

- Categories: visual cards, not text links only

### Product Listing Page (PLP)

- Filter: price, category, rating, availability (persistent, collapsible on mobile) [41]

- Sort: "Best Selling", "Price: Low-High", "Newest"

- Product cards: consistent size, image ratio, CTA placement

- Quick view: hover/click to see details without leaving PLP [41]

- Wishlist: heart icon on every product card [41]

### Product Detail Page (PDP)

- Images: minimum 800x800px, zoom on hover, swipe on mobile [39]

- Title + price: above fold, never below images

- "Add to Cart": sticky on mobile, visible without scrolling

- Reviews: stars + count near title, detailed reviews below

- Related products: 4-8 items at bottom ("You May Also Like")

### Cart & Checkout

- Cart: show product image, title, quantity selector, remove button

- Free shipping threshold: progress bar ("Spend $20 more for free shipping")

- Abandoned cart: save cart across devices, send recovery email [38]

- Checkout: address autocomplete (Google Places API) [38]

## 6. Mobile-First Rules (50%+ traffic from mobile)

- Touch targets: 44x44px minimum for ALL interactive elements [41]

- Bottom navigation: place key CTAs in thumb zone (bottom 1/3 screen) [41]

- Images: lazy load, compress to <200KB per image [39]

- Page load: <3 seconds on 4G (1-second delay = -7% conversion) [41]

- Forms: input type="tel" for phone, autocomplete attributes

## 7. Trust & Social Proof

- Reviews: stars + count on product cards AND product pages [43]

- Badges: "Verified Buyer", "Best Seller", "Eco-Friendly"

- Security: SSL badge, payment method icons near checkout

- Returns: "30-Day Free Returns" visible on PDP

- Shipping: "Free Shipping Over $50" in header or product page

## 8. Anti-Patterns (DO NOT DO)

- ❌ Auto-playing videos or carousels on homepage [44]

- ❌ Pop-ups within first 10 seconds (use static bars instead) [43]

- ❌ Forced account creation before checkout [38]

- ❌ Hidden costs (shipping, taxes) until final checkout step [38]

- ❌ More than 7 main navigation items [32]

- ❌ Low-quality product images (<800x800px) [39]

- ❌ No guest checkout option [38]

- ❌ Checkout flow >3 steps [38]

## 9. Performance Rules

- Images: WebP format, lazy load, srcset for responsive [39]

- Fonts: max 2 typefaces, subset fonts, preload critical fonts [39]

- Scripts: defer non-critical JS, minify CSS/JS [45]

- Lighthouse score: aim for 90+ on mobile

## 10. Pre-Launch Checklist

- [ ] All product images 800x800px minimum, WebP format

- [ ] Guest checkout works without account creation

- [ ] Checkout flow is 3 steps maximum

- [ ] Mobile view tested on 375px width

- [ ] All buttons 44px minimum touch target

- [ ] Trust badges visible on product pages

- [ ] Reviews/ratings displayed on PLP and PDP

- [ ] Search has autocomplete

- [ ] Cart persists across sessions

- [ ] Page load <3 seconds on mobile

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0333c5cf-ec88-4d1d-aaa4-be9a98ccab5e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
