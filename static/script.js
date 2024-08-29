let ip = new URLSearchParams(window.location.search)
let ip1 = ip.get("ip1")
let ip2 = ip.get("ip2")	
ip = "192.168." + ip1 + "." + ip2;

let ws = new WebSocket("http://" + ip + ":4269");

let mousepos_on_touch = {x : 0, y:0};


document.addEventListener("DOMContentLoaded", () => {

	document.body.addEventListener("touchstart", (e) => {

		mousepos_on_touch = {x : e.touches[0].pageX, y: e.touches[0].pageY}

	});

	document.body.addEventListener("touchmove", (e) => {

		//movement of fingers simple trackpad behav
		if (e.targetTouches.length == 1){
			
			let delta = {
				x : e.touches[0].pageX/window.innerWidth, 
				y : e.touches[0].pageY/window.innerHeight, 
			}	

			ws.send(JSON.stringify(delta))

			mousepos_on_touch = {x : e.touches[0].pageX, y: e.touches[0].pageY}

		}			
	})	

})
