
var num_whats, messege_whats, msg;
var exp_ToNum = /phone=\d*\&/; //Expressão para o número de um chat
var exp_ToNum2 = /wa\.me\/\d*/;
var exp_ToMessege = /text=\w*/; //Expressão para a mensagem a se inserida
var exp_ToJson = /json=\w*/; //Expressão para o link com formatação json

function Get_paramentros(Link_API){

	num_whats = ''; messege_whats = ''; msg = '';

	if (Link_API.search(exp_ToJson) != -1){
		
		var duplas = decodeURIComponent("%22");
		
		try{
			
			var obj = JSON.parse(Link_API.split("json=", 2)[1]
						//substituir scape por aspas duplas
						.replace(/{%22/g, "{"+duplas)
						.replace(/%22:%22/g, duplas+":"+duplas)
						.replace(/%22,%22/g, duplas+","+duplas)
						.replace(/%22}/g, duplas+"}")
						
						.replace(/{%27/g, "{"+duplas)
						.replace(/%27:%27/g, duplas+":"+duplas)
						.replace(/%27,%27/g, duplas+","+duplas)
						.replace(/%27}/g, duplas+"}")
					);
	
			msg = {
				action_: 'sendWhatsAPI',
				TypeMessage: obj.TypeMessage,
				ChatId: obj.ChatId,
				Base64: obj.Base64,
				FileName: obj.FileName,
				LegendaText: obj.LegendaText
			
			}
			
			send_toChat()
			
			/*
			alert(obj.TypeMessage);
			alert(obj.ChatId);
			alert(obj.Base64);
			alert(obj.FileName);
			alert(obj.LegendaText);
			*/

		}catch(e){
			alert("Verifique se a url está formatada corretamente")
		}
		
	}else if (Link_API.search(exp_ToNum) != -1 && Link_API.search(exp_ToMessege) != -1){
		
		//console.log(String(exp_ToNum.exec(Link_API)).replace("phone=", "").replace("&", ""));
		num_whats = String(exp_ToNum.exec(Link_API)).replace("phone=", "").replace("&", "");
		
		//console.log(Link_API.split("&text=", 2)[1].replace("&source=&data=", ""))
		messege_whats = Link_API.split("&text=", 2)[1].replace("&source=&data=", "")
		
		msg = {
			action_: 'sendWhatsAPI',
			TypeMessage: 'text',
			ChatId: num_whats,
			Base64: '',
			FileName: '',
			LegendaText: messege_whats
		}
		
		send_toChat()
		
	}else if(Link_API.search(exp_ToNum2) != -1 && Link_API.search(exp_ToMessege) != -1){
		
		//console.log(String(exp_ToNum2.exec(Link_API)).replace("wa.me/", ""));
		num_whats = String(exp_ToNum2.exec(Link_API)).replace("wa.me/", "");
	
		//console.log(Link_API.split("?text=", 2)[1].replace("&source=&data=", ""))
		messege_whats = Link_API.split("?text=", 2)[1].replace("&source=&data=", "")
		
		msg = {
			action_: 'sendWhatsAPI',
			TypeMessage: 'text',
			ChatId: num_whats,
			Base64: '',
			FileName: '',
			LegendaText: messege_whats
		}
		
		send_toChat()
	
	}

}

function send_toChat(){
	
	//Verificar se a página do url_Whats está aberta, se sim irá seleciona-lá e executar 
	chrome.tabs.getSelected(function(tab){
		
		if(tab.id == whats_Tab){//se a guia Whatsapp Web estiver ativa então execute

			//Inserir parametros
			chrome.tabs.sendMessage(whats_Tab, msg);				

		}else{//Senão, selecione e execute
			
			chrome.tabs.getAllInWindow(function(e){
				if(JSON.stringify(e).indexOf(url_Whats) != -1){
					for(var t,o = 0; t = e[o]; o++){
						if(t.url.indexOf(url_Whats) == 0 ){//se a pagina do whatsapp estiver aberta, então execute
						
							//selecionar pagina url_Whats
							chrome.tabs.update(t.id,{selected:!0});
							//enviar parametros para content script
							chrome.tabs.sendMessage(t.id, msg);				
							//fechar a página da API aberta
							if(tab.url.indexOf(url_API) == 0) chrome.tabs.remove(tab.id);
							
							break;
						
						}
					}
				}else{//senão encontrar abra uma nova guia	
					alert(notify_login);
					chrome.tabs.create({url: url_Whats})	
				}
			});
			
		}
		
	});
	
}




