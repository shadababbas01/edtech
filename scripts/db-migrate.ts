import { ensureDemoData } from "@/lib/server/services";

ensureDemoData();
console.log("Embedded database initialized and migrated.");
