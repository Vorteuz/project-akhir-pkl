import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    await dbConnect();

                    const user = await User.findOne({ email: credentials.email });

                    if (!user) {
                        console.error("[Auth] User not found:", credentials.email);
                        throw new Error("No user found with the email");
                    }

                    const isValid = await bcrypt.compare(credentials.password, user.password);

                    if (!isValid) {
                        console.error("[Auth] Invalid password for user:", credentials.email);
                        throw new Error("Invalid password");
                    }

                    console.log("[Auth] User authenticated successfully:", credentials.email);
                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        daerah: user.daerah,
                        paket: user.paket,
                    };
                } catch (error) {
                    console.error("[Auth] Authorization error:", error.message);
                    throw error;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.daerah = user.daerah;
                token.paket = user.paket;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.daerah = token.daerah;
                session.user.paket = token.paket;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
