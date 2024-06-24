import "./globals.css";
import "@mantine/core/styles.css";

import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { getServerSession } from "next-auth";

import { Provider as SessionProvider } from "contexts/SessionProvider";

export const metadata = {
  title: "Receipts",
  description: "Receipts",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body>
        <SessionProvider session={session}>
          <MantineProvider defaultColorScheme="dark">
            {children}
          </MantineProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
