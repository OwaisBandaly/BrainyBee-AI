import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/api/user/google/login"
        },
        async (accessToken, refreshToken, profile, done) => {
            const payload = {
                email: profile.emails?.[0].value,
                provider: "google",
                providerId: profile.id,
                username: profile.displayName
            }

            return done(null, payload)
        }
    )
);

export default passport