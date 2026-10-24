/**
 * App.tsx is no longer used as the root component.
 *
 * The application entry point is now:
 *   src/main.tsx  →  BrowserRouter > AuthProvider > QueryClientProvider > AppRouter
 *
 * All dashboard logic has been moved to:
 *   src/pages/BidVerificationPage.tsx
 *
 * All routing is defined in:
 *   src/router/index.tsx
 */
export {};
