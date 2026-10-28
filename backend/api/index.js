const app = require("../src/app");
const connectDB = require("../src/db/db");

let connectionPromise;

module.exports = async function handler(req, res) {
try {
if (!connectionPromise) {
connectionPromise = connectDB().catch((error) => {
connectionPromise = null;
throw error;
});
}


await connectionPromise;

return app(req, res);


} catch (error) {
console.error("Backend initialization failed:", error.message);


return res.status(500).json({
  message: "Database connection failed",
});


}
};
