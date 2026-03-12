import { LauncherListPage } from "@/components/launcher-list-page";
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