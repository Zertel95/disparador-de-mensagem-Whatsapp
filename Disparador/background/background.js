
var url_Whats = 'https://web.whatsapp.com/', url_API = 'https://api.whatsapp.com/send?phone=';

var notify_activasion = '- Após a ativação da extensão, evite desinstalar a extensão senão terá que inserir uma nova chave de ativação. ' +
						'Se quiser desativar o X de WhatsApp basta apenas clicar no icone da extensão ou desative a extensão no Chrome Extensions.';

var notify_login = '- Antes de enviar os parâmetros da mensagem certifique-se de esta com a página do WhatsApp Web aberta e logada!!';

var run_WhatsAPI = false, run_ImaUrl = false, whats_Tab;
var titleInactivate = chrome.runtime.getManifest().browser_action.default_title, titleActivated = "Extensão ativada";
var iconActivated = "icons/activated19.png", iconInactivated = "icons/inactivated19.png";

//Fazer algo quando a extensão for instalada ou atulizada
chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason == "install") {
		inviteToActivation()
    }//else if(details.reason == "update"){}
});

//Chamar atualização quando uma atualização estiver disponivel
chrome.runtime.onUpdateAvailable.addListener(function(details) {    
	chrome.runtime.reload()
});

//Quando for reativada
//Esse evento só funciona se o background script estiver definido como ("persistent": false) no Manifest
chrome.management.onEnabled.addListener(function(ExtensionInfo){
	reload_pageWhats()
});

//https://developer.chrome.com/extensions/tabs
//fazer algo quando for criado uma nova aba
chrome.tabs.onCreated.addListener(function(tab) {
	
	if (run_WhatsAPI == true){
		
		if (tab.url.indexOf(url_API) == 0 && run_ImaUrl == true) {
			Get_paramentros(tab.url)
		}
	}
	
});

chrome.webNavigation.onCompleted.addListener(function(tab) {

	if (run_WhatsAPI == true){
		
		if(tab.url == "about:blank"){
			//Não faça nada
		}else if (tab.url.indexOf(url_API) == 0 && run_ImaUrl == true){
			
			Get_paramentros(tab.url)
			
		}else if(tab.url.indexOf(url_API) == -1 && tab.url.indexOf(url_Whats) == -1){
			
			chrome.permissions.contains({
				permissions: ['tabs'],
				origins: [tab.url]
			}, function(result){
				if (result){//true, Se tiver permissão
					chrome.tabs.executeScript({file: "content/sendViaWebSite.js"})
				}else{//Senão, não faça nada
					//console.log('Não tem permissão')
				}
			});
	  	
		}

	}
	
});

//fazer algo quando for selecionado outra aba
chrome.tabs.onSelectionChanged.addListener(function(e) {
	chrome.tabs.getSelected(function(tab){
		var _url = String(tab.url)

		if (_url == url_Whats && run_WhatsAPI == true) {
			whats_Tab = tab.id;
			checkDate()
			checkValidity()
		}		
	});
});

//receber parametros do content script de qualquer página
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

	if (message.action_ == 'Link_API' && run_WhatsAPI == true){ 

		Get_paramentros(message.link_);
		
	}else if (message.action_ == 'windowToBackground' && run_WhatsAPI == true){
		
		//recurso implementado para futuras necessidades
		//alert(message.value_)
		
	}

});

function inviteToActivation(){
	
	chrome.storage.local.get(['statusApp'], function(result) {
	
		if(result.statusApp == undefined){
			
			if (confirm("Deseja ativar a extensão agora?") == true){
				setTimeout(function(){
					get_Keys()
				},5000)
			}
			
		}else{ 
			
			if(result.statusApp.activation == "Expirado"){
				
				
				if (confirm("Sua licença de uso expirou, para continuar usando os recursos da extensão adquira uma nova chave de ativação.\n\n" +
							"Deseja inserir uma nova chave de ativação?") == true)
							
				get_Keys()
				
			}else{

				setStatusActivated()
			
			}
			
		}
	
	});
}

//será chamado quando o navigator for atulizado ou reiniciado
(function(){	

	chrome.browserAction.getTitle({}, function(title){
		
		chrome.storage.local.get(['statusApp'], function(result){
			if(result.statusApp != undefined){
				if(result.statusApp.activation == "Ativado" && run_WhatsAPI == false){
					reload_pageWhats()
					setStatusActivated()
				}
			}
		});
	
	});
	
})();

function reload_pageWhats(){
	chrome.tabs.getAllInWindow(function(e){
		if(JSON.stringify(e).indexOf(url_Whats) != -1){
			for(var t,o = 0; t = e[o]; o++){
				if(t.url.indexOf(url_Whats) == 0 ){//se a pagina do whatsapp estiver aberta, então execute
				
					//selecionar pagina url_Whats
					chrome.tabs.update(t.id,{selected:!0});
					
					chrome.tabs.executeScript({code: 'location.reload()'});
					
					break;
				
				}
			}
		}
	});
}

