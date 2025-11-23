import Header from "./components/header";
import MobileHeader from "./components/MobileHeader";
import FooterComponent from "./components/footer";
export default function MainPublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-(--dp-bg) text-neutral-900 flex flex-col">
      <MobileHeader />
      <Header />
      <main className="flex-1">{children}</main>
      <FooterComponent />
    </div>
  );
}
