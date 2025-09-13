import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import httpUtils from "../../../../utils/httpUtils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  if (!code) {
    return NextResponse.json(
      { error: "Missing code parameter" },
      { status: 400 },
    );
  }

  const redirectUri = httpUtils.gAuthRedirectUri(req.url);

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri,
  );

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();

    const baseUri = httpUtils.baseUri(req.url);
    const host = httpUtils.host(req.url);

    // Prepare Set-Cookie headers
    const cookieHeaders = [
      `google_tokens=${encodeURIComponent(JSON.stringify(tokens))}; Path=/; SameSite=Lax; Domain=${host}`,
      `google_user=${encodeURIComponent(JSON.stringify(userInfo.data))}; Path=/; SameSite=Lax; Domain=${host}`,
    ];

    // Redirect to home page after successful login, with cookies set
    const response = NextResponse.redirect(baseUri);
    cookieHeaders.forEach((header) =>
      response.headers.append("Set-Cookie", header),
    );
    return response;
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to exchange code for tokens",
        details: error.message || error,
      },
      { status: 500 },
    );
  }
}