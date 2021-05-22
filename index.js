const http = require("http");
const fs = require("fs");
const requests = require("requests");
const homeFile = fs.readFileSync("home.html","utf-8");

const port = process.env.PORT || 4000;

const replaceVal = (tempVal,orgVal)=>{
     let temperature = tempVal.replace("{%tempval%}",orgVal.main.temp);
     temperature = temperature.replace("{%tempmin%}",orgVal.main.temp_min);
     temperature = temperature.replace("{%tempmax%}",orgVal.main.temp_max);
     temperature = temperature.replace("{%location%}",orgVal.name);
     temperature = temperature.replace("{%country%}",orgVal.sys.country);
     temperature = temperature.replace("{%tempstatus%}",orgVal.weather[0].main);
     return temperature;
}
const server = http.createServer((req,res)=>{
    if(req.url=="/"){
        requests("http://api.openweathermap.org/data/2.5/weather?q=Lucknow&appid=fb35038402815b7f66b95c6521e385b0"
        )
        .on("data", (chunk) => {
            const objData = JSON.parse(chunk);
            const arrData = [objData];
            // console.log(arrData[0].main.temp);
             const realtimeData = arrData
             .map((val)=> replaceVal(homeFile,val))
             .join(" ");
             res.write(realtimeData);
        })
        .on("end", (err) =>{
            if(err) return console.log("connection closed due to error", err);
            // console.log("end");
            res.end();
        });
    }
});

server.listen(port,"127.0.0.1",()=>{
    console.log(`server is running on port ${port}`)
});