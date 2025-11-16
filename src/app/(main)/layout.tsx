import Header from "./components/header";
import FooterComponent from "./components/footer";
export default function MainPublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-(--dp-bg) text-neutral-900 flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <FooterComponent />
    </div>
  );
}
