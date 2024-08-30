import http from "http";
import express from "express";
import path from "path";
import {WebSocketServer} from "ws";
import qr from "qrcode-terminal";

import ip from "ip";

import robot from "robotjs";

let PORT = 4269;

console.log(ip.address())


let app = express();

let server = http.createServer(app)

let wss = new WebSocketServer({
	server
});

let current_mouse_pos = {x : 0, y : 0};

let screen_width = robot.getScreenSize().width;

let sens = 4.3;
let scroll_sens = 0.2;


const clamp = x => {


	if(0 < x){

		return x;		
	}

	if(x <= 0){
		return 0;
	}

	if(x >= screen_width){
		return screen_width;
	}

}

const WriteStream = process.stdout;

wss.on("connection", (socket) => {

	console.log("connection")

	socket.on("message", msg => {


		msg = JSON.parse(msg.toString());


		if(msg.type == "move"){

			current_mouse_pos = {
				x : clamp(current_mouse_pos.x + msg.x * sens),
				y : clamp(current_mouse_pos.y  + msg.y * sens)
			};

			console.log(current_mouse_pos);
			robot.moveMouseSmooth(current_mouse_pos.x, current_mouse_pos.y, 0.1);	
		}

		
		if(msg.type == "tap"){
			robot.mouseClick();

		}

		if(msg.type == "pinch"){
			let {rotation, pinch_delta, two_finger_delta} = msg;

			console.log(msg)



			robot.scrollMouse(two_finger_delta.x * scroll_sens, two_finger_delta.y * scroll_sens);

		}
		

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
