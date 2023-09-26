
//########################## Suebersson Montalvão ##########################################
//########################## Atualizado em 26/09/2023 ######################################
//Versão do WhatsApp 2.2340.16

// Referências:
// https://gist.github.com/phpRajat/a6422922efae32914f4dbd1082f3f412
// https://raw.githubusercontent.com/smashah/sulla/master/src/lib/wapi.js
// https://github.com/orkestral/venom/blob/master/src/lib/wapi/store/store-objects.js
// https://github.com/wppconnect-team/WPP4Delphi/blob/main/Source/JS/js.abr


if (!window.Store) {
	(function () {
		function getStore(modules) {
			let foundCount = 0;
			let neededObjects = [
				{ id: 'Store', conditions: (module) => module.default && module.default.Chat && module.default.Msg ? module.default : null},
				{ id: 'MediaCollection', conditions: (module) => module.default && module.default.prototype && (module.default.prototype.processFiles !== undefined || module.default.prototype.processAttachments !== undefined) ? module.default : null},
//nãoLocalizado { id: 'ChatClass', conditions: (module) => module.default && module.default.prototype && module.default.prototype.Collection !== undefined && module.default.prototype.Collection === "Chat" ? module : null},
				{ id: 'MediaProcess', conditions: (module) => module.BLOB ? module : null},
				{ id: 'Archive', conditions: (module) => module.setArchive ? module : null},
                { id: 'BlockList', conditions: (module) => module.getBlocklist ? module : null},
                { id: 'BlockContact', conditions: (module) => module.blockContact && module.unblockContact ? module : null},
				{ id: 'CreateGroup', conditions: (module) => module.createGroup ? module : null},
//nãoLocalizado	{ id: 'ServiceWorker', conditions: (module) => module.default && module.default.killServiceWorker ? module : null},
				{ id: 'Stream', conditions: (module) => module.Stream && module.StreamInfo ? module : null},
				{ id: 'Presence', conditions: (module) => module.setPresenceAvailable && module.setPresenceUnavailable ? module : null},
				//{ id: 'WapQuery', conditions: (module) => module.default && module.default.queryExist ? module.default : null},
				//{ id: "WapQuery", conditions: (module) => module.queryExist ? module : ((module.default && module.default.queryExist) ? module.default : null)},
				{id: 'WapQuery', conditions: (module) => module.queryExist ?  module : null},  
//nãoLocalizado { id: 'CryptoLib', conditions: (module) => module.decryptE2EMedia ? module : null},
				{ id: 'Perfil', conditions: (module) => module.__esModule === true && module.setPushname && !module.getComposeContents ? module : null},
				{ id: 'UserConstructor', conditions: (module) => module.default && module.default.prototype && module.default.prototype.isServer && module.default.prototype.isUser ? module.default : null},
				{ id: 'SendTextMsgToChat', conditions: (module) => module.sendTextMsgToChat ? module.sendTextMsgToChat : null},
//nãoLocalizado { id: 'SendMsgToChat', conditions: (module) => module.sendMsgToChat ? module.sendMsgToChat : null},
				{ id: 'SendSeen', conditions: (module) => module.sendSeen ? module : null},
				{ id: 'SendConversationSeen', conditions: (module) => module.sendConversationSeen ? module : null},
				{ id: 'SendDelete', conditions: (module) => module.sendDelete ? module.sendDelete : null},
				{ id: 'SendDeleteMsgs', conditions: (module) => module.sendDeleteMsgs ? module.sendDeleteMsgs : null},
				{ id: 'SendConversationDelete', conditions: (module) => module.sendConversationDelete ? module : null},
//nãoLocalizado { id: 'AboutWhatsApp', conditions: (module) => module.default && module.default.VERSION_STR ? module : null},
				{ id: 'AddAndSendMsgToChat', conditions: (module) => module.addAndSendMsgToChat ? module.addAndSendMsgToChat : null},
                { id: 'Catalog', conditions: (module) => module.createCatalog && module.queryCatalog ? module : null},
//nãoLocalizado	{ id: 'BinaryProtocol', conditions: (module) => module.default && module.default.toString && module.default.toString().includes('bp_unknown_version') ? module.default : null},
				{ id: 'MsgKey', conditions: (module) => module.default && module.default.toString && module.default.toString().includes('MsgKey error: obj is null/undefined') ? module.default : null},
//nãoLocalizado { id: 'Parser', conditions: (module) => module.convertToTextWithoutSpecialEmojis ? module.default : null},
//nãoLocalizado { id: 'Builders', conditions: (module) => module.TemplateMessage && module.HydratedFourRowTemplate ? module : null},
				{ id: 'Me', conditions: (module) => module.Conn && module.ConnImpl ? module : null}, //module.PLATFORMS
//nãoLocalizado { id: 'Identity', conditions: (module) => module.queryIdentity && module.updateIdentity ? module : null},
                { id: 'MyStatus', conditions: (module) => module.getStatus && module.setMyStatus ? module : null},
				{ id: 'ChatStates', conditions: (module) => module.sendChatStatePaused && module.sendChatStateRecording && module.sendChatStateComposing ? module : null},
//nãoLocalizado { id: 'Features', conditions: (module) => module.FEATURE_CHANGE_EVENT && module.features ? module : null},
//nãoLocalizado { id: 'MessageUtils', conditions: (module) => module.storeMessages && module.appendMessage ? module : null},
				{ id: 'WebMessageSpec', conditions: (module) => module.WebMessageInfoSpec && module.WebFeaturesSpec ? module : null},
//nãoLocalizado { id: 'createMessageKey', conditions: (module) => module.createMessageKey && module.createDeviceSentMessage ? module.createMessageKey : null},
                { id: 'Participants', conditions: (module) => module.addParticipants && module.removeParticipants && module.promoteParticipants && module.demoteParticipants ? module : null},
                { id: 'WidFactory', conditions: (module) => module.isWidlike && module.createWid && module.createWidFromWidLike ? module : null},
//nãoLocalizado { id: 'Base', conditions: (module) => module.setSubProtocol && module.binSend && module.actionNode ? module : null},
//nãoLocalizado { id: 'Base2', conditions: (module) => module.supportsFeatureFlags && module.parseMsgStubProto && module.binSend && module.subscribeLiveLocation ? module : null},
//nãoLocalizado { id: 'Versions', conditions: (module) => module.loadProtoVersions ? module : null},
				{ id: 'Sticker', conditions: (module) => module.default && module.default.Sticker ? module.default.Sticker : null},
//nãoLocalizado { id: 'MediaUpload', conditions: (module) => module.default && module.default.mediaUpload ? module.default : null},
                { id: 'UploadUtils', conditions: (module) => module.default && module.default.encryptAndUpload ? module.default : null},
				{ id: 'UserPrefs', conditions: (module) => module.getMaybeMeUser ? module : null},
                { id: 'Vcard', conditions: (module) => module.vcardFromContactModel ? module : null},
				{ id: 'OpenExternalLink', conditions: (module) => module.openExternalLink ? module : null},
				{ id: 'Notification', conditions: (module) => module.showCallNotification ? module : null},
				{ id: 'Initialize', conditions: (module) => module.initialize ? module : null},
				{ id: 'Cookie', conditions: (module) => module.getCookie ? module : null},
				{ id: 'NewChatFlowLoadable', conditions: (module) => module.NewChatFlowLoadable ? module : null},
				{ id: 'CreateChat', conditions: (module) => module.createChat ? module : null},
//nãoLocalizado	{ id: 'Configuration', conditions: (module) => module.Configuration ? module.Configuration : null},
				{ id: 'Theme', conditions: (module) => module.getTheme ? module : null},
//nãoLocalizado { id: 'AlertModal', conditions: (module) => module.default && module.default.openModal ? module.default : null},
				{ id: 'OpenChatFlow', conditions: (module) => module.OpenChatFlow ? module : null},
				{ id: 'AsChatJid', conditions: (module) => module.AsChatJid || module.authorAsUserJid ? module : null},
				{ id: 'APP_STATE_SYNC_COMPLETED', conditions: (module) => module.APP_STATE_SYNC_COMPLETED && module.Cmd && module.CmdImpl ? module : null},
				{ id: 'Login', conditions: (module) => module.startLogout ? module : null},
				{ id: 'PinChat', conditions: (module) => module.setPin ? module : null},
				{ id: 'Spam', conditions: (module) => module.sendNotSpam && module.sendSpamBlockClear ? module : null},
				{ id: 'CheckNumberBeta', conditions: (module) => module.queryExist && module.queryPhoneExists && module.queryWidExists ? module : null},
				{ id: 'MaybeMeUser', conditions: (module) => module.getMaybeMeUser ? module : null}
				
				//{ id: 'CheckWid', conditions: (module) => module.validateWid ? module : null}
				//{ id: 'CheckNumberBeta', conditions: (module) => module.default && typeof module.default.toString === 'function' && module.default.toString().includes('Should not reach queryExists MD') ? module.default : null}
				//{ id: 'openShopStorefront', conditions: (module) => module.openShopStorefront ? module : null},
				//{ id: 'WatchedSocketModel', conditions: (module) => module.WatchedSocketModel ? module : null},				
				//{ id: 'openSocket', conditions: (module) => module.openSocket ? module : null},				
				//{ id: 'openChatSocket', conditions: (module) => module.openChatSocket ? module : null},
				//{ id: 'WatchedSocketMD', conditions: (module) => module.WatchedSocketMD ? module : null}

			];
			
			for (let idx in modules) {
            	if ((typeof modules[idx] === "object") && (modules[idx] !== null)) {
                    neededObjects.forEach((needObj) => {
                    	if (!needObj.conditions || needObj.foundedModule)
                            return;
                    	let neededModule = needObj.conditions(modules[idx]);
                    	if (neededModule !== null) {
                            foundCount++;
                            needObj.foundedModule = neededModule;
                    	}
					});

					//################## código usado para localizar os módulo/objetos default para adicionar a Store ################
						/*if(modules[idx].default) {
							var objs = Object.keys(modules[idx].default)
							for(i in objs){
								try{
									//if(objs[i].indexOf('open') != -1 || objs[i].indexOf('Open') != -1){
									if(objs[i].indexOf('contactFindQuery') != -1 || 
									objs[i].indexOf('queryExist') != -1 ||
									objs[i].indexOf('contactFindQuery') != -1 || 
									objs[i].indexOf('getCapabilities') != -1){
									//if(typeof modules[idx].default.toString === 'function' && modules[idx].default.toString().includes('MD')){
										
										console.log(modules[idx].default)
										break
									}
									
									//console.log(modules[idx].default)
								
								} catch(e){}
								
							}
						}*/
					//########################################################################################################

					//################## código usado para localizar os módulo/objetos da Store ################
						/*var objs = Object.keys(modules[idx])
						for(i in objs){
							try{//module.ConnImpl && module.Conn
								//if(objs[i].indexOf('Conn') != -1){
								//console.log(modules[idx])
								if(
								objs[i].queryExists || 
								objs[i].queryPhoneExists || 
								module.queryExist || 
								objs[i].Phone ||
								objs[i].Exists ||
								objs[i].query ||
								objs[i].exists ||
								objs[i].exist
								
								){

									console.log(modules[idx])
									
									break
								}
							}catch(e){}
						
						}*/
					//########################################################################################################

					if (foundCount == neededObjects.length) break;
				}
            }
			
			let neededStore = neededObjects.find((needObj) => needObj.id === "Store");
			window.Store = neededStore.foundedModule ? neededStore.foundedModule : {};
			neededObjects.splice(neededObjects.indexOf(neededStore), 1);
			neededObjects.forEach((needObj) => {
				if (needObj.foundedModule) {
					//console.log(needObj.id);
					//console.log(needObj.foundedModule);
					window.Store[needObj.id] = needObj.foundedModule;
				}else{
					console.warn("O objeto '" + needObj.id + "' não foi localizado e incluído na Store");
				}
			});
			
			console.log("Versão do WhatsApp: " + getWhatsAppVersion());

			return window.Store;
	
		}

		const parasite = `parasite${Date.now()}`
        if (typeof webpackJsonp === 'function'){
			webpackJsonp([], {[parasite]: (x, y, z) => getStore(z)}, [parasite])
		}else{
			//webpackChunkbuild.push([[parasite], {}, function (o, e, t) {let modules = []; for (let idx in o.m) {modules.push(o(idx));} getStore(modules);}]); 
			webpackChunkwhatsapp_web_client.push([[parasite], {}, function (o, e, t) {let modules = []; for (let idx in o.m) {modules.push(o(idx));} getStore(modules);}]); 
		}

	})();
}

