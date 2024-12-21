import {NextResponse} from "next/server";

export async function POST(req) {
    const { username, password } = await req.json();

    if (username === 'aaa' && password === 'zzz') {
        return NextResponse.json({ success: true, message: 'Login successful' }, { status: 200 })
    }

    return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })
}