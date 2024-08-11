import express from 'express';


const router = express.Router();

router.get('/auth/google', (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar'],
  });
  res.redirect(authUrl);
});

router.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
  // Guarda los tokens en la sesión del usuario o en tu base de datos
  res.redirect('/turnos');
});

export default router;