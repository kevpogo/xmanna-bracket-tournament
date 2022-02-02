import 'dotenv/config';
import { bootstrap } from './bootstrap';

const start = async (): Promise<void> => {
  await bootstrap();
};

start();
