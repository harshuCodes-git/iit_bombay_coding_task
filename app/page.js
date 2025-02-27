import UploadAudio from "@/components/AudioUploader";
import HeroSection from "@/components/HeroSection";
import HomeTable from "@/components/HomeTable";
import Navbar from "@/components/Navbar";
import ReportsTable from "@/components/ReportsTable";
import Image from "next/image";

export default function Home() {
  return (
    <div className=" flex flex-col  ">
      <Navbar />
      <HeroSection/>
      <HomeTable />
    </div>
  );
}
