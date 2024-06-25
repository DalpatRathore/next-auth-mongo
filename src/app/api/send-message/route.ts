import dbConnect from "@/config/db-connect";
import UserModel from "@/model/user";
import { Message } from "@/model/user";

export async function POST(request:Request){
    await dbConnect();

    const {username, content}=await request.json();
    // console.log(username,content)

    try {
       const user = await UserModel.findOne({username});
       if(!user){
           return Response.json({
            sucess:false,
            message:"User not found"
          },{
            status:404
          });
       }

       if(!user.isAcceptingMessage){
        return Response.json({
            sucess:false,
            message:"User not accepting messages"
          },{
            status:403
          })
       }

       const newMessage = {content,createdAt: new Date()};

       user.messages.push(newMessage as Message);
       await user.save();

       return Response.json({
        success:true,
        message:"Message sent successfully"
      },{
        status:200
      })

    } catch (error) {
        console.log("Error in sending messages");
        return Response.json({
            sucess:false,
            message:"Internal server error"
          },{
            status:500
          })
        
    }

}