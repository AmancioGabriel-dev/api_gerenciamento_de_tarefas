import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { compare } from "bcrypt";
import { Request , Response , NextFunction } from "express";
import { z } from "zod"
import { authConfig } from "@/configs/auth";
import { sign } from "jsonwebtoken"

class SessionsController {
    async create(request: Request , response: Response , next: NextFunction) {
        try {
            
            const bodySchema = z.object({
                email: z.string().email(),
                password: z.string()
            })
            
            const { email , password } = bodySchema.parse(request.body)

            const user = await prisma.user.findFirst({
                where: { email }
            })

            if (!user) {
                throw new AppError("invalid email or password" , 401)
            }

            const passwordMatched = await compare(password , user.password)

            if (!passwordMatched) {
                throw new AppError("invalid email or password" , 401)
            }

            const { secret , expiresIn } = authConfig.jwt

            const token = sign({role: user.role ?? "member"} , secret , {
                subject: user.id,
                expiresIn
            })
 
            const { password: hashedPassword  , ...userWithoutPassword } = user

            return response.json({ token  , user: userWithoutPassword})
        } catch (error) {
            next(error)
        }
    }
}

export { SessionsController }