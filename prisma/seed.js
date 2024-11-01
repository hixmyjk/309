import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


async function main() {
    // Create Users
    const user1 = await prisma.user.create({
        data: {
            firstName: 'Alice',
            lastName: 'Smith',
            email: 'alice@example.com',
            password: 'hashedpassword1', // Placeholder for demonstration; use hashed passwords
            avatar: 'https://example.com/avatar1.png',
            phoneNumber: '123-456-7890',
            role: 'USER',
        },
    });

    const user2 = await prisma.user.create({
        data: {
            firstName: 'Bob',
            lastName: 'Johnson',
            email: 'bob@example.com',
            password: 'hashedpassword2',
            avatar: 'https://example.com/avatar2.png',
            phoneNumber: '987-654-3210',
            role: 'USER',
        },
    });

    // Create Code Templates
    const template1 = await prisma.codeTemplate.create({
        data: {
            title: 'FizzBuzz in JavaScript',
            description: 'A simple FizzBuzz implementation in JavaScript',
            code: 'for(let i=1;i<=100;i++){ console.log((i%3?"":"Fizz")+(i%5?"":"Buzz")||i); }',
            language: 'JavaScript',
            tags: 'fizzbuzz, javascript, basics',
            userId: user1.id,
        },
    });

    const template2 = await prisma.codeTemplate.create({
        data: {
            title: 'Hello World in Python',
            description: 'A classic Hello World program in Python',
            code: 'print("Hello, World!")',
            language: 'Python',
            tags: 'python, hello world, basics',
            userId: user2.id,
        },
    });
    // Create Blog Posts
    const post1 = await prisma.blogPost.create({
        data: {
            title: 'Learning JavaScript Basics',
            description: 'An overview of JavaScript basics.',
            content: 'JavaScript is a versatile language...',
            tags: 'javascript, programming',
            userId: user1.id,
        },
    });

    const post2 = await prisma.blogPost.create({
        data: {
            title: 'Python for Beginners',
            description: 'A guide for beginners to start learning Python.',
            content: 'Python is a powerful language...',
            tags: 'python, beginners, guide',
            userId: user2.id,
        },
    });

    // Create Comments with Replies
    const comment1 = await prisma.comment.create({
        data: {
            content: 'Great blog post!',
            userId: user2.id,
            postId: post1.id,
        },
    });

    await prisma.comment.create({
        data: {
            content: 'Thanks for the feedback!',
            userId: user1.id,
            postId: post1.id,
            parentCommentId: comment1.id,
        },
    });

    // Create Ratings (Upvote/Down votes)
    await prisma.rating.createMany({
        data: [
            { value: 1, userId: user1.id, blogPostId: post2.id }, // Upvote for post2 by user1
            { value: -1, userId: user2.id, blogPostId: post1.id }, // Downvote for post1 by user2
            { value: 1, userId: user1.id, commentId: comment1.id }, // Upvote for comment1 by user1
        ],
    });

    console.log('Database seeded with sample data.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
