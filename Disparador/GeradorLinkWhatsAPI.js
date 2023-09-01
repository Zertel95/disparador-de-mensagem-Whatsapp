
var Background = chrome.extension.getBackgroundPage(), numero, message;

var input_API = document['getElementsByClassName']('input-API');
var input_API2 = document['getElementsByClassName']('input-API2');
var copy_link = document['getElementsByClassName']('copy-link');


//Ouvi eventos de carregamento para os inputs
document['getElementById']('ChatId').addEventListener("mouseout", gerar_link);
document['getElementById']('message').addEventListener("mouseout", gerar_link);

document['getElementById']('ChatId').addEventListener("mouseover", setFocusId);
document['getElementById']('message').addEventListener("mouseover", setFocusMessage);

function setFocusId(){
	document['getElementById']('ChatId').focus()
}

function setFocusMessage(){
	document['getElementById']('message').focus()
}


copy_link[0].addEventListener("click", copiar_link_M);
copy_link[1].addEventListener("click", copiar_link_M2);

function gerar_link(){
	InputEvent = Event || InputEvent; var _0x183FA = new InputEvent('input',{bubbles:true});
	
	numero =  Background.LimparNumero(document['getElementById']('ChatId').value);
	message = encodeURIComponent(document['getElementById']('message')['value']);

	if (!isNaN(parseFloat(numero)) && isFinite(numero) == true){
		
		if(document['getElementById']('message')['value'] != ''){
			
			input_API[0]['focus']();			
			input_API[0]['value'] = 'https://api.whatsapp.com/send?phone=' + numero + '&text=' + message;			
			input_API[0]['dispatchEvent'](_0x183FA);
			
			input_API2[0]['focus']();			
			input_API2[0]['value'] = 'https://wa.me/' + numero + '?text=' + message;			
			input_API2[0]['dispatchEvent'](_0x183FA);
		
		}else{
			
			input_API[0]['focus']();
			input_API[0]['value'] = 'https://api.whatsapp.com/send?phone=' + numero;
			input_API[0]['dispatchEvent'](_0x183FA);
			
			input_API2[0]['focus']();
			input_API2[0]['value'] = 'https://wa.me/' + numero;
			input_API2[0]['dispatchEvent'](_0x183FA);
		
		}
		
		showHideCopy("Hide");
		
		copy_link[0].style.backgroundColor = "rgba(30,108,147,1)";
		copy_link[1].style.backgroundColor = "rgba(30,108,147,1)";
	}
}

function copiar_link_M(){
	
	if(numero != '' && input_API[0]['value'] != ''){	
		gerar_link();
		//alert(input_API[0]['value']);
		copy_link[0]['title'] = 'Link copiado';
		copy_link[0]['innerHTML'] = 'Copiado';
		copy_link[0].style.backgroundColor ='#26d367';
		copy_link[1]['title'] = 'Copiar ink';
		
		document.querySelector('.input-API').select();
		document.execCommand('copy');
		
		showHideCopy("Show");

	}
}

function copiar_link_M2(){
	
	if(numero != '' && input_API2[0]['value'] != ''){		
		gerar_link();
		//alert(input_API[1]['value']);
		copy_link[1]['title'] = 'Link copiado';
		copy_link[1]['innerHTML'] = 'Copiado';
		copy_link[1].style.backgroundColor ='#26d367';
		copy_link[0]['title'] = 'Copiar ink';
		
		document.querySelector('.input-API2').select();
		document.execCommand('copy');
		
		showHideCopy("Show");
	}
}

function showHideCopy(action){
	if(action == "Show"){
		document['getElementById']('areaTransfenria')['innerHTML'] = "Link copiado para área de transferência";
	}else if(action == "Hide"){
		document['getElementById']('areaTransfenria')['innerHTML'] = "";
	}else{
		document['getElementById']('areaTransfenria')['innerHTML'] = "";
	}
}


