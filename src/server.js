const { connectDB } = require('./config/db');
const app = require('./app');
const { port } = require('./config/config');

(async () => {
  try {
    // Connect to the database
    await connectDB();
    console.log('Database connected successfully');

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
})();