//############################# Envios diretos #########################################
function sendMessageToID(id, message){

	openChatIfThereIs(id).then((c) => {
		if(c.isChat) Store.SendTextMsgToChat(c.obj , message);
	});
	
}

function sendImageToId(id, imgBase64, legenda, fileName) {
	
	openChatIfThereIs(id).then((c) => {
		if(c.isChat) {
			processFile(c.obj, base64ImageToFile(imgBase64, fileName)).then( mc => {
				//console.log(mc.length);
				// [models] is deprecated
				mc._models[0].sendToChat(c.obj, {caption: legenda})
			});
		}
	});
	
}

async function processFile(chat, blobs) {
	
	mc = new Store.MediaCollection(chat);
	
	try{

		await mc.processAttachments([{file: blobs}, 1], 1, chat);

		return mc;

	}catch(e){

		console.warn('Erro ao tentar processar e anexar a image no chat');

		return mc;

	}
	
/*
	if (!Array.isArray(blobs)) blobs = [blobs];

	mc = new Store.MediaCollection(chat);

	// gerando erro
	await mc.processAttachments(blobs.map(blob => {return{file:blob}}), chat, 1);
	
	// [processFiles] is deprecated
	//await mc.processFiles(blobs.map(blob => {return{file:blob}}), chat, 1);

	return mc;
*/

}

