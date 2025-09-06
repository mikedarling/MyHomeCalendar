
import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import httpUtils from "@/utils/httpUtils";

export async function GET(req: NextRequest) {

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    httpUtils.gAuthRedirectUri(req.url),
  );

  const scopes = [
    "https://www.googleapis.com/auth/calendar.readonly",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ];

  // Generate the auth URL
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent",
  });

  return NextResponse.json({ url });
}
