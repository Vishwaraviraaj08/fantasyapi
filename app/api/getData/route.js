import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    try {
        const client = await clientPromise;
        const db = client.db("jackpot");

        try {
            const tokens = await db.collection("tokens").find({ date }).toArray();
            console.log("tokens by date : ", tokens)
            return NextResponse.json(tokens);
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

export async function POST(req) {
    try {
        console.log("data received" + req);
        let data = await req.json();
        const tokens = data['rows'];
        const deleted = data['deleted_rows'];

        const client = await clientPromise;
        const db = client.db("jackpot");
        const insertionIds = [];
        const BSON = require('bson');

        for (const del of deleted) {
            console.log("token id to delete: " + del["_id"]);
            await db.collection("tokens").deleteOne( { _id: new BSON.ObjectId((del["_id"])) } );
        }
        
        for (let token of tokens) {
            console.log("tokens to add" + token["_id"]);
            if (token["_id"]) {
                db.collection("tokens").updateOne(
                    {"_id": new BSON.ObjectId((token["_id"]))},
                    {$set: { "time" : token["time"], "tokenId": token["tokenId"], date: token["date"] }}
                );
            } else {
                insertionIds.push(await db.collection("tokens").insertOne(token));
            }
            console.log(token);
        }

        return NextResponse.json(insertionIds);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Some error has occurred." }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const { id, time, tokenId } = await req.json();

        const client = await clientPromise; // Get MongoDB client
        const db = client.db("jackpot");

        const result = await db.collection("tokens").updateOne(
            { _id: new ObjectId(id) },
            { $set: { "tokens.$[element].time": time, "tokens.$[element].tokenId": tokenId } },
            { arrayFilters: [{ "element.tokenId": tokenId }] }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "Token not found." }, { status: 404 });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to update token." }, { status: 500 });
    }
}