function base64ImageToFile(b64Data, fileName) {
	var arr   = b64Data.split(',');
	var mime  = arr[0].match(/:(.*?);/)[1];
	var bstr  = atob(arr[1]);
	var n     = bstr.length;
	var u8arr = new Uint8Array(n);

	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new File([u8arr], fileName, {type: mime});
}

//########################## Auto responder ####################################
function SelfAnswer_sendMessageToID(id, message){

	openChatIfThereIs(id).then((c) => {
		if(c.isChat) Store.SendTextMsgToChat(c.obj , message);
	});

}

function SelfAnswer_sendImageToId(id, imgBase64, legenda, fileName) {
	
	sendImageToId(id, imgBase64, legenda, fileName);
	
}

//############################### Abrir uma conversa ######################################
async function abrir_chat(id) {

	await openChatIfThereIs(id).then((c) => {
		if(!c.isChat){
			swal("O número de telefone não possuí uma conta de WhatsApp", {
				buttons: false,
				timer: 7000,
				icon: "info",
			});
		}
	});
}

//abrir conversa/chat se ele existir
var _chat, _contact, _newId;
async function openChatIfThereIs(id) {
	
	_chat = Store.Chat.get(id);
	_contact = Store.Contact.get(id);

	if(_chat !== undefined){//verificar se já existe uma conversa iniciada com o chat no histórico de conversas
		__openChat(_chat)
		return {isChat: true, obj: _chat};

	}else{//tentar verificar inserindo ou removendo o nono digito na lista de chats
		
		_newId = id.length === 17
			? id.slice(0, 4) + '9' + id.slice(4, id.length)
			: id.slice(0, 4) + id.slice(5, id.length);
		
		_chat = Store.Chat.get(_newId);
		
		if(_chat !== undefined) {
			__openChat(_chat)	
			return {isChat: true, obj: _chat};
		}else{

			//verificar se o número do chat está salvo na lista de contatos e iniciar uma conversa
			if(_contact !== undefined){// && _contact.__x_isMyContact){
		
				return getChatAfterAddingList(id);
		
			}else{//tentar verificar inserindo ou removendo o nono digito na lista de contatos

				_newId = id.length == 17
					? id.slice(0, 4) + '9' + id.slice(4, id.length)
					: id.slice(0, 4) + id.slice(5, id.length);
					
				_contact = Store.Contact.get(_newId);
				
				if(_contact !== undefined){// && _contact.__x_isMyContact){
					return getChatAfterAddingList(_newId);
				}else{
					
					console.log('Chat não localizado no histórico de conversas e nem na lista de contatos');
					
					//verificar se números existe usando uma combinação entre das funções isWhatsAppExistBeta e isWhatsAppExist
					return await isWhatsAppExistBeta(id).then((b) => {
						if (b.isChat){
							return getChatAfterAddingList(b.id);
						}else{
							return isWhatsAppExist(id).then((e) => {
								if (e.isChat){
									return getChatAfterAddingList(e.id);
								}else{
									console.log('O endereço informado não possuí uma conta de WhatsApp')
									return {isChat: false, obj: undefined};
								}
							});
						}
					});
				
					// Versão beta
					/*return await isWhatsAppExistBeta(id).then((b) => {
						if (b.isChat){
							return getChatAfterAddingList(b.id);
						}else{
							console.log('O endereço informado não possuí uma conta de WhatsApp')
							return {isChat: false, obj: undefined};
						}
					});*/
				
					//verificar usando apenas a função isWhatsAppExist
					/*console.log('Chat não localizado no histórico de conversas e nem na lista de contatos');
					return await isWhatsAppExist(id).then((e) => {
						if (e.isChat){
							return getChatAfterAddingList(e.id);
						}else{
							console.log('O endereço informado não possuí uma conta de WhatsApp')
							return {isChat: false, obj: undefined};
						}
					})*/
				}
			}

		}
		
	}
}
	
