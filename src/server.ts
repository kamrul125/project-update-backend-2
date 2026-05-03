import { Server } from 'http';
import app from './app';

const PORT = process.env.PORT || 5000;

let server: Server;

async function main() {
  try {
    server = app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();

// Vercel-এর জন্য app-কে অবশ্যই এক্সপোর্ট করতে হবে
export default app;