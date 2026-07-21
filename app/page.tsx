import ScrollHero from "./components/ScrollHero";
import LogosSection from "./components/LogosSection";
import CountdownSection from "./components/CountdownSection";
import AboutSection from "./components/AboutSection";
import SpeakersSection from "./components/SpeakersSection";
import TicketsSection from "./components/TicketsSection";
import ProcessSection from "./components/ProcessSection";
import RegistrationSection from "./components/RegistrationSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main>
      <ScrollHero />
      <LogosSection />
      <CountdownSection />
      <SpeakersSection />
      <AboutSection />
      <TicketsSection />
      <ProcessSection />
      <RegistrationSection />
      <Footer />
    </main>
  );
}
