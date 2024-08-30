let ip = new URLSearchParams(window.location.search)
let ip1 = ip.get("ip1")
let ip2 = ip.get("ip2")	
ip = "192.168." + ip1 + "." + ip2;

let ws = new WebSocket("http://" + ip + ":4269");

let mousepos_on_touch = {x : 0, y:0};
let last_mouse_pos = {x : 0, y : 0};


let polling_rate = 2;

let current_poll = 0;

let touch_start_time = 0;


let pinch_pos = []
let pinch_dist = 0;
let mid_point = 0;

document.addEventListener("DOMContentLoaded", () => {

	document.body.addEventListener("touchstart", (e) => {


		if(e.targetTouches.length == 1){

			mousepos_on_touch = {x : e.touches[0].pageX, y: e.touches[0].pageY}


			touch_start_time = Date.now();
		}

		if(e.targetTouches.length == 2){

			pinch_pos = [
				{x : e.touches[0].pageX, y : e.touches[0].pageY},
				{x : e.touches[1].pageX, y : e.touches[1].pageY}
			]

			mid_point = get_two_finger_mid_point(pinch_pos[0], pinch_pos[1]);
	

			pinch_dist = Math.hypot(
				pinch_pos[0].x - pinch_pos[1].x,
				pinch_pos[0].y - pinch_pos[1].x
			)

		}

		if(document.body.requestFullscreen){
			document.body.requestFullscreen();			
		}
	});

	document.body.addEventListener("touchend", (e) => {
		let touch_end_time = Date.now();


		let tap_time = (touch_end_time - touch_start_time);

		if(tap_time < 100){
			ws.send(JSON.stringify({type:"tap"}))
		}

	})

	document.body.addEventListener("touchmove", (e) => {


		if(current_poll !== polling_rate){
			current_poll += 1;
			console.log(current_poll)
			return
		} 
		
		current_poll = 0;	

		//movement of fingers simple trackpad behav
		if (e.targetTouches.length == 1){
		


			

			let delta = {
				x : e.touches[0].pageX - mousepos_on_touch.x, 
				y : e.touches[0].pageY - mousepos_on_touch.y, 
			}	

			delta.type = "move";
			ws.send(JSON.stringify(delta))

			mousepos_on_touch = {x : e.touches[0].pageX, y: e.touches[0].pageY}

		}	

		if(e.targetTouches.length == 2){

			let current_pinch_pos = [
				{x : e.touches[0].pageX, y : e.touches[0].pageY},
				{x : e.touches[1].pageX, y : e.touches[1].pageY}
			]
			
			let current_pinch_dist = Math.hypot(
				current_pinch_pos[0].x - current_pinch_pos[1].x,
				current_pinch_pos[0].y - current_pinch_pos[1].x
			)

			let current_mid_point = get_two_finger_mid_point(current_pinch_pos[0], current_pinch_pos[1]);
		

			let two_finger_delta = {
				x : current_mid_point.x - mid_point.x,
				y : current_mid_point.y - mid_point.y
			};

			mid_point = current_mid_point;

			let rotation = get_pinch_rotation(current_pinch_pos[0], current_pinch_pos[1])

			ws.send(JSON.stringify({
				type : "pinch",
				pinch_delta : current_pinch_dist - pinch_dist,
				rotation,
				two_finger_delta,
			}))

		}
	})	

})


function get_two_finger_mid_point(pos1, pos2){
	let mid_point = {
		x : (pos1.x - pos2.x)/2 + pos2.x,	
		y : (pos1.y - pos2.y)/2 + pos2.y
	};

	return mid_point;
}

function get_pinch_rotation(pos1, pos2){


	let mid_point = get_two_finger_mid_point(pos1, pos2);


	let rotation = Math.atan2(mid_point.y - pos2.y, mid_point.x - pos2.x) * 180/Math.PI;


	return rotation
}
