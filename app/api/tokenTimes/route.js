import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
    const tempDate = new Date()
    const date = tempDate.getFullYear() + "-" + (tempDate.getMonth() + 1) + "-" + tempDate.getDate();
    console.log("Current date:" + date);

    try {
        const client = await clientPromise;
        const db = client.db("jackpot");

        try {
            const tokens = await db.collection("tokens").find({ date }).toArray();
            const times = []
            for (const token of tokens) {
                times.push(token['time'])
            }
            console.log("tokens times : ", times);
            return NextResponse.json(times);
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