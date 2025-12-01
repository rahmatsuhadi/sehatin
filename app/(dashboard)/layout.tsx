import ButtonNav from "@/components/button-nav";
import HeaderNav from "@/components/header-nav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-background">
      <div className="hidden lg:block">
        <ButtonNav />
      </div>

      <div className="flex-1 lg:ml-56 ">
        <HeaderNav />

        <main className="pt-20 px-5 max-w-3xl mx-auto pb-28 lg:pb-10 mt-10">
          {children}
        </main>
      </div>

      <div className="lg:hidden">
        <ButtonNav />
      </div>
    </div>
  );
}
