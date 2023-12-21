import { connect } from '@/dbConfig/dbConfig';
import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/userModel';

connect()


export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const {token} = reqBody
        console.log(token);

        const user = await User.findOne({verifyToken: token,
        verifyTokenExpired: {$gt: Date.now()}});
        
        if (!user) {
            return NextResponse.json({error: "User not found"}, {status: 400});
        }

        console.log(user);

        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpired = undefined;
        await user.save();

        return NextResponse.json({
            message: 'User verified successfully', 
            success: true}, 
            {
            status: 200
        })
        

    } catch (error: any) {
            return NextResponse.json({error: error.message}, {status: 500});
    }
}