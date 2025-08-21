import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import Background from "./layout/background";
import Footer from "./components/PageElements/Footer";
import Nav from "./components/Navs/Nav";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="Pat" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.png" />
        <Meta />
        <Links />
      </head>
      <body>
        <Background />
        <Nav />
        {children}
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-6 container mx-auto">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-light text-gray-900 mb-4">{message}</h1>
        <p className="text-gray-600 mb-6">{details}</p>
        {stack && (
          <pre className="w-full p-4 overflow-x-auto bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200">
            <code className="text-gray-700 text-sm">{stack}</code>
          </pre>
        )}
      </div>
    </main>
  );
}
