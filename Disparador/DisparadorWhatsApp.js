
var Background = chrome.extension.getBackgroundPage(), maxTime;
var ArrayChatsId = new Array(), v = 0, tipo, chatId, base64, fileName, legendaText;

document['getElementById']("starSends").addEventListener("click", starSends);

document['getElementById']("sendSelfAnswer").addEventListener("click", sendSelfAnswer);

document['getElementById']('setChats').addEventListener("click", callSetDestinatarios)

document['getElementById']('UploadFile').addEventListener("change", UploadFile);

document['getElementById']('UploadFileTxt').addEventListener("change", UploadFileTxt);

document['getElementById']('UploadSelfAnswer').addEventListener("change", UploadSelfAnswer);

document['getElementById']('chatsId').addEventListener("mouseout", getDestinatarios);//change, keydown

document['getElementById']('setChats').addEventListener("mouseout", setColorDefault);
document['getElementById']('setChats').addEventListener("mouseover", setColor);

document['getElementById']('ddiCountry').addEventListener("keyup", getDestinatarios);

document['getElementById']('chatsId').addEventListener("mouseover", setFocusChats);

document['getElementById']('messageLengenda').addEventListener("mouseover", setFocusMessage);
document['getElementById']('messageLengenda').addEventListener("mouseout", setMessages);
document['getElementById']('messageLengenda').addEventListener("dblclick", injectMessages);

document['getElementById']('messageLengenda')['placeholder'] = "Digite uma mensagem ou multiplas mensagens no formato abaixo:\n\n" + 
"Messages{Olá tudo bem?; Oi qual é o seu nome?; Oi; Olá; Olá, tem um minuto da sua atenção?}\n\n" +
"Dê um duplo click aqui para inserir as múltiplas mensagens padrão da ferramenta que serão enviadas aleatoriamente"; 


function getDestinatarios(){
	
	ArrayChatsId = new Array();
	
	chatText = document['getElementById']('chatsId')['value'];
	
	var x = chatText.split(decodeURIComponent("%0A")).length;
	
	var ddi = document['getElementById']('ddiCountry')['value']
	
	if(chatText != "" && x == 1){
		
		ArrayChatsId[0] = Background.LimparNumero(ddi + chatText)
		document['getElementById']('qtChats').innerHTML = 'Qt Chats: 1';
		
	}else if (chatText != "" && x > 1){
		
		for (a = 0; a < x; a++){	
			
			var id = Background.LimparNumero(ddi + chatText.split(decodeURIComponent("%0A"), x)[a])
			
			if (id.length > 10){
				//console.log(id);
				ArrayChatsId[a] = id;
			
			}
		}
		
		//remover duplicatas
		ArrayChatsId = ArrayChatsId.filter(function(este,z){return ArrayChatsId.indexOf(este) == z;})
		
		document['getElementById']('qtChats').innerHTML = 'Qt Chats: ' + ArrayChatsId.length;
	}
	
}

function callSetDestinatarios(){
	document['getElementById']('UploadFileTxt').click();
}

function setColorDefault(){
	document['getElementById']('setChats').style.color = "#000000";
}

function setColor(){
	document['getElementById']('setChats').style.color = "#ffffff";
}

function setFocusChats(){
	document['getElementById']('chatsId').focus()
}

function setFocusMessage(){
	document['getElementById']('messageLengenda').focus()
}

function starSends(){
	
	//https://sweetalert.js.org/
	swal("Tipo de mensagem?", {
		buttons: {
			Texto: "Texto",
			Midia: "Midia"
		},
	}).then((value) => {
		switch (value) {
			case "Texto":
			
				sendText()
				break;

			case "Midia":

				document['getElementById']('UploadFile').click()
				break;

			default:
			//Não fazer nada
		}
	});
}

