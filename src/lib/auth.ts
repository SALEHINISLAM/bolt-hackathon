import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import connectToDatabase from '@/lib/ConnectDB';
import User from '@/lib/models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          await connectToDatabase();
          
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
        } catch (error: any) {
          console.error('Authentication error:', error);
          throw new Error(error.message || 'Authentication failed');
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
          await connectToDatabase();
          
          const existingUser = await User.findOne({ 
            email: user.email?.toLowerCase() 
          });

          if (existingUser) {
            // Update existing user with Google info if needed
            if (existingUser.provider !== 'google') {
              existingUser.provider = 'google';
              existingUser.providerId = account.providerAccountId;
              existingUser.image = user.image;
              await existingUser.save();
            }
            
            user.role = existingUser.role;
            user.id = existingUser._id.toString();
          } else {
            // Create new user
            const newUser = new User({
              email: user.email?.toLowerCase(),
              name: user.name,
              image: user.image,
              provider: 'google',
              providerId: account.providerAccountId,
              emailVerified: new Date(),
              role: 'client', // Default role
            });
            
            await newUser.save();
            user.role = newUser.role;
            user.id = newUser._id.toString();
          }
        } catch (error) {
          console.error('Error during Google sign in:', error);
          return false;
        }
      }
      
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      
      // Handle session updates
      if (trigger === 'update' && session) {
        token.role = session.role;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Handle role-based redirects
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
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};