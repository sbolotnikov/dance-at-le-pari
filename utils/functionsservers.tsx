'use server';
import { prisma } from "@/lib/prisma";
 // get post by SLUG
 export const getPost = async (slug: string) => {


    try {
        const post = await prisma.post.findUnique({
          where: { slug },
          include: { user: true },
        });
        await prisma.$disconnect()
        return post;
      } catch (err) {
        return null
      }
};
import fs from 'fs';
import path from 'path';
export const getFile = async (id: string) => {
  const filePath = path.join(process.cwd(), "public",id);
  return fs.readFileSync(filePath, 'utf8');
}


export const getCategory = async (slug: string) => {


  try {
      const category = await prisma.category.findUnique({
        where: { slug }, 
      });
      await prisma.$disconnect()
      return category;
    } catch (err) {
      return null
    }
};
export const getPicture = async (id: string) => {


  try {
      const picture = await prisma.picture.findUnique({
        where: { id }, 
      });
      await prisma.$disconnect()
      return picture?.file;
    } catch (err) {
      return null
    }
};
export const getEvent = async (id: number) => {


    try {
        const post = await prisma.event.findUnique({
          where: { id }, 
          include: { template: true },
        });
        await prisma.$disconnect()
        return post;
      } catch (err) {
        return null
      }
};

export const IsUserSubscribed = async (email: string ) => {
 try{
  const user = await prisma.contact.findUnique({
    where: { email },
  });
  await prisma.$disconnect()
  if(!user){
    return false;
  }
  if(user?.status === 'Subscribed'){
    return true;
  }
  return false;
 } catch (err) {
  console.log(err)
 }
}