function UploadFile(event) {
	
	console.clear();
	
	var input = event.target;
	var reader = new FileReader();
	
	reader.onload = function(){
		
		tipo = "midia";
		chatId = ArrayChatsId;
		base64 = reader.result;
		fileName = input.files[0].name.split(".", 1)[0];
		legendaText = encodeURIComponent(document['getElementById']('messageLengenda')['value']);
		
		if(input.files[0].size <= 67108864){//se o tamanho do arquivo for menor ou igual a que 64 MB, execute. 
	
			//console.log(base64);
			
				if(ArrayChatsId.length > 0 
				&& ArrayChatsId[0].length > 10 
				&& !isNaN(parseFloat(ArrayChatsId[0])) 
				&& isFinite(ArrayChatsId[0]) == true){

				set_maxTime()
				
				StarSend()
				
			}else{
				swal('Definar pelo menos um destinatátio');
			}
		
		}else{
			
			swal('Selecione um arquivo com no máximo 64 MB');
			
		}
	
	};
	
	reader.readAsDataURL(input.files[0]);//Base64

	/*console.log(input.files[0]);//objeto capturado (dados completo)
	console.log(input.files[0].name);
	console.log(input.files[0].size);
	console.log(input.files[0].webkitRelativePath);
	console.log(input.files[0].type);*/
	
}

//https://www.guj.com.br/t/ler-txt-com-javascript-sem-usar-input/336533
function UploadFileTxt(event) {

	console.clear();
	
	var input = event.target;
	var reader = new FileReader();

	reader.onload = function(){
		var Text_txt = reader.result;
		//console.log(Text_txt);
		document['getElementById']('chatsId')['value'] = Text_txt
		getDestinatarios()
		
	};

	reader.readAsText(input.files[0], "UTF-8");

	/*console.log(input.files[0]);//objeto capturado (dados completo)
	console.log(input.files[0].name);
	console.log(input.files[0].size);
	console.log(input.files[0].webkitRelativePath);
	console.log(input.files[0].type);*/

}

function sendText(){
	
	tipo = "text";
	chatId = ArrayChatsId;
	base64 = "";
	fileName = "";
	legendaText = encodeURIComponent(document['getElementById']('messageLengenda')['value']);

	if(ArrayChatsId.length > 0 
	&& legendaText != "" 
	&& ArrayChatsId[0].length > 10 
	&& !isNaN(parseFloat(ArrayChatsId[0])) 
	&& isFinite(ArrayChatsId[0]) == true){
		
		set_maxTime()
		
		StarSend()
		
	}else{
		swal('Definar pelo menos um destinatátio e o conteúdo da mensagem');
	}
	
}

function sendTextSelfAnswer(){
	
	tipo = "text";
	chatId = ArrayChatsId;
	base64 = "";
	fileName = "";
	legendaText = encodeURIComponent(document['getElementById']('messageLengenda')['value']);

	if(ArrayChatsId.length > 0 
	&& legendaText != "" 
	&& ArrayChatsId[0].length > 10 
	&& !isNaN(parseFloat(ArrayChatsId[0])) 
	&& isFinite(ArrayChatsId[0]) == true){
		
		sendAnswer()
		
	}else{
		swal('Definar pelo menos um destinatátio e o conteúdo da mensagem');
	}
	
}


function sendSelfAnswer(){

	//https://sweetalert.js.org/
	swal("Tipo de mensagem?", {
		buttons: {
			Texto: "Texto",
			Midia: "Midia"
		},
	}).then((value) => {
		switch (value) {
			case "Texto":

				sendTextSelfAnswer()
			  
				break;

			case "Midia":

				document['getElementById']('UploadSelfAnswer').click()
				break;

			default:
			//Não fazer nada
		}
	});

}


function sendAnswer(){
	
	var json = '{"TypeMessage":"' + tipo + '","ChatId":"' + chatId + '","Base64":"' + base64 + '","FileName":"' + fileName + '","LegendaText":"' + legendaText + '"}'

	var msg = {
		action_: 'chatsSelfAnswer',
		Json: json
	}
	
	//enviar parametros para a página WhatsApp web
	chrome.tabs.update(Background.whats_Tab,{selected:!0});
	chrome.tabs.sendMessage(Background.whats_Tab, msg);	
	
	//swal("Configuração inserida")

}

function UploadSelfAnswer(event) {
	
	var input = event.target;
	var reader = new FileReader();
	
	reader.onload = function(){
		
		tipo = "midia";
		chatId = ArrayChatsId;
		base64 = reader.result;
		fileName = input.files[0].name.split(".", 1)[0];
		legendaText = encodeURIComponent(document['getElementById']('messageLengenda')['value']);
		
		if(input.files[0].size <= 67108864){//se o tamanho do arquivo for menor ou igual a que 64 MB, execute. 
	
			//console.log(base64);
			
				if(ArrayChatsId.length > 0 
				&& ArrayChatsId[0].length > 10 
				&& !isNaN(parseFloat(ArrayChatsId[0])) 
				&& isFinite(ArrayChatsId[0]) == true){

				sendAnswer()
				
			}else{
				swal('Definar pelo menos um destinatátio');
			}
		
		}else{
			
			swal('Selecione um arquivo com no máximo 64 MB');
			
		}
	
	};
	
	reader.readAsDataURL(input.files[0]);//Base64

}


