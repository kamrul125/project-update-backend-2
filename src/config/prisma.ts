import { PrismaClient } from "@prisma/client";

// সরাসরি 'export const' ব্যবহার করুন
export const prisma = new PrismaClient();

// নিচের ডিফল্ট এক্সপোর্টটি মুছে দিন
// export default prisma;