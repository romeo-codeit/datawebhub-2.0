import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from test.env
config({ path: resolve(process.cwd(), './test.env') });

console.log('TEST_VAR:', process.env.TEST_VAR);