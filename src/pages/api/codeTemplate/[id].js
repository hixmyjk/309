import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { id } = req.query;

    try {
        // Fetch the code template by ID
        const template = await prisma.codeTemplate.findUnique({
            where: { id: parseInt(id) },  // Ensure ID is an integer
        });

        if (!template) {
            return res.status(404).json({ success: false, message: 'Code template not found' });
        }

        res.status(200).json({ success: true, data: template });
    } catch (error) {
        console.error('Error fetching code template:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch code template' });
    }
}
