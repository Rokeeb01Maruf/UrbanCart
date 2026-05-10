import { Router } from "express"
import { verifyadmin } from "../../../utils/verify.js";
import { pool } from "../../../config/db.js";

const router = Router()

router.post("/requests", async (req, res) => {
    const verify = await verifyadmin(req)
    if (verify.code != 200) return res.status(verify.code).json({ error: verify.error })
    const unregistered = await pool.query(`select * from delivery_agent_request where verification_status = 'pending'`)
    if(unregistered.rows.length < 1) return res.status(200).json({message: "No pending delivery agent requests"})
    return res.status(200).json([{message: `${unregistered.rows.length} pending delivery agent requests`},
        unregistered.rows
    ])
})


router.patch("/action/:id", async (req, res)=>{
    const action = req.query.action as string
    const verify = await verifyadmin(req)
    if(verify.code != 200) return res.status(verify.code).json({error: verify.error})
    const dId = req.params.id as string
    if(!dId) return res.status(400).json({message: "Bad request"})
    const agentValidity = await pool.query(`select * from delivery_agent_request where id = $1`, [dId])
    if(agentValidity.rows.length < 1){ 
        return res.status(404).json({message: "Delivery agent request not found"})
    }else if(agentValidity.rows[0].verification_status === "verified"){
        const checkRegistry = await pool.query(`
            select * from delivery_agents where userid = $1
            `, [agentValidity.rows[0].userid])
        if(checkRegistry.rows.length < 1){
            const registerAgent = await pool.query(`
                insert into delivery_agents (userid, vehicle_type, vehicle_model, vehicle_brand, 
                vehicle_color, plate_number, availability_status, status)
                values ($1, $2, $3, $4, $5, $6, $7, $8) returning *
                `, [agentValidity.rows[0].userid, agentValidity.rows[0].vehicle_type, agentValidity.rows[0].vehicle_model,
            agentValidity.rows[0].vehicle_brand, agentValidity.rows[0].vehicle_color, agentValidity.rows[0].plate_number, 'online', 'active'])
            if(registerAgent.rows.length < 1) return res.status(500).json({message: "Server error, failed to register delivery agent"})
                const validateAgent = await pool.query(`
                update auth set role = 'delivery' where id = $1 returning *
                `, [agentValidity.rows[0].userid])
            if(validateAgent.rows.length < 1) return res.status(500).json({message: "Server error, failed to validate delivery agent"})
                return res.status(200).json([{message: `${registerAgent.rows[0].userid} has been been registered`},
                registerAgent.rows[0]])
        }else{
            return res.status(400).json({message: "Delivery agent is already verified and registered"})
        }
    }else if(agentValidity.rows[0].verification_status === "pending"){
        if(action === "approve"){
            const approve = await pool.query(`
                update delivery_agent_request set verification_status = 'verified' where id = $1 returning *
                `, [dId])
            if(approve.rows.length < 1) return res.status(500).json({message: "Server error, failed to approve delivery agent"})
            const validateAgent = await pool.query(`
                update auth set role = 'delivery' where id = $1 returning *
                `, [approve.rows[0].userid])
            if(validateAgent.rows.length < 1) return res.status(500).json({message: "Server error, failed to validate delivery agent"})
            const registerAgent = await pool.query(`
                insert into delivery_agents (userid, vehicle_type, vehicle_model, vehicle_brand, 
                vehicle_color, plate_number, availability_status, status)
                values ($1, $2, $3, $4, $5, $6, $7, $8) returning *
                `, [approve.rows[0].userid, approve.rows[0].vehicle_type, approve.rows[0].vehicle_model,
            approve.rows[0].vehicle_brand, approve.rows[0].vehicle_color, approve.rows[0].plate_number, 'online','active'])
            if(registerAgent.rows.length < 1) return res.status(500).json({message: "Server error, failed to register delivery agent"})
                return res.status(200).json([{message: `${registerAgent.rows[0].userid} has been approved and registered`},
                registerAgent.rows[0]])
        }else if(action === "reject"){
            const reject = await pool.query(`
                update delivery_agent_request set verification_status = 'rejected' where id = $1 returning *
                `, [dId])
            if(reject.rows.length < 1) return res.status(500).json({message: "Server error, failed to reject delivery agent"})
            return res.status(200).json([{message: `${reject.rows[0].userid} has been rejected`},
            reject.rows[0]])
        }else{
            return res.status(400).json({message: "Bad request"})
        }
    }
})
export default router