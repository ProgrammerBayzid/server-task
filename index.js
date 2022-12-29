const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000


// middelware
app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.j7rvpzy.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });










async function run() {
    try {
        const myTaskCollection = client.db('task').collection('myTask');
        const completedCollection = client.db('task').collection('completed');
        const userCollection = client.db('task').collection('users');


        app.post('/addtask', async (req, res) => {
            const task = req.body;
            const result = await myTaskCollection.insertOne(task);
            res.send(result)
        });

        app.get('/services', async (req, res) => {
            let email = req.query.email;
            const query = { email: email };
            const cursor = await myTaskCollection.find(query).toArray();
            res.send(cursor)
        });
       
        app.delete('/mytask/:id',  async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await myTaskCollection.deleteOne(filter);
            res.send(result);
        });

        app.put('/alltask/:id',  async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    complete: true
                }
            }
            const result = await myTaskCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        });

        app.put('/alltasks/:id',  async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    complete: false
                }
            }
            const result = await myTaskCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        });
       
        app.delete('/completetask/:id',  async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await myTaskCollection.deleteOne(filter);
            res.send(result);
        });


        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        });
   // context user 
   app.get('/user', async (req, res) => {
    const email = req.query.email
    const query = { email: email }
    const users = await userCollection.findOne(query);
    res.send(users);
});

      


        

        app.patch('/patch/task/:id', async (req, res) => {
            const id = req.params.id;
            const task = req.body.task;
            const image = req.body.image;
            const query = { _id: ObjectId(id) };
            const updatedUser = {
                $set: {
                    task: task,
                    image: image,
                }
            };
            const result = await myTaskCollection.updateOne(query, updatedUser)
            res.send(result)
        })


    }
    finally {

    }
}
run().catch(err => console.error(err))












app.get('/', (req, res) => {
    res.send('My task server is running')
})
app.listen(port, (req, res) => {
    console.log(`My Task server is running port ${port}`);
})