
window.addEventListener("message", function(event) {
	
	if (event.data.action_){
	
		if(event.data.action_ == "LinkWhats_API"){

			var msg = {
				action_: "Link_API",
				link_: event.data.link_
			}

			chrome.runtime.sendMessage(msg);
		
		}
	}
	
}, false);
console.log('sendViaWebSite instalado');

