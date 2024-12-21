import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const response = await fetch(`http://localhost:3000/api/timeIST`);
    const time = new Date(await response.json());
    console.log("time: " + time);
    const currentHr = time.getHours();
    const currentMin = time.getMinutes();

    try {
        const client = await clientPromise;
        const db = client.db("jackpot");

        try {
            const tokens = await db.collection("tokens").find({ date }).toArray();
            const expiredTokens = []
            for (const token of tokens) {
                let times = token['time'].split(":")
                let hrs = times[0];
                let mins = times[1];
                if (currentHr > hrs || (currentHr == hrs && currentMin > mins)) {
                    expiredTokens.push(token);
                }
            }
            console.log("Expired tokens by date : ", expiredTokens)
            return NextResponse.json(expiredTokens);
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