import { LauncherListPage } from "@/components/LauncherListPage";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export default function Page() {
  return (
    <>
      <Navigation />
      <LauncherListPage />
      <Footer />
    </>
  );
}