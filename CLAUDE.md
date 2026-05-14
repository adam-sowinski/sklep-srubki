# Prompt for Claude Code: E-commerce Hardware Store (Screws & Fasteners)

**Role:** You are an expert Full-Stack Developer specializing in Next.js, React, TypeScript, and modern UI design.

**Task:** Scaffold a robust, high-performance e-commerce storefront for a specialized hardware store selling screws, nuts, bolts, and tools. The design should be highly technical, utilitarian, and functional, prioritizing easy navigation and complex product filtering.

## 🛠️ Technology Stack
*   **Framework:** Next.js (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **UI Components:** shadcn/ui (Lucide React for icons)
*   **State Management:** Zustand (for the shopping cart)
*   **Database ORM:** Prisma (set up with SQLite for initial local development)
*   **Authentication:** Clerk (for secure user login, registration, and session management)

## 🎯 Core Features to Implement

### 1. User Authentication (Clerk)
*   Implement secure sign-in and sign-up flows using Clerk.
*   Protect user-specific routes (like order history or profile).
*   Add a User Button in the Navbar to handle session states easily.

### 2. Product Catalog & Advanced Filtering
Customers need to find highly specific items. Implement a sidebar layout on the shop page with filters for:
*   Category (Screws, Nuts, Washers, Anchors)
*   Material (Stainless Steel A2/A4, Galvanized, Brass)
*   Thread Size (M3, M4, M5, M6, M8, M10, M12)
*   Length (in mm)

### 3. Product Listing Page (PLP)
*   Grid layout displaying products.
*   Each card should show: Product image (use a placeholder), Title, Material, Price per pack, and an "Add to Cart" button.
*   Compact, data-dense design.

### 4. Shopping Cart (Zustand)
*   A slide-out cart (Sheet component from shadcn/ui).
*   Users can increase/decrease quantities.
*   Display subtotal and a "Proceed to Checkout" button that navigates to `/checkout`.

### 5. Checkout Interface
*   Create a dedicated `/checkout` page.
*   **Left Column:** A clean, multi-step form for Shipping Details (Name, Address, City, Zip Code) and a mock Payment Method selection.
*   **Right Column:** Order Summary displaying the items from the Zustand cart, subtotal, shipping cost, and the total price.
*   Include a "Place Order" button that shows a success state/toast upon clicking.

### 6. Mock Data Generation
*   Create a `lib/mock-data.ts` file containing at least 15 realistic hardware items (include specific part numbers).

## 🎨 Design Guidelines
*   **Theme:** Highly technical, industrial, and utilitarian (blueprint vibe).
*   **Color Palette:** Crisp white backgrounds with subtle light-gray technical grid lines. Vibrant Orange (e.g., `orange-500`) for primary actions and active states. Dark Slate/Zinc for text.
*   **Typography:** Use a clean sans-serif for headings (e.g., Inter), but **strictly use a Monospace font** (like Fira Code or Roboto Mono) for part numbers, SKUs, thread sizes, and dimensions to emphasize the technical precision.
*   **UI Details:** Sharp edges, thin borders, tabular data presentation, and high contrast.

## 🚀 Execution Steps for Claude
1. Initialize the Next.js project with Tailwind and TypeScript.
2. Install necessary dependencies (Zustand, Lucide React, Clerk SDK, basic shadcn/ui components).
3. Set up Clerk provider in the root layout.
4. Implement the mock data and layout structure (Navbar, Footer).
5. Build the main listing page with the filtering sidebar.
6. Build the slide-out cart functionality.
7. Build the `/checkout` page interface.

Please start by setting up the foundational Next.js project and let me know when you are ready to proceed to the UI implementation.