// server/src/index.ts
import { app } from './app.js';
import { env } from './config/env.js';

const port = Number(env.PORT) || 3000;

app.listen(port, () => {
  console.log(`[VibeCheck API] Server running in ${env.NODE_ENV} mode on port ${port}`);
  console.log(`[VibeCheck API] Health check available at http://localhost:${port}/api/health`);
});
