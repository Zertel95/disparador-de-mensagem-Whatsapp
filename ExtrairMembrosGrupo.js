// ########################## Atualizado em 09/03/2022 ######################################################################
// Versão do WhatsApp: 2.2208.7

var ListaContatos = new Array(), Nacional, num, chatActive, meUser, chats;

function ExtrairMembrosGrupo(){

	console.clear();

	if (window.Store){
		
		//filtrar apenas os chats que é um grupo, filtrar e me retornar apenas o que está ativo 
		checkChat = Store.Chat.filter((g) => g.__x_isGroup === true).filter((f) => f.__x_active === true);
		
		if(checkChat.length === 1 ){
			
			chatActive = checkChat[0];
			
			console.log('Chat_nome: ' + chatActive.__x_formattedTitle);
			console.log('Chat_server: ' + chatActive.__x_id.server);
			console.log('Chat_user: ' + chatActive.__x_id.user);
			console.log('Chat_Id: ' + chatActive.__x_id._serialized);
			
			chats = chatActive.__x_groupMetadata.participants._models;
			
			console.log('Total de participantes: ' + chats.length);
			
			if(chats.length > 2){
				
				//if (confirm("Deseja capturar apenas números nacionais?") == true){Nacional = 1;}else{Nacional = 0;}
				
				//https://sweetalert.js.org/
				swal("Deseja capturar apenas números nacionais?", {
					buttons: {
						Yes: "Sim",
						No: "Não"
					},
				}).then((value) => {
					
					value === 'yes' ? Nacional = 1 : Nacional = 0;
					get_members();
					
				});
			
			}else{
				alert('Nesse grupo não à participantes suficiente para extrair os contatos')
			}
		}else{
			alert("O Chat selecionado não é um grupo")
		}
	}else{
		console.warn('É necessário fazer manutenção no código fonte. "Store" não definida')
	}

}

function get_members(){
	
	var meUser = getMeUser().user;
	var _j = 0;
	
	for (q = 0; q < chats.length; q++){
		
		if(meUser != chats[q].__x_id.user || meUser == undefined){
			//console.log(chats[q].__x_id.user);
			num = chats[q].__x_id.user
			
			if(Nacional == 1){
				if(num.slice(0, 2) == "55"){//remover o código 55
					ListaContatos[_j] = num.slice(2, num.length)
					_j++
				}
			}else{//Capturar todos os números, nacionais e internacionais
			
				if(num.slice(0, 2) == "55"){//remover o código 55
					ListaContatos[_j] = num.slice(2, num.length)
					_j++
				}else{
					ListaContatos[_j] = num
					_j++
				}
				
			}
		}
	}
	
	var fileNameToSaveAs = prompt('Digite ou verifique o nome do grupo (Excluindo emojis):', chatActive.__x_formattedTitle) + '.txt'; //Nome do txt

	if(fileNameToSaveAs != '' && fileNameToSaveAs != 'null.txt'){

		printTxt(ListaContatos, fileNameToSaveAs)
		ListaContatos = new Array()
	
	}else{
		alert("Nome do arquivo não inserido")
	}

}
