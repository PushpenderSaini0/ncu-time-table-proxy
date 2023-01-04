const API = "https://d3qwmocld6bg1y.cloudfront.net/";

const getData = async () => {
    const res = await fetch(API + "data");
    const json = await res.json();
    document.querySelector("#timestamp").innerHTML = `Cache updated at : ${json.timestamp} <br /> Updates every 15 minute`;
    return json.data;
}

const plotTimeTable = (data) => {
    data.forEach(el => {
        const name = el.name;
        const links = el.links;
        let s = `<h1 id="${name}" class="pb-2 border-bottom"># ${name}</h1>`;
        links.forEach(el => {
            s += `
            <div class="row py-3 row-cols-1 row-cols-lg-1">
                <div class="col d-flex align-items-start">
                    <div>
                        <h4>${el.text}</h4>
                        <a href="${el.link}" class="btn btn-primary">
                            Download
                        </a>
                    </div>
                </div>
            </div>
            `;
        });
        s += "<br /><br /><br /><br />"
        document.querySelector('#timetable').innerHTML += s;
    });
    document.querySelector('#spinner').remove();
}

getData().then(plotTimeTable);
