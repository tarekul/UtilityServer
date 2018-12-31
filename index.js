const math = require('mathjs');
const request = require('request');
const express = require('express');
const app = express();
const port = 3000

app.get('/',(req,res)=>{
    res.send('Hello World');
})

app.get('/math/add',(req,res) =>{
/* return this JSON below
{
  input: {
    a: 2,
    b: 3
  },
  sumString: '2 + 3',
  sum: 5
}
*/
    let returnObj = {
        input : {}, 
        sumString: '', 
        sum: 0
    };
    const keys = Object.keys(req.query);
    const result = keys.slice(0).reduce((acc,key,i,arr) =>{
        if(!parseInt(req.query[key])){
            returnObj = {}
            returnObj.error = 'You passed a non-number value into the parameters.'
            acc = 'no sum'
            arr.splice(1)
            return acc
        }

        returnObj.input[key] = parseInt(req.query[key])

        if(i !== keys.length - 1 ){
            returnObj.sumString = returnObj.sumString + " " + req.query[key] + " " + "+"
        }
        else if(i === keys.length - 1){
            returnObj.sumString = returnObj.sumString + " " + req.query[key]
        }
        
        return math.add(acc,parseInt(req.query[key]));
    },0)

    if(result != 'no sum') returnObj.sum = result;
    
    res.json(returnObj);
})

app.get('/math/multiply',(req,res) =>{
    /* return this JSON below
    {
        input: {
            cat: 50,
             b: 3,
            zoo: 10
        },
        productString: '50 * 3 * 10',
        product: 1500   
    }
    */
        let returnObj = {
            input : {}, 
            productString: '', 
            product: 0
        };
        const keys = Object.keys(req.query);
        const result = keys.slice(0).reduce((acc,key,i,arr) =>{
            //console.log(parseInt(req.query[key]))
            if(!parseInt(req.query[key])) {
                //console.log('null found');
                returnObj = {}
                returnObj.error = 'You passed a non-number value into the parameters.'
                acc = 'no product';
                arr.splice(1);
                return acc
            }
            returnObj.input[key] = parseInt(req.query[key])
    
            if(i !== keys.length - 1 ){
                returnObj.productString = returnObj.productString + " " + req.query[key] + " " + "*"
            }
            else if(i === keys.length - 1){
                returnObj.productString = returnObj.productString + " " + req.query[key]
            }
            
            return math.multiply(acc,parseInt(req.query[key]));
        },1)
        
        if(result !== 'no product') returnObj.product = result;
        
        res.json(returnObj);
})



const getGifs = (search, cb) => {
    if (search === "" || search.trim() === "") {
        return;
    }

    const api_key = 'siIyo4w5mg0REENX76Sr57QTgkt3BWvY';
    const url = `https://api.giphy.com/v1/gifs/search?api_key=${api_key}&q=${search}`;

    request(url,(error,response,body)=>{
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); 
        cb(JSON.parse(body));
    })
    // request.open("GET", url);
    // request.addEventListener('load', (response) => {
    //     //console.log(response);
        
    //     const data = JSON.parse(response.currentTarget.response);
    //     console.log(data);
        
    //     const gifArray = [];
    //     data.data.forEach(currentGif => {
    //         const url = currentGif.images.original.url;
    //         gifArray.push(url);
    //     });

    //     cb(gifArray);
    // })
    // request.send(null);
}

app.get('/gif',(req,res)=>{
    const key = Object.keys(req.query)
    const search = req.query[key[0]];
    // let limit = req.query[key[1]];
    // if(limit === 'undefined') limit = 25;
    getGifs(search,(body)=>{
        const gifs = body.data.reduce((acc,currentGif)=>{
             acc.push(currentGif.images.original.url)
             return acc;
            
        },[])

        
        res.send(gifs)

        
    })
    
})






app.listen(port,()=>{
    console.log(`Example app listening on port ${port}`);
    
})