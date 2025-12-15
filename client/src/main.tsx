import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/error-boundary";
import "antd/dist/reset.css";
import "./index.css";

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <ErrorBoundary>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#000000",
          borderRadius: 4,
          colorBgContainer: "#ffffff",
          colorText: "#000000",
          colorBorder: "#d9d9d9",
        },
        components: {
          Button: {
            primaryColor: "#ffffff",
          },
          Card: {
            colorBorderSecondary: "#e5e5e5",
          },
        },
      }}
    >
      <QueryClientProvider client={client}>
        <BrowserRouter>
          <App />
          <Toaster />
        </BrowserRouter>
      </QueryClientProvider>
    </ConfigProvider>
  </ErrorBoundary>
);
