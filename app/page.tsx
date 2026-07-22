import HeroIntro from "./components/HeroIntro";
import VenueVideoSection from "./components/VenueVideoSection";
import CountdownSection from "./components/CountdownSection";
import AboutSection from "./components/AboutSection";
import SpeakersSection from "./components/SpeakersSection";
import TicketsSection from "./components/TicketsSection";
import RegistrationSection from "./components/RegistrationSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main>
      <HeroIntro />
      <CountdownSection />
      <SpeakersSection />
      <VenueVideoSection />
      <AboutSection />
      <TicketsSection />
      <RegistrationSection />
      <Footer />
    </main>
  );
}
