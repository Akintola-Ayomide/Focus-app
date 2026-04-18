import app from './app';
import { env } from './config/env';

const startServer = () => {
  try {
    const port = env.PORT || 5000;
    app.listen(port, () => {
      console.log(`[Server]: Server is running at http://localhost:${port}`);
      console.log(`[Environment]: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('[Error]: Failed to start the server', error);
    process.exit(1);
  }
};

startServer();
