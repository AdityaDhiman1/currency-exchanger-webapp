const fs = require('fs');
const hbs = require("hbs")
const https = require("https")
const express = require("express")
const path = require('path');
const app = express()

app.set("view engine", 'hbs')
let url = "https://open.er-api.com/v6/latest";
app.use(express.static(path.join(__dirname, "public")))

app.get("/", (req, res) => {
    https.get(url, (resp) => {
        let body = "";
        try {
            resp.on("data", (chunk) => {
                body += chunk;
            })
            resp.on("end", () => {
                let api_dta = JSON.parse(body);
                res.render("index", {data: api_dta.rates});
            })
        } catch (err) {
            console.log(err);
        }
    }).on("error", (err) => {
        console.log(err);
    });
});
app.get("/currencychanger", (req, res) => {
    let curr = req.query.country;
    let y = [];
    
    https.get(`${url}/${curr}`, (resp) => {
        let body = "";
        try {
            resp.on("data", (chunk) => {
                body += chunk;
            })
            resp.on("end", () => {
                let api_dta = JSON.parse(body);
                for (let i in api_dta.rates) {
                    let info = {};
                    info.currencycode = i;
                    info.rates = api_dta.rates[i];
                    if (fs.existsSync(`./public/img/${i}.webp`)) {
                        info.img = `${i}.webp`;
                    }
                    else if (fs.existsSync(`./public/img/${i}.png`)) {
                        info.img = `${i}.png`;
                    }
                    else if (fs.existsSync(`./public/img/${i}.svg`)) {
                        info.img = `${i}.svg`;
                    }
                    y.push(info);
                }
                // console.log(y);
                res.render("img", {data: api_dta.rates, img: y});
            })
        } catch (err) {
            console.log(err);
        }
    }).on("error", (err) => {
        console.log(err);
    });
});

app.listen(3989, () => {
    console.log("Server has been startee at 3989 port");
})