/**
 * В этом файле описаны все javascript'ы (которые используются на всех страницах компаний) для не брендированных компаний.
 */
 
$(document).ready(function(){


 /** 
   * присоедениться
   */
  $('#addCompanyMember').click(function(){
  
  	var link = $(this);
  			link.addClass('loading');
    var company_id = link.data('id');
    
    $.post('/json/corporation/fan_add/', { company_id: company_id }, function(json){
      
      if(json.messages =='ok'){
        $('#removeCompanyMember').removeClass('hidden');
        $('#addCompanyMember').addClass('hidden'); 
        $('#members_count').html(json.fans_count_str);	
      }else{
        show_system_error(json);
      }
      
      link.removeClass('loading');
      
    },'json');
    return false;
  });
  
  // покинуть
  $('#removeCompanyMember').click(function(){
  
    var link = $(this);
  			link.addClass('loading');
	  var company_id = link.data('id');
      $.post('/json/corporation/fan_del/', { company_id: company_id }, function(json){
        if(json.messages =='ok'){
          $('#removeCompanyMember').addClass('hidden');
          $('#addCompanyMember').removeClass('hidden');  
          $('#members_count').html(json.fans_count_str);	      
        }else{
          show_system_error(json);
        }
      	link.removeClass('loading');
      },'json');

    return false;
  });



  
  // кнопки "работаю/не работаю в компании".
  $('#i_work_in_company').click(function(){
  
    var checkbox = $(this);
    var company_id = $(this).data('id');
    var companyWorkersCount = $('#js-companyWorkersCount');
    var companyWorkersList = $('#js-companyWorkersList');
    
    if(!checkbox.attr('checked')){
    
      // если компания не нравится
      $.post('/json/corporation/worker_del/',{ company_id: company_id }, function(json){
        if(json.messages == 'ok'){
          checkbox.attr('title','Я работаю в этой компании');
          $.jGrowl('Вы не работаете в этой компании');
          // нужно обновить (-1) счетчик и убрать юзера из списка        
          companyWorkersCount.text(parseInt(companyWorkersCount.text())-1);
          //companyWorkersList
          $('.you',companyWorkersList).remove();
        }else{
          show_system_error(json);
        }
      }, 'json');
      
    }else{
    
      // если компания нравится
      $.post('/json/corporation/worker_add/',{ company_id: company_id }, function(json){
        if(json.messages == 'ok'){
          checkbox.attr('title','Уволиться из компании');
          $.jGrowl('Вы работаете в этой компании');
          // нужно обновить (+1) счетчик и добавить юзера в список
          companyWorkersCount.text(parseInt(companyWorkersCount.text())+1);
          companyWorkersList.append('<li><a href="http://'+g_user_login+'.'+g_base_url+'/" class="you">'+g_user_login+'</a></li>');
        }else{
          show_system_error(json);
        }
      }, 'json');
    }

  });

})