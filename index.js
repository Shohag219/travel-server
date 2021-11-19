const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;

const app = express();

const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dqsnl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("resorts");
    const resortCollection = database.collection("allResorts");
    const addCollection = database.collection("addResorts");
    const bookingCollection = database.collection("addBooking");

    // GET API
    app.get("/allResorts", async (req, res) => {
      const cursor = await resortCollection.find({});
      const resort = await cursor.toArray();
      res.send(resort);
    });

    // POST API
    app.post("/addResorts", async (req, res) => {
      const addResort = req.body;
      console.log("hitting the post API", addResort);

      const result = await resortCollection.insertOne(addResort);
      console.log(result);

      res.json(result);
    });

    // post booking API

    app.post("/addBooking", async (req, res) => {
      const booking = req.body;
      console.log("hitting the post API", booking);

      const result = await bookingCollection.insertOne(booking);
      console.log(result);

      res.json(result);
    });

    // get all bookings

    app.get("/myBookings/:user:email", async (req, res) => {
      const cursor = await bookingCollection.find({});
      const booking = await cursor.toArray();
      res.send(booking);
    });

    // get all resorts
    app.get("/addResorts", async (req, res) => {
      const cursor = await resortCollection.find({});
      const resort = await cursor.toArray();
      res.send(resort);
    });

    // manage booking bookings
    app.get("/manageAllBookings", async (req, res) => {
      const cursor = await bookingCollection.find({});
      const manageBooking = await cursor.toArray();
      res.send(manageBooking);
    });

    // put API

    app.put("/approveBooking/:id", async (req, res) => {
      const approveBooking = req.body;
      console.log("hitting the post API", approveBooking);

      const result = await bookingCollection.updateOne(approveBooking);
      console.log(result);

      res.json(result);
    });

    // DELETE API

    app.delete("/deleteResort/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await resortCollection.deleteOne(query);
      res.json(result);
    });

    // delete booking
    app.delete("/deleteBooking/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookingCollection.deleteOne(query);
      res.json(result);
    });
  } finally {
    // client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running the marriot server");
});

app.listen(port, () => {
  console.log("Running travel marriot server on port", port);
});
