import crypto from "crypto";

export interface Credentials {
  SAPISID: string;
  APISID: string;
  HSID: string;
  SID: string;
  SSID: string;
}

export const DEFAULT_CLIENT = {
  clientName: "WEB",
  clientVersion: "2.20210618.05.00-canary_control",
};

export function withAuthHeader(
  creds: Credentials | undefined,
  headers: any = {}
) {
  const defaultHeaders = {
    ...headers,
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
  };

  if (!creds) return defaultHeaders;

  return {
    ...defaultHeaders,
    Cookie: genCookieString(creds) + (headers.Cookie ?? ""),
    Authorization: genAuthToken(creds.SAPISID, "https://www.youtube.com"),
    "X-Origin": "https://www.youtube.com",
  };
}

function genCookieString(creds: Credentials) {
  return Object.entries(creds)
    .map(([key, value]) => `${key}=${value};`)
    .join(" ");
}

function genAuthToken(sid: string, origin: string) {
  return `SAPISIDHASH ${genSapisidHash(sid, origin)}`;
}

function genSapisidHash(sid: string, origin: string) {
  const now = Math.floor(new Date().getTime() / 1e3);
  const payload = [now, sid, origin];
  const digest = sha1Digest(payload.join(" "));
  return [now, digest].join("_");
}

function sha1Digest(payload: string) {
  const hash = crypto.createHash("sha1");
  hash.update(payload);
  return hash.copy().digest("hex");
}
