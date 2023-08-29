import { prisma } from '@/lib/prisma';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
const bcrypt = require('bcryptjs');
import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import { html, text } from '../../../../utils/htmlEmail';
import { sendEmail } from '../../../../utils/sendEmail';

export const authOptions: NextAuthOptions = {
  // * PRISMA ADAPTER FOR NEXT-AUTH
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  // site: process.env.NEXTAUTH_URL,
  jwt: {
    // A secret to use for key generation (you should set this explicitly)
    secret: process.env.NEXTAUTH_SECRET,
  },

  providers: [
    CredentialsProvider({
      name: 'Sign in',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'hello@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isPasswordValid) {
          return null;
        }
        const userObj={
          image:user?.image,
          role:user?.role,
          email:user?.email,
          name:user?.name,
          id:user?.id,
          telephone:user?.telephone
        }
        return userObj ;
      } ,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: `${process.env.SITE_NAME}<${process.env.EMAIL_SERVER_USER}>`,
      maxAge: 24 * 60 * 60,
      async sendVerificationRequest({
        identifier: email,
        url,
        provider: { server, from },
      }) {
        const { host } = new URL(url);

        const sendEmailObj = await sendEmail({
          to: email,
          from: from,
          subject: `Sign in to ${host}`,
          text: text({ url, host }),
          html: html({ url, host, email }),
        });
      },
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      const user1 = await prisma.user.findUnique({
        where: {
          email: session.user.email ? session.user.email : '',
        },
      });
      // save user if none
      if (user1 === null && session.user.email) {
        const timestamp = Date.now();
        const dateObject = new Date(timestamp);
        const date = dateObject.getDate();
        const month = dateObject.getMonth() + 1;
        const year = dateObject.getFullYear();
        const hour = dateObject.getHours();
        const minute = dateObject.getMinutes();
        const second = dateObject.getSeconds();
        console.log(`${year}-${month}-${date} ${hour}:${minute}:${second}`);
        const status = await prisma.user.create({
          data: {
            email: session.user.email,
            name: session.user.name,
            image: session.user.image,
            emailVerified: `${year}-${month}-${date} ${hour}:${minute}:${second}`,
            role: 'User',
          },
        });
      }
      await prisma.$disconnect();
      return {
        ...session,
        user: {
          image:user1?.image,
          role:user1?.role,
          email:user1?.email,
          name:user1?.name,
          id:user1?.id,
          telephone:user1?.telephone
        },
      };
    },

    jwt: ({ token, user }) => {
      if (user) {
        const u = user as unknown as any;
        return {
          ...token,
          id: u.id,
          role: u.role,
        };
      }
      return token;
    },
  },
};
// export default NextAuth(authOptions)
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
