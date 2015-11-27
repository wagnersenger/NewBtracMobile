/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
 var intervalFechamento;
 
 if(commomInterval)
 	clearInterval(commomInterval);
	
 var commomInterval = null;
 
function abrirCarregando(v_texto){
    document.getElementById('carregando').style.display = 'block';
    document.getElementById('carregando_centro').style.display = 'block';
    document.getElementById('carregando_item').innerHTML = v_texto ? v_texto : 'Carregando';

    intervalFechamento = setTimeout(fecharCarregando, 15000);
    
}

function fecharCarregando(){
	document.getElementById('carregando').style.display = 'none';
    document.getElementById('carregando_centro').style.display = 'none';

    clearInterval(intervalFechamento);
}