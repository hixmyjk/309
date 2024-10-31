import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: `Method ${req.method} not allowed` });
    }

    const { templateId } = req.body;

    try {
        // Fetch the original template to fork
        const originalTemplate = await prisma.codeTemplate.findUnique({
            where: { id: parseInt(templateId) },
            select: {  // Ensure you are selecting the fields you need
                title: true,
                description: true,
                code: true,
                language: true,
                tags: true,
            }
        });

        if (!originalTemplate) {
            return res.status(404).json({ success: false, message: 'Code template not found' });
        }

        // Log the template to ensure it has the fields you expect
        console.log('Original Template:', originalTemplate);

        // Check if req.user exists and has an ID (authentication middleware should ensure this)
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        // Fork the template (create a new template with the same details)
        const forkedTemplate = await prisma.codeTemplate.create({
            data: {
                title: `${originalTemplate.title} (Forked)`,
                description: originalTemplate.description,
                code: originalTemplate.code,
                language: originalTemplate.language,
                tags: originalTemplate.tags,
                userId: req.user.id,  // Ensure user is authenticated
                forkedFromId: originalTemplate.id,  // Track that this template is a fork of another one
            },
        });

        res.status(201).json({ success: true, data: forkedTemplate });
    } catch (error) {
        console.error('Error forking code template:', error);
        res.status(500).json({ success: false, message: 'Failed to fork code template' });
    }
}
