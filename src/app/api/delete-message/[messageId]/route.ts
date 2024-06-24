import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/config/db-connect";
import UserModel from "@/model/user";
import { User } from "next-auth";


export async function DELETE(request:Request,{params}:{params:{messageId:string}}){

  const messageId = params.messageId;

  await dbConnect();

  const session = await getServerSession(authOptions);
  
  const user: User = session?.user as User;

  if(!session || !session.user){

    return Response.json({
      sucess:false,
      message:"Not Authenitcated"
    },{ status:401 })
  }

  try {
   const updateResult = await UserModel.updateOne({
    _id:user._id
   },{
    $pull:{messages:{_id: messageId}}
   });

   if(updateResult.modifiedCount ===0){
    return Response.json({
      sucess:false,
      message:"Message not found"
    },{
      status:404
    })
   }

   return Response.json({
    sucess:true,
    message:"Message deleted"
  },{
    status:200
  })

    
  } catch (error) {
    console.log("Internal error", error)
    return Response.json({
      sucess:false,
      message:"Error deleting message"
    },{
      status:500
    })
    
  } 
}
