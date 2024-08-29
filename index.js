import http from "http";
import express from "express";
import path from "path";
import {WebSocketServer} from "ws";
import qr from "qrcode-terminal";

import ip from "ip";

let PORT = 4269;

console.log(ip.address())


let app = express();

let server = http.createServer(app)

let wss = new WebSocketServer({
	server
});



const WriteStream = process.stdout;

wss.on("connection", (socket) => {

	console.log("connection")

	socket.on("message", msg => {

		msg = msg.toString();
		
		console.log(msg);


	})

})

app.use(express.static(path.resolve("static")));




app.get("/", (req, res) => {

	res.send("hello");
})

server.listen(PORT, () => {

	let ips = ip.address().split(".");

	qr.generate(`http://${ip.address()}:${PORT}/index.html?ip1=${ips[2]}&ip2=${ips[3]}`, {small:true}, (code)=> {
		console.log(code)
	})
});
