
var DateToday = undefined, getKeys = new Array(), getKeysUseded = new Array(), date_today;

function get_Keys(){
	
	alert("Aguarde alguns segundos até que seja solicitado a chave de ativação")
	
	DateToday = undefined, getKeys = new Array(); getKeysUseded = new Array();
	
	//Ler Json usando AJAX
	var xmlhttp1 = new XMLHttpRequest();
	xmlhttp1.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var Obj_Json = JSON.parse(this.responseText);
			//console.log(Obj_Json.Keys.length);
			//console.log(Obj_Json.Keys[0]);
			getKeys = Obj_Json.Keys
			get_KeysUseded()
		}
	};
	xmlhttp1.open("GET", "https://raw.githubusercontent.com/Zertel95/disparador/main/Keys.json", true);
	xmlhttp1.send();

}


function get_KeysUseded(){
	
	var xmlhttp2 = new XMLHttpRequest();
	xmlhttp2.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			//console.log(this.responseText);
			
			var exp_toKeys = />Key:\s\w*\</g;
			var textHTML = this.responseText;

			if (exp_toKeys.test(textHTML) == true){
				//console.log(String(exp_toKeys.exec(textHTML)).replace(">Key: ", "").replace("<", ""));

				var arrayKey = textHTML.match(exp_toKeys);
				
				for (a = 0; a < arrayKey.length; a++){	
					//console.log(arrayKey[a].replace(">Key: ", "").replace("<", ""));
					getKeysUseded[a] = arrayKey[a].replace(">Key: ", "").replace("<", "");
				}
				
				startAtivation()
				
			}else{
				
				startAtivation()

			}
		}
	};
	xmlhttp2.open("GET", "https://docs.google.com/spreadsheets/d/e/2PACX-1vTP8JC_y3t7EAtBMMjLaY7SD-0gMAMnnqH7v5bwMIg-0U8Czc3IxHAzHZ5wiRnVfIWn5MFMN83NAjSP/pubhtml", true);
	xmlhttp2.send();
	
}


function startAtivation(){
	
	get_Date()
	
	var ActiveExtension = setInterval(function() {
		if (DateToday != undefined) {		
			clearInterval(ActiveExtension);
			Active_extension()
		}
	}, 3000);
	
}


function get_Date(){
	
	var xmlhttp3 = new XMLHttpRequest();
	
	xmlhttp3.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			//console.log(this.responseText);
			
			var exp_toDate = /id="dia-topo">\w*\-feira\,\s\d{1,2}\b de \w*\b de \d{4}\<|\w*\,\s\d{1,2}\b de \w*\b de \d{4}\</;
			var textHTML = this.responseText.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

			if (exp_toDate.test(textHTML) == true){
				
				var data_ = String(exp_toDate.exec(textHTML)).replace('id="dia-topo">', '').replace('<', '').replace(',', '');
				var x = data_.split(" ").length;
				
				var data = {						
					diaSemana: data_.split(" ", x)[0],
					diaMes: data_.split(" ", x)[1],
					mes: getMes_num(data_.split(" ", x)[3]), 
					ano: data_.split(" ", x)[5]					
				}
				
				date_today = data.diaMes + "/" + data.mes + "/" + data.ano;
				//alert(date_today)
				/*
				console.log(data_);
				console.log('Dia da semana: ' + data.diaSemana);
				console.log('Dia do mês: ' + data.diaMes);
				console.log('Mês: ' + data.mes);
				console.log('Ano: ' + data.ano);
				console.log(date_today)
				*/
				
				DateToday = new Date(date_today.split("/").reverse().join("/"))

			}

		}
	};
	xmlhttp3.open("GET", "https://www.horariodebrasilia.org/", true);
	xmlhttp3.send();

}


function send_keyUseded(textKey){

	//Registrar chave no Google formulários
	var http = new XMLHttpRequest();
	var url = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLScH2QDFMn3ArqpQBsSLngU5fblXQodZSkyleqi9lPB-bhwFfg/formResponse';
	var params = 'entry.926375620=' + 'Key: ' + textKey;
	http.open('POST', url, true);
	http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	http.send(params);

}


function getMes_num(mes){
	var month = ["", "janeiro", "fevereiro", "marco", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
	//console.log(month.indexOf(mes.toLowerCase())); 
	return month.indexOf(mes.toLowerCase())
}
	
	
function get_periodo(dias){
	var data = new Date(DateToday.setDate(DateToday.getDate() + parseInt(dias)));
	var data_text = data.getDate() + "/" + (data.getMonth() + 1) + "/" + data.getFullYear();
	return data_text
}


