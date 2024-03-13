
var class_Name, labelName_SearchField, label_Name;

labelName_SearchField = [
	'Pesquisar ou começar uma nova conversa',
	'Buscar o empezar un chat nuevo',
	'Search or start new chat'
];

Atualizar_Status();
setInterval(Atualizar_Status, 120000);

function Atualizar_Status(){
	
	if (window.Store){

		if (class_Name === undefined){
			for (q = 0; q < document.querySelectorAll("div").length; q++){
				
				if (labelName_SearchField.indexOf(document['getElementsByTagName']('div')[q]['innerHTML']) != -1){
					
					label_Name = document['getElementsByTagName']('div')[q]['innerHTML'];
					class_Name = document['getElementsByTagName']('div')[q].className;
					
					document['getElementsByClassName'](class_Name)[0]['innerHTML'] = getLabelBattery();
					break;
				}
			}
		}else{
			if (document['getElementsByClassName'](class_Name)[0]){
				document['getElementsByClassName'](class_Name)[0]['innerHTML'] = getLabelBattery();
			}
		}
		
	}else{
		console.log('É necessário fazer manutenção no código fonte. "Store" não definida');
	}
	
}

function getLabelBattery(){
	var _battery = undefined;
	
	try{
		if(Store.Me.Conn.battery != undefined) _battery = Store.Me.Conn.battery;
	}catch(e){
		console.warn('Erro ao tentar ler o status da bateria')
	}
	
	return _battery != undefined 
		? 'Status da Bateria: ' + _battery + '%'
		: label_Name
		//: 'Extensão sincronizada na versão beta'
	//console.log('Status da Bateria: ' + _battery + '%')
}
