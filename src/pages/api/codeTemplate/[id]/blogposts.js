import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { id } = req.query;  // Get the template ID from the URL

    try {
        // Fetch all blog posts that reference this code template
        const blogPosts = await prisma.blogPost.findMany({
            where: {
                codeTemplates: {
                    some: {
                        id: parseInt(id),  // Check if the code template is mentioned
                    },
                },
            },
            include: {
                user: {  // Include the author's name
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        if (blogPosts.length === 0) {
            return res.status(404).json({ success: false, message: 'No blog posts found for this code template' });
        }

        res.status(200).json({ success: true, data: blogPosts });
    } catch (error) {
        console.error('Error fetching blog posts for code template:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch blog posts' });
    }
}
