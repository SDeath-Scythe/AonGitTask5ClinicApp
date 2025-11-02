const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();
const drugsRoutes = require("./routers/drugs.routes");
const patientsRoutes = require("./routers/patient.routes");
const adminRoutes = require("./routers/admin.routes");
const visitRoutes = require("./routers/visit.routes");

app.use(express.json());
app.get("/", (req, res) => {
  res.json({ message: "Server is live..." });
});

app.use("/drugs", drugsRoutes);
app.use("/patients", patientsRoutes);
app.use("/admin", adminRoutes);
app.use("/visits", visitRoutes);

// Only start server in local development (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export for Vercel
module.exports = app;

//step1 : npm i @prisma/client
//step2 : npm i prisma -D
//step3 : npx prisma init --datasource-provider postgresql
//step4 : get tables form chatgpt to put them on prisma/schema.prisma
//step5 : npx prisma db push
//optional : npx prisma studio

