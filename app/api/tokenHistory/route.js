import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

const moment = require('moment-timezone');

function convertToIST(serverTime) {
  // Parse the server time (with its timezone)
  const serverMoment = moment(serverTime);

  // Convert to IST (Indian Standard Time, UTC+5:30)
  const istMoment = serverMoment.tz('Asia/Kolkata');

  return istMoment.format('YYYY-MM-DD');
}

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const dateString = searchParams.get("date");
    
    console.log("for date:" + dateString);

    try {
        let serverIST = moment(convertToIST(moment(new Date())));
        let reqDate = moment(dateString);
        console.log("Server: ", serverIST);
        console.log("Request: ", reqDate);
        if (reqDate >= serverIST) {
            return NextResponse.json({ error: "Can't fetch tokens for future dates" }, { status: 500 });
        }
        const client = await clientPromise;
        const db = client.db("jackpot");

        try {
            const tokens = await db.collection("tokens").find({ "date": dateString }).toArray();
            let tokensMap = {}
            for (const token of tokens) {
                tokensMap[token['time']] = token['tokenId'];
            }
            console.log("tokens time map : ", tokensMap)
            return NextResponse.json(tokensMap);
        }
        catch (error) {
            console.error(error);
            return NextResponse.json({ error: "Failed to fetch tokens." }, { status: 500 });
        }

        return NextResponse.json(tokens);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch tokens." }, { status: 500 });
    }
}