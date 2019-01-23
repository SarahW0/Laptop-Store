const fs = require("fs");
const http = require("http");
const url = require("url");

const json = fs.readFileSync(`${__dirname}/data/data.json`, "utf-8");
const templateLaptop = fs.readFileSync(
	`${__dirname}/templates/template-laptop.html`,
	"utf-8"
);
const templateCard = fs.readFileSync(
	`${__dirname}/templates/template-card.html`,
	"utf-8"
);
const templateProducts = fs.readFileSync(
	`${__dirname}/templates/template-overview.html`,
	"utf-8"
);

const laptopData = JSON.parse(json);

const server = http.createServer((req, res) => {
	const urlObj = url.parse(req.url, true);

	const pathName = urlObj.pathname;
	const id = urlObj.query.id;

	if (pathName === "/products" || pathName === "/") {
		res.writeHead(200, {
			"Content-type": "text/html"
		});

		let cards = "";
		//read template-card.html
		laptopData.forEach(element => {
			cards = cards + replaceTemplate(templateCard, element);
		});

		res.end(templateProducts.replace(/{%CARD%}/g, cards));
	} else if (pathName === "/laptop" && id < laptopData.length) {
		res.writeHead(200, {
			"Content-type": "text/html"
		});

		res.end(replaceTemplate(templateLaptop, laptopData[id]));
	} else if (/\.(jpg|jpeg|png|gif)$/i.test(pathName)) {
		fs.readFile(`${__dirname}${pathName}`, (err, data) => {
			res.writeHead(200, {
				"Content-type": "image/jpg"
			});

			res.end(data);
		});
	} else {
		res.writeHead(404, {
			"Content-type": "text/html"
		});
		res.end("The page is not found");
	}
});

server.listen(1337, "127.0.0.1", () => {
	console.log("Listening for requests now");
});

function replaceTemplate(originlHTML, laptop) {
	let output = originlHTML.replace(/{%PRODUCTNAME%}/g, laptop.productName);
	output = output.replace(/{%PRICE%}/g, laptop.price);
	output = output.replace(/{%IMAGE%}/g, laptop.image);
	output = output.replace(/{%SCREEN%}/g, laptop.screen);
	output = output.replace(/{%CPU%}/g, laptop.cpu);
	output = output.replace(/{%STORAGE%}/g, laptop.storage);
	output = output.replace(/{%RAM%}/g, laptop.ram);
	output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
	output = output.replace(/{%ID%}/g, laptop.id);

	return output;
}
