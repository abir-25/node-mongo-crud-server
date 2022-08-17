const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.port || 5000;

//Middleware
app.use(cors());
app.use(express.json());

//user: abir_Mongodemo
//pass: AVrcreSgSLlFJ49P

const uri =
  "mongodb+srv://abir_Mongodemo:AVrcreSgSLlFJ49P@cluster0.z1vef.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const database = client.db("foodMaster");
    const usersCollection = database.collection("users");
    // create a document to insert
    // const doc = {
    //   name: "Tasfia Karim",
    //   phone: "tasfi@gmail.com",
    // };
    // const result = await haiku.insertOne(doc);
    // console.log(`A document was inserted with the _id: ${result.insertedId}`);

    //GET API
    app.get("/users", async (req, res) => {
      const cursor = usersCollection.find({});
      const users = await cursor.toArray();

      res.send(users);
    });

    //GET User Details API
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await usersCollection.findOne(query);
      console.log("Finding User id: ", result);
      res.send(result);
    });

    //POST API
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const result = await usersCollection.insertOne(newUser);
      console.log("API is hitting", result);
      res.json(result);
    });

    //DELETE API
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      console.log("Deleting User id: ", result);
      res.json(result);
    });

    //POST API for UPDATE
    app.put("/users/update/:id", async (req, res) => {
      const id = req.params.id;
      const editUser = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: editUser.name,
          email: editUser.email,
        },
      };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      console.log("API is hitting for Update", result);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("App is running");
});

app.listen(port, () => {
  console.log("App is running successfully", port);
});