function set_maxTime(){
	maxTime = parseInt(Background.LimparNumero(document['getElementById']('maxTime')['value']))-4
	//se o valor do tempo máximo for vazio ou não for numérico, será definido um default de 20 segundos
	if(isNaN(parseFloat(maxTime)) && isFinite(maxTime) == false || maxTime < 16) maxTime = 16;
}


//Função que vc terá que chamar no seu sistema passando os devidos parametros
function SendMessage(tipo, chatId, base64, fileName, legendaText){
	
	
	//Se for multiplas mensagens
	if(textMessages.indexOf("Messages{") != -1){
		
		//Texto, midia e arquivos
		var url = 'https://api.whatsapp.com/send?phone=' + chatId + '&json={"TypeMessage":"' + tipo + '","ChatId":"' + chatId + '","Base64":"' + base64 + '","FileName":"' + fileName + '","LegendaText":"' + ArrayMessages[Math.floor(Math.random()*(ArrayMessages.length))] + '"}'

		Background.Get_paramentros(url);
		//console.log(url)

	}else{
		
		//Apenas mensagem de texto
		//var url = 'https://api.whatsapp.com/send?phone=' + chatId + '&text=' + legendaText
		
		//Texto, midia e arquivos
		var url = 'https://api.whatsapp.com/send?phone=' + chatId + '&json={"TypeMessage":"' + tipo + '","ChatId":"' + chatId + '","Base64":"' + base64 + '","FileName":"' + fileName + '","LegendaText":"' + legendaText + '"}'

		Background.Get_paramentros(url);
		//console.log(url)
		
	}

}


function StarSend(){
	
	if(v == 0){
		
		SendMessage(tipo, ArrayChatsId[v], base64, fileName, legendaText)
		v++;

	}

	if (v >= ArrayChatsId.length){
		
		v = 0;
		
		setTimeout(function(){
			alert('Mensagens enviadas com sucesso.')
		},30000);
		
	}else{

		setTimeout(function(){
			
			//console.log(ArrayChatsId[v]+ ' ' + v);	
			
			SendMessage(tipo, ArrayChatsId[v], base64, fileName, legendaText)

			v++;
			StarSend()
			
		},Math.floor(Math.random()*maxTime+5)*1000);
		//http://www.devfuria.com.br/javascript/numeros-aleatorios/

	}
}	


var ArrayMessages = new Array(), textMessages
function setMessages(){
	
	ArrayMessages = new Array()
	textMessages = document['getElementById']('messageLengenda')['value']

	if(document['getElementById']('messageLengenda')['value'].indexOf("Messages{") != -1){
		var e = textMessages.split('; ').length;

		for (q = 0; q < e; q++){	
			ArrayMessages[q] = textMessages.split("; ", e)[q].replace("Messages{", "").replace("}", "")
			//console.log(textMessages.split("; ", e)[q].replace("Messages{", "").replace("}", ""))
		}
	}
	
}

function injectMessages (){
	
	var defaultMessages = "Messages{Olá tudo bem; Oi qual é o seu nome?; Oi; Olá; Olá, tem um minuto da sua atenção?; Oi posso falar com você?; Olá tudo bem?; Olá; Opa quero falar com vc; Olá tudo bem?; Opa tudo bom; Opa como vai?; E aí blz; Olá tenho algo a te dizer.Ok; Olá; Olá tudo bem?; Gostaria de falar contigo; Oi; Posso falar vc?; Olá; E aí blz, tenho algo pra te falar; Olá tudo bem?; Oi}";

	InputEvent = Event || InputEvent; var _0x183FA = new InputEvent('input',{bubbles:true});

	document['getElementById']('messageLengenda')['focus']();
	document['getElementById']('messageLengenda')['value'] = defaultMessages;
	document['getElementById']('messageLengenda')['dispatchEvent'](_0x183FA);
	
}


