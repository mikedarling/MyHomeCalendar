const scheme = process.env.HTTP_SCHEME || "http";
const host = process.env.HOST || "localhost";
const port = process.env.PORT && process.env.PORT !== "80" && process.env.PORT !== "443" ? `:${process.env.PORT}` : "";

const gAuthRedirectUri = `${scheme}://${host}${port}${process.env.GOOGLE_REDIRECT_URI}`;

export default {
  scheme,
  host,
  port,
  gAuthRedirectUri,
};