function __openChat(__chat) {
	try{
		Store.APP_STATE_SYNC_COMPLETED.Cmd.openChatAt(__chat)
		//Store.APP_STATE_SYNC_COMPLETED.Cmd._openChat(__chat)
		//Store.APP_STATE_SYNC_COMPLETED.Cmd.openChatFromUnread(__chat)
	}catch(e){
		console.warn('O função para abrir o chat está falhando')
	}
}

function getChatAfterAddingList(_id){
	//Adicionar o chat no registro de chats
	Store.Chat.add(
		{id: new Store.UserConstructor(
			_id, 
			{intentionallyUsePrivateConstructor: true}
		)}, 
		{merge: true, add: true}
	);
	
	_chat = Store.Chat.get(_id);
	__openChat(_chat);
	
	return {isChat: true, obj: _chat};
}

function getMeUser(){
	try{
		if(Store.Me != undefined && Store.Me.Conn.__x_wid != undefined){
			return Store.Me.Conn.__x_wid
		}else{
			return Store.UserPrefs.getMeUser()
			//return Store.MaybeMeUser.getMeUser()
		}
	}catch(e){
		console.warn('Erro ao tentar obter informações sobre a conta logada')
		return undefined;
	}
}

function getWhatsAppThemeMode(){
	var theme = Store.UserPrefs.getTheme()
	return theme == null || theme == undefined
		? 'light'
		:  theme;
}

