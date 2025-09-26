require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require("express")
const cors = require("cors")
const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eynxzxz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        const clientCollection = client.db("clientDB").collection("clients")
        const userCollection = client.db("usersDB").collection("users")

        // client Related Api Database

        // insert
        app.post("/clients", async (req, res) => {
            const newClient = {
                ...req.body,
                userEmail: req.body.userEmail
            }
            const result = await clientCollection.insertOne(newClient)
            res.send(result)
        })

        // read
        app.get('/clients', async (req, res) => {
            const result = await clientCollection.find().toArray()
            res.send(result)
        })

        // specific id read

        app.get("/clients/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await clientCollection.findOne(query)
            res.send(result)
        })

        // specifiq user email route

        app.get("/myplants/:email", async(req, res)=>{
            const email = req.params.email
            const result = await clientCollection.find({userEmail : email}).toArray()
            res.send(result)
        })


        // update 

        app.put("/clients/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updateData = req.body;
            const UpdatedDoc = {
                $set: updateData
            }
            const result = await clientCollection.updateOne(filter, UpdatedDoc, options)
            res.send(result)
        })

        // delete 

        app.delete("/clients/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await clientCollection.deleteOne(query)
            res.send(result)
        })





        // user  Related api database from client

        // insert 

        app.post("/users", async (req, res) => {
            const newUser = req.body;
            console.log(newUser);
            const result = await userCollection.insertOne(newUser)
            res.send(result)
        })

        // read 

        app.get('/users', async (req, res) => {
            const result = await userCollection.find().toArray()
            res.send(result)
        })








        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");


    } finally {

    }
}
run().catch(console.dir);



app.get("/", (req, res) => {
    res.send("Welcome Plant")
})

app.listen(port, (req, res) => {
    console.log(`Server is running on Port ${port}`);
})