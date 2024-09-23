import express from "express"
//@ts-ignore
import db from "@repo/db/client"
const app = express();

app.post("/hdfcWebhook",async (req,res)=> {

    const paymentInfo = {
        token : req.body.token,
        userId : req.body.userId,
        amount : req.body.amount
    };

    try {
        await db.$transaction([
             db.balance.update({
                where : {
                    userId : req.body.userId
                },
                data : {
                    amount : {
                        increment : paymentInfo.amount
                    }
                }   
            }),
        
             db.OnRampTransaction.update({
                where : {
                    token : paymentInfo.token,
                },
                data :{
                    status  : "Completed"
                }
            })
        
           
        ])
        res.status(200).json({
            message : "captured"
        })
    }
    catch(err) {
        return res.
        status(411).json({
            message : "error while processing the webhook"
        })
    }

    

})

app.listen(3000,() => console.log('listening at port 3000'));

//onRamp is when we send to the platform
//offRamp is when we send to the bank
//we never store decimals in a db, it is mostly in format of whole number and then we just put in decimals.