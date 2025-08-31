const scheme = process.env.HTTP_SCHEME || "http";
const host = process.env.HOST || "localhost";
const port = process.env.FE_PORT && process.env.FE_PORT !== "80" && process.env.FE_PORT !== "443" ? `:${process.env.FE_PORT}` : "";

const gAuthRedirectUri = `${scheme}://${host}${port}${process.env.GOOGLE_REDIRECT_URI}`;

export default {
  scheme,
  host,
  port,
  gAuthRedirectUri,
};