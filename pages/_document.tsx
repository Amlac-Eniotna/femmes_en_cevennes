import { editorialNew, editorialOld } from "@/font/font";
import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="fr">
      <Head />
      <body
        className={` ${editorialNew.variable} ${editorialOld.variable} bg-emerald-50 font-editorial-new`}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
