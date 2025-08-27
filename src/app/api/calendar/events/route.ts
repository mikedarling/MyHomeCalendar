import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { cookies } from "next/headers";

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

  const scheme = process.env.HTTP_SCHEME || "http";
  const host = process.env.HOST || "localhost";
  const port = process.env.PORT && process.env.PORT !== "80" && process.env.PORT !== "443" ? `:${process.env.PORT}` : "";
  const redirectUri = `${scheme}://${host}${port}${process.env.GOOGLE_REDIRECT_URI}`;
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri,
  );
  oauth2Client.setCredentials(tokens);

  const { searchParams } = new URL(req.url);
  const calendarIds = searchParams.get("calendarIds");
  const timeMin = searchParams.get("timeMin");
  const timeMax = searchParams.get("timeMax");

  if (!calendarIds || !timeMin || !timeMax) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 },
    );
  }

  const ids = calendarIds.split(",").filter(Boolean);
  let allEvents: any[] = [];
  try {
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    for (const id of ids) {
      const res = await calendar.events.list({
        calendarId: id,
        timeMin,
        timeMax,
        singleEvents: true,
        orderBy: "startTime",
        maxResults: 2500,
      });
      if (res.data.items) {
        allEvents = allEvents.concat(
          res.data.items.map((e) => ({ ...e, calendarId: id })),
        );
      }
    }
    return NextResponse.json({ events: allEvents });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch events", details: error.message || error },
      { status: 500 },
    );
  }
}
