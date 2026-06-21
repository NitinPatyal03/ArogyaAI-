import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import QuickServices from "./components/QuickServices";
import PredictionSection from "./components/PredictionSection";
import RecentActivity from "./components/RecentActivity";
import Footer from "./components/Footer";
import StatsCards from "./components/StatsCards";
import FloatingScanner from "./components/FloatingScanner";
import FloatingAI from "./components/FloatingAI";
import { Heart, Calendar, Activity } from "lucide-react";

function App() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <HeroSection />

      <StatsCards />

      <RecentActivity />
      <QuickServices />

      <Footer />

      <FloatingScanner />
      <FloatingAI />
    </div>
  );
}

export default App;
