const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port =  process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fbkqb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try{
        await client.connect();
        // console.log('connected to database')
        const database = client.db('lipstic');
        const productCollection = database.collection('products');
        const ordersCollection = database.collection('orders');
        const reviewCollection = database.collection('review');
        const usersCollection = database.collection('users');

        //get products API
        app.get('/products', async(req, res) => {
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });
        app.get('/review', async(req, res) => {
            const cursor = reviewCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });

        //get review API
        app.get('/review', async(req, res) => {
            const cursor = reviewCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        });
          // get api for a single service

    app.get("/placeorder/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await  productCollection.findOne(query);
        res.send(result);

      });
  

      //UPDATE API  
      app.put("/orders/:id", async (req, res) => {
        const id = req.params.id;
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
          $set: {
            status: "Shipped"
          },
        };
        const result = await ordersCollection.updateOne(filter, updateDoc, options)
        res.json(result);
      });

    //DELETE API
    app.delete('/orders/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await ordersCollection.deleteOne(query);
        console.log('deleting user with id', result);
        res.json(result)
    })
    app.delete('/products/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await productCollection.deleteOne(query);
        console.log('deleting user with id', result);
        res.json(result)
    })

        //get manage  API
        app.get('/orders', async(req, res) => {
            const cursor = ordersCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });

 // post api for insert booking of an user

 app.post("/placeorder", async (req, res) => {
    const orderInfo = req.body;
    const result = await ordersCollection.insertOne(orderInfo);
    res.json(result);
  });

  app.post("/review", async (req, res) => {
    const orderInfo = req.body;
    const result = await reviewCollection.insertOne(orderInfo);
    res.json(result);
  });

  //make an user to an admin
  app.put("/users/admin", async (req, res) => {
    const user = req.body;
    const filter = { email: user.email };
    const updateDoc = { $set: { role: "admin" } };
    const result = await usersCollection.updateOne(filter, updateDoc);
    res.json(result);
  });

  app.get("/users/:email", async (req, res) => {
    const email = req.params.email;
    const query = { email: email };
    const user = await usersCollection.findOne(query);
    let isAdmin = false;
    if (user?.role === "admin") {
      isAdmin = true;
    }
    res.json({ admin: isAdmin });
  });

 app.post("/users", async (req, res) => {
    const usersInfo = req.body;
    const result = await usersCollection.insertOne(usersInfo);
    res.json(result);
  });

// post api for add a new review

app.post("/product", async (req, res) => {
    const ordersInfo = req.body;
    const result = await productCollection.insertOne(ordersInfo);
    res.json(result);
  });

    }

    finally{
        // await client.close();
    }
}

run().catch(console.dir);
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`running travel server`, port)
})