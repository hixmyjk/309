import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

// Middleware to authenticate the token
export async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];  // Extract the Authorization header
    const token = authHeader && authHeader.split(' ')[1];  // Get the token from the header

    if (!token) {
        return res.status(401).json({ success: false, message: 'Authentication token is missing' });
    }

    try {
        // Verify the token using JWT secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user associated with the token
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
        });

        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        // Attach the user object to the request for further use
        req.user = user;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
}
