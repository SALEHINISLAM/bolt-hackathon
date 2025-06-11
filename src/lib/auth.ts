import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import connectToDatabase from '@/lib/ConnectDB';
import User from '@/lib/models/User';

// Extend the User type to include role
interface ExtendedUser {
  id: string;
  email: string;
  name: string;
  image?: string;
  role: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials): Promise<ExtendedUser | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          const db = await connectToDatabase();
          
          if (!db) {
            // Mock user for development when DB is not available
            if (credentials.email === 'demo@example.com' && credentials.password === 'password') {
              return {
                id: 'demo-user',
                email: 'demo@example.com',
                name: 'Demo User',
                role: 'client',
              };
            }
            throw new Error('Invalid credentials');
          }
          
          const user = await User.findOne({ 
            email: credentials.email.toLowerCase(),
            provider: 'credentials',
            isActive: true 
          });

          if (!user) {
            throw new Error('No user found with this email');
          }

          const isPasswordValid = await user.comparePassword(credentials.password);
          
          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          };
        } catch (error: unknown) {
          console.error('Authentication error:', error);
          const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
          throw new Error(errorMessage);
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          const db = await connectToDatabase();
          
          if (!db) {
            // Allow Google sign in even without DB
            const extendedUser = user as ExtendedUser;
            extendedUser.role = 'client';
            extendedUser.id = user.email || 'google-user';
            return true;
          }
          
          const existingUser = await User.findOne({ 
            email: user.email?.toLowerCase() 
          });

          if (existingUser) {
            if (existingUser.provider !== 'google') {
              existingUser.provider = 'google';
              existingUser.providerId = account.providerAccountId;
              existingUser.image = user.image;
              await existingUser.save();
            }
            
            const extendedUser = user as ExtendedUser;
            extendedUser.role = existingUser.role;
            extendedUser.id = existingUser._id.toString();
          } else {
            const newUser = new User({
              email: user.email?.toLowerCase(),
              name: user.name,
              image: user.image,
              provider: 'google',
              providerId: account.providerAccountId,
              emailVerified: new Date(),
              role: 'client',
            });
            
            await newUser.save();
            const extendedUser = user as ExtendedUser;
            extendedUser.role = newUser.role;
            extendedUser.id = newUser._id.toString();
          }
        } catch (error) {
          console.error('Error during Google sign in:', error);
          // Allow sign in with default role if DB fails
          const extendedUser = user as ExtendedUser;
          extendedUser.role = 'client';
          extendedUser.id = user.email || 'google-user';
        }
      }
      
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        const extendedUser = user as ExtendedUser;
        token.role = extendedUser.role;
        token.id = extendedUser.id;
      }
      
      if (trigger === 'update' && session) {
        const extendedSession = session as { role: string };
        token.role = extendedSession.role;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        const extendedUser = session.user as ExtendedUser;
        extendedUser.id = token.id as string;
        extendedUser.role = token.role as string;
      }
      
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      } else if (new URL(url).origin === baseUrl) {
        return url;
      }
      return baseUrl;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
};