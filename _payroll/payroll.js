


// sanitize allowed domains
altDomains = altDomains.replace(/ /g,"");  // remove spaces
altDomains = altDomains.replace(/;/g,",");  // remove spaces
altdomains = altDomains.toLowerCase();
let domains = altDomains.split(',');

var pdfParams = '1'; 

function _suggestEmail(){

  email = employee_email.toLowerCase() ;

  if ( _isValidDomain(email) ){
    let e = getById("send_to_email");
    if (e) e.value = email;
  }

}

function _isValidDomain( email )
{

  if (domains.length == 0) return true;  // no domain setting

  let ret = false;

  for(let i = 0; i < domains.length; i++){
    if ( email.indexOf( domains[i]) > -1 ){
      
      let e = getById("send_to_email");
      if ( e){
        e.value = email;
        ret = true;
        break;
      }
    } 
  } 
  return ret;
}

function _err_msg( msg ){

  let lbl = getById("err_msg");
  lbl.style.display = '';
  lbl.innerHTML = msg;
  setTimeout(function(){ lbl.style.display='none'; }, 5000); 

}

function email_ajax(params){

  let email = employee_email;   // actual employee email

  if ( isSendToAltEmail == "1" ){

    email = getById("send_to_email").value;  // input email
  
    if ( ! isEmailValid(email) ){
      _err_msg("Please input valid email address.");
      return;
    }

    // check domain
    if ( ! _isValidDomain(email) ){
      _err_msg("Email address domain is invalid.");
      return;
    }

  }
    
  xxhr("GET", "_payroll/pdf_print.php?pd="+params +"&ea="+email,
    function(msg){
      alert(msg);
    });

  alert('Please wait for a moment while sending an email to your email account.');  

}


function generatePayroll(){

    busy.show2()  ;

    var posts = [];
    posts['ds'] = get('#cutoff_nav_start').value,
    posts['de'] = get('#cutoff_nav_end').value;

    var e = get("select[name='team_emp']");
    if ( e )
        posts['tmm'] = e.value;
        
    // pass requirement
    e = get("#cutoff_nav_user_pass");  
    if ( e ){
        let p = e.value;
        if ( ! p ) p = "none";
        posts['rp'] = p;
    }

    posts['debug'] = 1;
    console.log( posts);

    xxhrPost("_payroll/payroll_ajax.php?"+ _session_vars, posts, 
    function( res ){
      
        let data = JSON.parse(res);

        pdfParams = data.pdfParams;

        //console.log( data);
        // history
        var e = get("#payroll_section");
        if (e)
            e.innerHTML = data.html;
        
        // buttons
        e = get("#payroll_buttons");
        if ( data.btn ){
            e.classList.remove("d-none");
        }else{
            e.classList.add("d-none");
        }

        // pass
        e = get("#cutoff_nav_user_pass");  
        if ( e ) e.value = "";        

        busy.hide();

        console.log(data);

    });
}

function previewPDFpayslip(){
    
    window.open( PAYROLLWEB_URI + "/_payroll/pdf_print.php?pd="+ pdfParams, "_blank"); 

}


