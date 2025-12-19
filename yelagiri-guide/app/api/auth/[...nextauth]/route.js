import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            try {
                // Sync user with backend
                const response = await fetch(`${process.env.NEXTAUTH_URL}/api/users/sync`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        googleId: user.id,
                    }),
                });

                if (!response.ok) {
                    console.error('Failed to sync user with backend');
                    return false;
                }

                return true;
            } catch (error) {
                console.error('Error in signIn callback:', error);
                return false;
            }
        },
        async session({ session, token, user }) {
            // Add any additional user info to the session here if needed
            return session;
        },
    },
    pages: {
        signIn: '/signin',
    },
});

export { handler as GET, handler as POST };
