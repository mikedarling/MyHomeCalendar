import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { cookies } from "next/headers";
import httpUtils from "../../../../utils/httpUtils";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("google_tokens");
  if (!tokenCookie) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let tokens;
  try {
    tokens = JSON.parse(tokenCookie.value);
  } catch {
    return NextResponse.json(
      { error: "Invalid token format" },
      { status: 400 },
    );
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    httpUtils.gAuthRedirectUri(req.url),
  );
  oauth2Client.setCredentials(tokens);

  try {
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const result = await calendar.calendarList.list();
    // Get ignored calendar ids from env
    const ignored = (process.env.IGNORED_CALENDARS || "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
    // Filter out ignored calendars
    const filtered = (result.data.items || []).filter(
      (cal) => !ignored.includes((cal.summary || "") as string)
    );
    return NextResponse.json({ calendars: filtered });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch calendars", details: error.message || error },
      { status: 500 },
    );
  }
}
