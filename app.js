import express from 'express';
import session from 'express-session';
import {PrismaSessionStore} from '@quixo3/prisma-session-store';
import { passport, prisma } from './lib/passport.js';
import { mainRoute } from './routes/mainroute.js';
const app = express();
const PORT = 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000 // ms (e.g., 7 days)
    },
    secret: 'a safe secret', // Replace with a real secret key
    resave: false, 
    saveUninitialized: false,
    store: new PrismaSessionStore(
      prisma, // Your Prisma 7+ Client instance
      {
        model: 'userSession',
        checkPeriod: 2 * 60 * 1000, // ms (checks for expired sessions every 2 mins)
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    ),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", mainRoute);

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`app running on  http://localhost:${PORT}`);
});