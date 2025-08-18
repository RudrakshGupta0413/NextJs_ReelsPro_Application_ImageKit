import Hero from "./landing/Hero";
import Features from "./landing/Features";
import Testimonials from "./landing/Testimonials";
import Footer from "./landing/Footer";
import DashboardPreview from "./landing/DashboardPreview";

export default async function Home() {
  // const session = await getServerSession(authOptions);
  // if(session) {
  //   redirect("/feed");
  // }

  return (
    <main className="">
      <Hero />
      <Features />
      <DashboardPreview />
      <Testimonials />
      <Footer />
    </main>
  );
}
