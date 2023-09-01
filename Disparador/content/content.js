
var inject_body = setInterval(function() {
	try{
		if(document['getElementsByTagName']('body')[0]['innerHTML'].indexOf('Nova conversa') != -1
		|| document['getElementsByTagName']('body')[0]['innerHTML'].indexOf('Nuevo chat') != -1
		|| document['getElementsByTagName']('body')[0]['innerHTML'].indexOf('New chat') != -1){
			
			clearInterval(inject_body);
			Inserir_body();

		}
	}catch(e){}
	
}, 3000);

var url_sweetalert = chrome.extension.getURL('libs/sweetalert.min.js');
var url_jquery = chrome.extension.getURL('libs/jquery-3.2.0.js');

function Inserir_body(){
	
	console.clear()
	console.log('Body extension inserido')

	//Carregar Store
	injectScript("https://Suebersson.github.io/DisparadorWhatsApp/Store.js", "body")

	//Carregar envios de whatsapp
	injectScript("https://Suebersson.github.io/DisparadorWhatsApp/send_message.js", "body")

	//Carregar extração de contatos
	injectScript("https://Suebersson.github.io/DisparadorWhatsApp/ExtrairListaContatos.js", "body")

	//Carregar extração de grupos
	injectScript("https://Suebersson.github.io/DisparadorWhatsApp/ExtrairMembrosGrupo.js", "body")
	
	//Carregar extração dos números das conversas
	injectScript("https://Suebersson.github.io/DisparadorWhatsApp/ExtrairListaConversas.js", "body")
	
	//injetar bibliotecas dentro da página Whatsapp
	injectScript(url_sweetalert, "body")
	injectScript(url_jquery, "body")
	
	setTimeout(function(){

		//Carregar status da bateria
		injectScript("https://Suebersson.github.io/DisparadorWhatsApp/Status_bateria.js", "body")

	},7000)

};


//ouvinte de mensagem enviadas do window
window.addEventListener("message", function(event) {

	if (event.data.action_){

		//receber parametros do window para o content script
		if(event.data.action_ == "WhatsApp_Store"){//falhado
			//var Store = event.data.Store
			//alert(Store.Chat.active().__x_formattedTitle)
			//alert(JSON.stringify(Store))

		//enviar parametros do window para o background
		}else if (event.data.action_ == "windowToBackground"){

			chrome.runtime.sendMessage(event.data);

		}

	}

}, false);


chrome.runtime.onMessage.addListener(function (message, sender, sendResponse){

	if(message.action_ == 'sendWhatsAPI'){
		
		var msg = {
			action_: 'sendWhatsAPI',
			TypeMessage: message.TypeMessage,
			ChatId: message.ChatId,
			Base64: message.Base64,
			FileName: message.FileName,
			LegendaText: message.LegendaText
		}

		window.postMessage(msg);

	}else if(message.action_ == 'chatsSelfAnswer'){

		window.postMessage({action_: message.action_, Json: message.Json})

	}else if(message.action_ == "iniciarChat"){

		iniciarChat()

	}else if(message.action_ == 'ExtrairListaContatos'){

		window.postMessage({action_: message.action_})

	}else if(message.action_ == 'ExtrairMembrosGrupo'){

		window.postMessage({action_: message.action_})
		
	}else if(message.action_ == 'ExtrairListaConversas'){

		window.postMessage({action_: message.action_})

	}else if(message.action_ == 'filterNumbers'){

		window.postMessage({action_: message.action_, NumToFilter: message.NumToFilter, ddi: message.ddi})

	}else if(message.action_ == 'cancelSelfAnswer'){

		window.postMessage({action_: message.action_})

	}

});


function injectScript(url_js, tag) {

	var node = document.getElementsByTagName(tag)[0];
	var script = document.createElement("script");
	script.type = 'text/javascript';
	script.src = url_js;
	script.onload = function() {this.parentNode.removeChild(this);}
	node.appendChild(script);

}


function iniciarChat(){

	var phone = LimparNumero(prompt('Digite o número de WhatsApp (DDI+DDD+número):'))

	if(phone != null && phone != "" && phone != undefined){
		//Se o valor inserido for maior que 10 caracteres e se for númerico, então execute
		if(phone.length > 11 && !isNaN(parseFloat(phone)) && isFinite(phone) == true){			
			
			var msg = {
				action_: 'abrir_chat',
				Id: phone + "@c.us"
			}

			window.postMessage(msg)

		}else{					

			swal({
			  title: "Número inválido",
			  text: "Digite o número no formato internacional: DDI+DDD+número (5511965421045)",
			  icon: "warning",
			  button: "OK",
			}).then((value) => {

				iniciarChat()
			})
			
		}
	}

}


function LimparNumero(n) {
	if(n != null){
		n = n
		.replace(/\s/g, "")
		.replace(/\+55/g, "")
		.replace(/\+\s\55/g, "")
		.replace(/\+/g, "")
		.replace(/-/g, "")
		.replace(/\(/g, "")
		.replace(/\)/g, "")
		.replace(/\./g, "")
		.replace(/\,/g, "")
		.replace(/\//g, "")
		.replace(/\#/g, "")
		.replace(/\*/g, "");
	}
    return n;
}

