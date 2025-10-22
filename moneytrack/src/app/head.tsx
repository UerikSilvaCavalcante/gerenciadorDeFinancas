import React from "react";
import head from "./assets/head.png";

export default function Head({ title }: { title: string }) {
  return (
    <React.Fragment>
      <title>{title}</title>
      <meta name="description" content="Página de demandas do sistema TEIA" />
      <link rel="shortcut icon" href={head.src} type="image/png" />
    </React.Fragment>
  );
}
