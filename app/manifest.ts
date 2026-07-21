import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Project Ganit",
    short_name: "Ganit",
    description: "Class 10 NCERT Mathematics PWA MVP",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf7ef",
    theme_color: "#0e7c66",
    icons: []
  };
}
