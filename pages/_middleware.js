import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

//=> this function is called on every request
export async function middleware(req) { 
    //token is the token from the cookie
    //it will be null if the user is not logged in
    const token = await getToken({ req, secret: process.env.JWT_SECRET });
    const { pathname } = req.nextUrl;
    //allow the request to continue if the user is logged in
    if (pathname.startsWith("/api") || token) {
        return NextResponse.next();
    }

    //redirect the user to the sign in page 
    if (!token && pathname !== "/login") {
        return NextResponse.redirect("/login");
    }
}