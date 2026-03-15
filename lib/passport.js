import passport from "passport";
import LocalStrategy from 'passport-local';
import {PrismaPg} from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';
import {PrismaClient} from '../generated/prisma/index.js';

// Prisma 7+ Driver Adapter Setup
const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });


// Passport Strategy
passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  },
  async (username, password, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { username } });
      if (!user || user.password !== password) { // Use bcrypt.compare in production!
        return done(null, false, { message: 'Invalid credentials' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export { passport, prisma };