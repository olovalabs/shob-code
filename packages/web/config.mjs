const stage = process.env.SST_STAGE || "dev"

export default {
  url: stage === "production" ? "https://shob.ai" : `https://${stage}.shob.ai`,
  console: stage === "production" ? "https://shob.ai/auth" : `https://${stage}.shob.ai/auth`,
  email: "contact@anoma.ly",
  socialCard: "https://social-cards.sst.dev",
  github: "https://github.com/anomalyco/shob",
  discord: "https://shob.ai/discord",
  headerLinks: [
    { name: "app.header.home", url: "/" },
    { name: "app.header.docs", url: "/docs/" },
  ],
}
