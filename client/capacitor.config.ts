import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.lacasa.smartrestaurant",
  appName: "LaCasa",
  webDir: "dist",
  server: {
    cleartext: true,
  },
};

export default config;
