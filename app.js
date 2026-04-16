const exp = require('express');
const bp = require('body-parser');
const app = exp();

const product = require('./routes/product.route');
const mongoose = require('mongoose');

let hostUrl = 'mongodb+srv://Anurag:anurag@cluster0.tkgpq.mongodb.net/test';
let mongodb = process.env.hostUrl;
mongoose.connect(mongodb)
mongoose.Promise = global.Promise;
let db = mongoose.connection;
// db.on('error', console.error.bind()
app.listen(3000, ()=>{
    console.log("hi, your welcome on 3000....");
})

app.use(bp.urlencoded({extended: true}));
app.use('/products', product)



app.get('/', (req, res)=>{
    res.send(`<h1>Hello, this line using h1-tag </h1>
        <form action="/quotes" method="POST">
        <input type="text" placeholder="name" name="name">
        <input type="text" placeholder="quote" name="quote">
        <button type="submit">Submit</button>
        </form>`
    );
})
app.post('/quotes', (req, res)=>{
    console.log(req.body);
})