import type{ Request,Response } from "express"

export const createUser = (req:Request,res:Response)=>{
    try{
        const {username,email,password} = res.locals.validatedBody;

        return res.status(200).json({message:"success fully created user",success:true})
    
    }catch(err){
        console.error(err)
        res.status(500).json({message:"internal server error!"})
    }
}