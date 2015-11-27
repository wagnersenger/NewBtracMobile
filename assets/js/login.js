
$(document).ready(function(){
	$('#btnConectar').on('click', function(){
		if( $('#LOGIN').val().trim() != '' && $('#SENHA').val().trim() != '' ){
			abrirCarregando('Verificando Login');
			
			$.post( _HOST+'/control/validaLogin.php'
				  , $('#frmLogin').serialize()
				  , function(data){

				  		v_obj = JSON.parse(data);
				  		
				  	    if(v_obj.error == true){
				  	    	$('.lb_error').css('display','block');
				  	    	$('.lb_error').html(v_obj.system_message);
				  	    	fecharCarregando();
				  	    }else{
				  	    	localStorage.setItem('BTRAC_LOGIN',v_obj.usuario);
				  	    	localStorage.setItem('BTRAC_SENHA',$('#SENHA').val());
				  	    	localStorage.setItem('BTRAC_NOME',v_obj.nome);
				  	    	localStorage.setItem('BTRAC_EMPRESA_ID',v_obj.empresa_id );
				  	    	localStorage.setItem('BTRAC_APELIDO', v_obj.apelido );
				  	    	localStorage.setItem('BTRAC_EMAIL', v_obj.email );
				  	    	localStorage.setItem('BTRAC_TIPO', v_obj.tipo );

				  	    	fecharCarregando();
				  	    	window.location = 'home.html';
				  	    }
				    }
				  );

		}

	});	
});