function getWhatsAppVersion(){
	//return Store.AboutWhatsApp.default.VERSION_STR
	return window.Debug.VERSION;
}

//verificar se o chat/conversa está ativo na tela passando endereço(_serialized) como String
function isChatActive(chatId){
	if(Store.Chat.get(chatId) != undefined){
		return Store.Chat.get(chatId).presence.attributes.chatActive
	}else{
		console.warn('O chat não existe no histórico de conversas')
		return false
	}
}
//verificar se o chat está online
function isChatOnline(chatId){
	if(Store.Chat.get(chatId) != undefined){
		return Store.Chat.get(chatId).presence.attributes.isOnline
	}else{
		console.warn('O chat não existe no histórico de conversas')
		return false
	}
}

//verificar se o número de whatsapp existe
//console.log(await isWhatsAppExist('5521985522525@c.us'))
async function isWhatsAppExist(chatId){
	return await Store.WapQuery.queryPhoneExists(chatId).then((result) => {
		console.log(result);
		//return result.status == 200
		return result !== null 
			? {isChat: true, id: result.wid._serialized} 
			: {isChat: false, id: undefined};
	});	
}

//verificar se o número de whatsapp existe na versão Beta do WhatsApp
async function isWhatsAppExistBeta(chatId){
	//return await Store.CheckNumberBeta.queryExists(chatId).then((result) => {
	return await Store.CheckNumberBeta.queryPhoneExists(chatId).then((result) => {
		return result !== null 
			? {isChat: true, id: result.wid._serialized} 
			: {isChat: false, id: undefined};
	});
}
