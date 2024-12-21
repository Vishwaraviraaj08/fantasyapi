import { NextResponse } from "next/server";

export async function GET(req) {
    let d = new Date();
    let utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    let nd = new Date(utc + (3600000*+5.5));
    console.log("IST now is : " + nd);
    return NextResponse.json(nd);
}