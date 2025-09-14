export type UrlParts = {
  scheme: string;
  host: string;
  port: number | null;
};

const parts = (url: string) : UrlParts => {
  const parsedUrl = new URL(url);

  const p: UrlParts = {
    scheme: parsedUrl.protocol.replace(":", ""),
    host: parsedUrl.hostname,
    port: null,
  };

  if (parsedUrl.port && parsedUrl.port !== "80" && parsedUrl.port !== "443" ) {
    p.port = parseInt(parsedUrl.port);
  }

  return p;
};

const scheme = (url: string) : string => {
  return parts(url).scheme
}

const host = (url: string) : string => {
  return parts(url).host
};

const port = (url: string) : number | null => {
  return parts(url).port
};

const baseUri = (url: string) : string => {
  return `${scheme(url)}://${host(url)}${port(url) ? `:${port(url)}` : ""}`;
};

const gAuthRedirectUri = (url: string) : string => {
  return `${baseUri(url)}${process.env.GOOGLE_REDIRECT_URI}`;
};

export default {
  scheme,
  host,
  port,
  baseUri,
  gAuthRedirectUri,
};