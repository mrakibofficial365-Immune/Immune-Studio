import { Space_Grotesk, Instrument_Serif } from "next/font/google";
import "./globals.css";
const sans = Space_Grotesk({ subsets: ["latin"], variable: "--sans", weight: ["300", "400", "500", "700"] });
const serif = Instrument_Serif({ subsets: ["latin"], variable: "--serif", weight: "400", style: ["normal", "italic"] });
export const metadata = {
  title: "Immune Studio — Ads, Video, Motion & Brand",
  description: "Immune Studio is a creative studio for ad marketing, content creation, videography, motion design, graphic design and brand promotion.",
};
export default function Root({ children }) {
  return (<html lang="en" className={`${sans.variable} ${serif.variable}`}><body>{children}</body></html>);
}
