import { Html, Head, Main, NextScript } from "next/document";
import { ThemeModeScript } from "flowbite-react";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>Prosterio</title>
        <ThemeModeScript />
        <meta
          name="description"
          content="Streamline Tech Talent for Project Managers"
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