function Active_extension(){
	
	var tempo = "", ativacao = "", Validity = "";
	var key = prompt('Insira a chave de ativação: ');

	if (key == "5"){
		
		Active_extension()
		
	}else if(key != "5" && key != null && key != undefined){
		
		if (key.indexOf("DIAS") != -1){
			
			if (/\d+/.test(key) == true){
				tempo = String(/\d+/.exec(key))
				ativacao = "Extensão ativada por " + tempo + " dias";
				Validity = get_periodo(tempo)
			}
			
		}else if (key.indexOf("DEFINITIVA") != -1){
			
			ativacao = "Extensão ativada com uso vitalício";
			Validity = get_periodo(720)
			
		}
		
		if (Validity != "" && Validity != undefined){
			
			if(getKeys.indexOf(key) != -1 && getKeysUseded.indexOf(key) == -1){
			
				var register = {
					activation: 'Ativado',
					dateActivation: date_today,
					dateValidity: Validity,
					key: key
				}
				
				//Registrar ativação no storage
				chrome.storage.local.get(['statusApp'], function(getRegister) {
					if(getRegister.statusApp != undefined){
						//Apagar e reescrever um novo registro
						chrome.storage.local.remove(['statusApp'])
						chrome.storage.local.set({statusApp: register})
					}else{
						chrome.storage.local.set({statusApp: register})
					}
				});
				
				setStatusActivated()
				
				//Registrar uso no google forms
				send_keyUseded(key)
				
				getKeys = new Array(); getKeysUseded = new Array();
				
				alert(ativacao);
				alert(notify_activasion + '\n\n' + notify_login);
				
				reload_pageWhats()

			}else{
				alert("A chave inserida já foi usada ou é invalida");
				Active_extension()
			}
		
		}else{
			alert("A chave inserida já foi usada ou é invalida");
			Active_extension()
		}
	}
}

function setStatusActivated(){
	chrome.browserAction.setIcon({path:{19: iconActivated}})
	chrome.browserAction.setTitle({title: titleActivated})
	run_WhatsAPI = true; run_ImaUrl = true
}

function checkValidity(){
	
	chrome.storage.local.get(['statusApp'], function(result) {

		if(result.statusApp != undefined){
			
			var dateActivation  = new Date(result.statusApp.dateActivation.split("/").reverse().join("/"))
			var dateValidity = new Date(result.statusApp.dateValidity.split("/").reverse().join("/"))
			
			if(dateValidity < new Date() && result.statusApp.activation == "Ativado"
			|| dateValidity < DateToday && result.statusApp.activation == "Ativado"
			|| dateActivation > new Date() && result.statusApp.activation == "Ativado"){
				
				chrome.browserAction.setIcon({path:{19: iconInactivated}})
				chrome.browserAction.setTitle({title: titleInactivate})
				run_WhatsAPI = false
				
				
				
				
				//Apagar e reescrever um novo registro
				chrome.storage.local.remove(['statusApp']);
				chrome.storage.local.set({statusApp: register});
				
			}
			
		}
	
	});
	
}

function checkDate(){
	if(DateToday == undefined){
		get_Date()
	}else if(new Date().getDate() != DateToday.getDate()){
		get_Date()
	}
}

function selectTabWhats(execute){
	
	if (run_WhatsAPI == true){
		chrome.tabs.getAllInWindow(function(e){
			if(JSON.stringify(e).indexOf(url_Whats) != -1){
				for(var t,o = 0; t = e[o]; o++){
					if(t.url.indexOf(url_Whats) == 0 ){
						chrome.tabs.update(t.id,{selected:!0});	
						
						if(execute == "iniciarChat"){

							chrome.tabs.sendMessage(whats_Tab, {action_: "iniciarChat"})
							
						}else if(execute == "ExtrairListaContatos"){

							chrome.tabs.sendMessage(whats_Tab, {action_: "ExtrairListaContatos"})
							
						}else if (execute == "ExtrairMembrosGrupo"){

							chrome.tabs.sendMessage(whats_Tab, {action_: "ExtrairMembrosGrupo"})
							
						}else if(execute == "ExtrairListaConversas"){
							
							chrome.tabs.sendMessage(whats_Tab, {action_: "ExtrairListaConversas"})

						}else if(execute == "cancelSelfAnswer"){
							
							chrome.tabs.sendMessage(whats_Tab, {action_: "cancelSelfAnswer"})
							
						}else if(execute == "openTabWhats"){
							
							openNewTab(url_Whats)
							
						}else if(execute == "openTabGerarLinkAPI"){
							
							openNewTab(chrome.extension.getURL('GeradorLinkWhatsAPI.html'))

						}else if(execute == "openDisparador"){
							
							openNewTab(chrome.extension.getURL('DisparadorWhatsApp.html'))
	
						}
						
						
						break;
					}
				}
			}else{//senão encontrar abra			
				chrome.tabs.create({url: url_Whats})					
			}
		});
	}
}

function openNewTab(openUrl){
	
	chrome.tabs.getAllInWindow(function(e){
		if(JSON.stringify(e).indexOf(openUrl) != -1){
			for(var t,o = 0; t = e[o]; o++){
				if(t.url.indexOf(openUrl) == 0 ){
					
					chrome.tabs.update(t.id,{selected:!0})
					break;
					
				}
			}
		}else{		
			chrome.tabs.create({url: openUrl})		
		}
	});
	
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





