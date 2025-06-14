import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";
import { any, date } from "zod";

export async function POST(request:Request) {
    await dbConnect()

    const {username , content} = await request.json()

    try {
        const user = await UserModel.findOne({username})

        if(!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status:404
                }
            )
        }

        if(!user.isAcceptingMesssage){
            return Response.json(
                {
                    success: false,
                    message: "User is not accepting the messages"
                },
                {
                    status:403
                }
            )
        }

        const newMessage = {content, createdAt: new Date()}
        user.messages.push( newMessage as unknown as Message)
        await user.save()
        return Response.json(
            {
                success: true,
                message: "Message sent successfully"
            },
            {
                status:200
            }
        )


    } catch (error) {
        console.error('Error adding messages:', error);
        return Response.json(
        { message: 'Internal server error', success: false },
        { status: 500 })
    }

}