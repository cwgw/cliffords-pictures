const Manifest = {
  data: () => ({
    eleventyExcludeFromCollections: true,
    permalink: "/public/site.webmanifest",
    layout: false,
  }),
  render: () =>
    JSON.stringify({
      name: "cliffords.pictures",
      short_name: "cliffs.pics",
      display: "minimal-ui",
      scope: "/",
      start_url: "/index.html",
      theme_color: "#fff",
      background_color: "#0047ba",
      icons: [
        { src: "/icon-192.png", type: "image/png", sizes: "192x192" },
        { src: "/icon-512.png", type: "image/png", sizes: "512x512" },
      ],
    }),
};

export default Manifest;
