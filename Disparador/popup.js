
document['getElementById']('checkImaWhats').addEventListener("click", enableIma);

document['getElementById']('WhatsApp_Web').addEventListener("click", openTabWhats);

document['getElementById']('GerarLink_API').addEventListener("click", openTabGerarLinkAPI);

document['getElementById']('Disparador').addEventListener("click", openDisparador);

document['getElementById']('abrir_chat').addEventListener("click", iniciarChat);

document['getElementById']('ExtrairListaContatos').addEventListener("click", ExtrairListaContatos);

document['getElementById']('ExtrairMembrosGrupo').addEventListener("click", ExtrairMembrosGrupo);

document['getElementById']('ExtrairListaConversas').addEventListener("click", ExtrairListaConversas);

document['getElementById']('filterNumbers').addEventListener("click", filterNumbers);

document['getElementById']('chatsToFilter').addEventListener("change", chatsToFilter);

document['getElementById']('gerarCombinacoes').addEventListener("click", gerarCombinacoes);

document['getElementById']('cancelSelfAnswer').addEventListener("click", cancelSelfAnswer);

document['getElementById']('setPermission').addEventListener("click", setPermission);

document['getElementById']('inviteToActivation').addEventListener("click", inviteToActivation);


var Background = chrome.extension.getBackgroundPage()
var x = document.querySelectorAll(".recurso")

chrome.storage.local.get(['statusApp'], function(result){
	
	if(result.statusApp != undefined){
		
		if(result.statusApp.activation == "Ativado"){
			
			//botão de ativação
			if(document['getElementById']('inviteToActivation').disabled == false)
				document['getElementById']('inviteToActivation').disabled = true
			
			//chave liga/desliga imã API
			if(Background.run_ImaUrl == true) document['getElementById']('checkImaWhats').checked = true
	
		}else{
		
			for (var i = 0; i < x.length; i++) {
				x[i].disabled = true
			}
		
		}
		
	}else{

		for (var i = 0; i < x.length; i++) {
			x[i].disabled = true
		}

	}
	
});

function setPermission(){
//https://developer.chrome.com/apps/match_patterns
//https://developer.chrome.com/apps/permission_warnings
//https://developer.chrome.com/extensions/permissions#method-request
	
	chrome.tabs.getSelected(function(tab){
		chrome.permissions.request({
			permissions: ['tabs'],
			origins: [tab.url]
		}, function(Allowed) {
			if (Allowed){//permissão concedida
				if (tab.url.indexOf("file:///") == 0) {
					alert('Permissão concedida. Após você recarregar a página ela estará pronta para enviar parâmentros para o WhatsApp Web')
					close()
				}else{
					//close()
				}
			}else{}//não concedida, não faça nada
			
		});
	});

}

function openTabWhats(){
	
	Background.selectTabWhats("openTabWhats")

}

function openTabGerarLinkAPI(){
	
	Background.selectTabWhats("openTabGerarLinkAPI")
	
}

function openDisparador(){
	
	Background.selectTabWhats("openDisparador")
	
}

function iniciarChat(){

	Background.selectTabWhats("iniciarChat")

}

function ExtrairMembrosGrupo(){
	
	Background.selectTabWhats("ExtrairMembrosGrupo")
	
}

function ExtrairListaContatos(){
	
	Background.selectTabWhats("ExtrairListaContatos")
	
}

function ExtrairListaConversas(){
	
	Background.selectTabWhats("ExtrairListaConversas")
	
}

function cancelSelfAnswer(){
	
	Background.selectTabWhats("cancelSelfAnswer")
	
}

function filterNumbers(){
	
	document['getElementById']('chatsToFilter').click()
	
}

function chatsToFilter(event) {
	
	var input = event.target;
	var reader = new FileReader();

	reader.onload = function(){
		var Text_txt = reader.result;
		//console.log(Text_txt);
		
		var NumToFilter = new Array()
		var ddi = prompt("Código do país dos números:", "55")
		
		var y = Text_txt.split(decodeURIComponent("%0A")).length;
		
		if(Text_txt != "" && y == 1){
			
			NumToFilter[0] = Background.LimparNumero(ddi + Text_txt)

		}else if (Text_txt != "" && y > 1){
			
			for (a = 0; a < y; a++){	
				
				var id = Background.LimparNumero(ddi + Text_txt.split(decodeURIComponent("%0A"), y)[a])
				
				if (id.length > 10){
					//console.log(id);
					NumToFilter[a] = id;
				
				}
			}
			
			//Remover duplicatas
			NumToFilter = NumToFilter.filter(function(este,z){return NumToFilter.indexOf(este) == z;})
			
		}
		
		var msg = {
			action_: 'filterNumbers',
			NumToFilter: NumToFilter,
			ddi: ddi
		} 
		
		chrome.tabs.sendMessage(Background.whats_Tab, msg);
		try{close()}catch(e){}

	};
	
	try{
		reader.readAsText(input.files[0], "UTF-8");
	}catch(e){}
	
}

function inviteToActivation(){
	
	Background.inviteToActivation()
	close()
	
}

function enableIma(){
	
	if(document['getElementById']('checkImaWhats').checked == true){

		Background.run_ImaUrl = true
		
	}else{

		Background.run_ImaUrl = false

	}

}

var combinacoes, numBase;
function gerarCombinacoes(){
	
	numBase = Background.LimparNumero(prompt("Insira o número nesse formato: DDD + número"))
	combinacoes = new Array();
	
	if(numBase != null){

		if (numBase.length >= 10 && numBase.length <= 11 && !isNaN(parseFloat(numBase)) && isFinite(numBase) == true){
			
			numBase = numBase.slice(0, (numBase.length - 4))
			//console.log(numBase)
			
			for (a = 0; a < 10000; a++){	
			
				if(a <= 9){
					combinacoes[a] = numBase + "000" + a 
				}else if(a <= 99){
					combinacoes[a] = numBase + "00" + a 
				}else if(a <= 999){
					combinacoes[a] = numBase + "0" + a 
				}else{
					combinacoes[a] = numBase + a 
				}
				
			}

			//console.log(combinacoes)
			gerarTxt(combinacoes, 'Números da sequência ' + numBase + '.txt')
			
		}else{
			alert("Insira uma sequência numérica valida")
		}
		
	}
	
};

function gerarTxt(dados, fileName_){
	
	setTimeout(function(){

		var TextoBruto = combinacoes;
		var TextoPronto = '';	
		for ( x = 0; x < TextoBruto.length; x++){TextoPronto = TextoPronto + TextoBruto[x] + "\r\n";}
		
		var textFileAsBlob = new Blob([TextoPronto], {type:'text/plain'});
		
		var downloadLink = document.createElement("a");
		downloadLink.download = fileName_;
		downloadLink.innerHTML = "Download File";
		
		if (window.webkitURL != null){		
			downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);	
		}else{		
			downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
			downloadLink.onclick = destroyClickedElement;
			downloadLink.style.display = "none";
			document.body.appendChild(downloadLink);
		}

		downloadLink.click();	
		close()
	},2000)
	
}


