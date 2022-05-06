const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const cors =require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

// USER: masukComputer
// PASS: vanglbTBl5HE4CL8

// Middleware
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ohssp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    await client.connect()
    const productCollection = client.db('masukComputer').collection('product')

    app.get('/product', async (req, res)=>{
        const query = {};
        const cursor = productCollection.find(query);
        const products  = await cursor.toArray();
        res.send(products)
    })

}

run().catch(console.dir);
app.get('/', (req, res)=>{
    res.send('Connected My Server')
})

app.listen(port, ()=>{
    console.log('My server run within', port)
})