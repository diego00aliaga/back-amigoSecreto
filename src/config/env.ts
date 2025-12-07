import * as dotenv from 'dotenv';
dotenv.config();

const { PORT } = process.env;

export const env = () => ({
  // SERVER
  port: PORT ? Number(PORT) : 3000,
  env: process.env.ENV || 'local',

  accessTokenSecret: process.env.JWT_SECRET,
  accessTokenExpiresIn: process.env.JWT_SECRET_EXPIRES_IN,
  refreshTokenSecret: process.env.JWT_SECRET_REFRESH,
  refeshTokenExpiresIn: process.env.JWT_SECRET_REFRESH_EXPIRES_IN,



  // DATABASE
  database: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },

  google: {
    googleSecretKey: process.env.GOOGLE_SECRET_KEY,
    googleSiteKey: process.env.GOOGLE_SITE_KEY,
    privateKey: process.env.PRIVATE_KEY,
    privateKeyId: process.env.PRIVATE_KEY_ID,
  },



  mp: {
    secretKey: process.env.MP_SECRET_KEY,
  },

  backUrl: process.env.BACK_URL,
  frontUrl: process.env.FRONT_URL,
  firebase: {
    projectId: process.env.PROJECT_ID,
    privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.CLIENT_EMAIL,
  },
});

console.log(env());
