const express = require('express');
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');
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

    // Create A New Product
    app.post('/product', async(req, res)=>{
        const newProduct = req.body;
        const result = await productCollection.insertOne(newProduct)
        res.send(result)
    })
    // Delete Items
    app.delete('/inventory/:id', async (req, res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)}
        const result = await productCollection.deleteOne(query);
        res.send(result)
    })
  

    // Update Quantity After Delivery
    app.put('/inventory/:id', async(req, res)=>{
        const id = req.params.id;
        const delQty = req.body;
        console.log(delQty.updateQty)
        const filter = {_id: ObjectId(id)};
        const option = { upsert : true }
        console.log(filter)
        const updateDeliveryQty = {
            $set: {
                stock_Quantity: delQty.updateQty
            }
        }
        const result = await productCollection.updateOne(filter, updateDeliveryQty, option)
        res.send(result);
    })


    app.get('/inventory/:id', async (req, res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)}
        const result = await productCollection.findOne(query);
        res.send(result)
    })
    
    // get all product
    app.get('/product', async (req, res)=>{
        const query = {};
        const cursor = productCollection.find(query);
        const products  = await cursor.toArray();
        res.send(products)
    })
    // get 6 items for inventory
    app.get('/home', async(req, res)=>{
        const query = {};
        const cursor = productCollection.find(query).limit(6);
        const result = await cursor.toArray();
        res.send(result);
    })

}

run().catch(console.dir);
app.get('/', (req, res)=>{
    res.send('Connected My Server')
})

app.listen(port, ()=>{
    console.log('My server run within', port)
})
