//import packages
const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

//Middlewares
app.use(cors());
app.use(express.json());

//MongoDB URI and create client
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.qeyihtc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

//DB and Collections
const stylehubDB = client.db("StyleHub");
const productsCollection = stylehubDB.collection("products");
const usersCollection = stylehubDB.collection("users");

//Routes
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/products", async (req, res) => {
  const result = await productsCollection.find({}).toArray();
  res.send(result);
});

app.post("/products", async (req, res) => {
  const data = req.body;
  const result = await productsCollection.insertOne(data);
  res.send(result);
});

app.get("/products/:id", async (req, res) => {
  const id = req.params.id;
  const result = await productsCollection.findOne({ _id: new ObjectId(id) });
  res.send(result);
});

app.patch("/products/:id", async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  const result = await productsCollection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: updatedData,
    }
  );
  res.send(result);
});

app.delete("/products/:id", async (req, res) => {
  const id = req.params.id;
  const result = await productsCollection.deleteOne({ _id: new ObjectId(id) });
  res.send(result);
});

//Database connection and listen to serever

const run = async () => {
  try {
    await client.connect();
    console.log("DB Connection successful!");
  } finally {
    app.listen(port, (err) => {
      err && console.log("Error occured in server!");
      console.log("Server running on port", port);
    });
  }
};
run().catch(console.dir);
