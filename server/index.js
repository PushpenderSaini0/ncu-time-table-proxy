const fetch = require('node-fetch');
const jsdom = require("jsdom");
const fs = require("fs");
require('dotenv').config()

const { JSDOM } = jsdom;

const USER = {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
};

const getCookie = (headers) => {
    let obj = {};
    headers.forEach((value, key) => {
        let keys = key.split('.'),
            last = keys.pop();
        keys.reduce((r, a) => r[a] = r[a] || {}, obj)[last] = value;
    });;
    return obj['set-cookie'].split(';')[0] + " ; " + obj['set-cookie'].split(';')[9].split(',')[1];
}

const getList = async () => {
    const res = await fetch("https://www.ncuindia.edu/admin_1lhvzdz/", {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Content-Type": "application/x-www-form-urlencoded",
            "Upgrade-Insecure-Requests": "1"
        },
        "referrer": "https://www.ncuindia.edu/admin_1lhvzdz/",
        "body": "log=" + USER.username + "&pwd=" + USER.password + "&wp-submit=Log+In&redirect_to=https%3A%2F%2Fwww.ncuindia.edu%2Fwp-admin%2F&testcookie=1",
        "method": "POST",
    })
    let dom = null;
    const doc = await fetch("https://www.ncuindia.edu/time-table/", {
        "headers": {
            "Cookie": getCookie(res.headers)
        },
        "referrer": "https://www.ncuindia.edu/ncu-students/",
        "method": "GET"
    });
    const data = [];
    const docText = await doc.text();
    dom = new JSDOM(docText)
    const makeObj = (name) => {
        const links = [];
        dom.window.document
            .getElementById(name)
            .nextElementSibling
            .childNodes
            .forEach(el => {
                if (el.tagName == "LI")
                    links.push({ text: el.childNodes[0].text.trim(), link: el.childNodes[0].href })
            })
        data.push({ name, links });
    }
    ["open-elective-time-table",
        "applied-science",
        "school-of-engineering-and-technology",
        "school-of-management",
        "school-of-law"
    ].forEach(makeObj)
    return data;
}

const init = async () => {
    const liveData = await getList();
    const liveDataStr = JSON.stringify(liveData);
    fs.writeFile("./public/data.json", liveDataStr, (err) => {
        if (err) console.log(err);
        console.log("Successfully Written to File.");
    })

    fs.writeFile("./public/date.json", JSON.stringify({ date: Date() }), (err) => {
        if (err) console.log(err);
        console.log("Time Stamp added");
    })
}

init();
