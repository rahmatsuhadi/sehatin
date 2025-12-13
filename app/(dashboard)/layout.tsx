import ButtonNav from "@/components/button-nav";
import ModalContainer from "@/components/container-modal";
import HeaderNav from "@/components/header-nav";
import { AuthGuard } from "@/providers/AuthProvider";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen flex ">
        <div className="hidden lg:block">
          <ButtonNav />
        </div>

        <div className="flex-1 lg:ml-56 ">
          <HeaderNav />

          <main className="py-5 md:pt-10  max-w-xl mx-auto  lg:pb-10 mt-10">
            {children}
          </main>
        </div>

        <div className="lg:hidden">
          <ButtonNav />
        </div>
        <ModalContainer />
      </div>
    </AuthGuard>
  );
}
