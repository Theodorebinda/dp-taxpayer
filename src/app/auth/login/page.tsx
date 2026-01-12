import { Loader } from "@/components/ui";
import { Suspense } from "react";
import LoginComponent from "./components/login-component";

export default function LoginPage() {
  return (
    <Suspense fallback={<Loader />}>
      <LoginComponent />
    </Suspense>
  );
}
