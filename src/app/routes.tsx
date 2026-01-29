import { createBrowserRouter } from "react-router";
import { AdminView } from "@/app/components/AdminView";
import { ProductView } from "@/app/components/ProductView";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AdminView,
  },
  {
    path: "/producto/:codigo",
    Component: ProductView,
  },
]);
