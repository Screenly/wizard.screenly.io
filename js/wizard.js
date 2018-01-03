function validateIPaddress(ipaddress) {
  if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
    return (true);
  }
  return (false);
}

function validateFQDN(fqdn)
{
  if (/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/.test(fqdn)) {
    return (true);
  }  return (false);

}

function validateNetmask(netmask)
{
  if (/^(254|252|248|240|224|192|128)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(254|252|248|240|224|192|128|0)$/.test(netmask)) {
    return (true);
  }
  return (false);
}


function saveFile(filename, data) {
  var blob = new Blob([data], {type: 'text/csv'});
  if(window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(blob, filename);
  }
  else{
    var elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(blob);
    elem.download = filename;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
  }
}

$('input[id=screenlyv1]').prop('checked', 'checked');
$('#wifi-fields').hide();
$('#wired-fields').hide();
$('#dns-fields').hide();
$('#ntp-fields').hide();
$('#common_errors').hide();
$('#wifi-no-dhcp-fields').hide();
$('#wired-no-dhcp-fields').hide();
$('input[name=wifidhcp]').prop('checked', 'checked');
$('input[name=wireddhcp]').prop('checked', 'checked');

$('input[name=wifi]').change(function() {
  if($(this).is(':checked'))
  {
    console.log("wifi");
    $('#wifi-fields').show();
  }
  else {
    $('#wifi-fields').hide();
  }
});


$('input[name=wifidhcp]').change(function() {
  if($(this).is(':checked'))
  {
    console.log("wifidhcp");
    $('#wifi-no-dhcp-fields').hide();
  }
  else {
    $('#wifi-no-dhcp-fields').show();
  }
});

$('input[name=wireddhcp]').change(function() {
  if($(this).is(':checked'))
  {
    console.log("wireddhcp");
    $('#wired-no-dhcp-fields').hide();
  }
  else {
    $('#wired-no-dhcp-fields').show();
  }
});

$('input[name=wired]').change(function() {
  if($(this).is(':checked'))
  {
    console.log("wired");
    $('#wired-fields').show();
  }
  else {
    $('#wired-fields').hide();
  }
});
$('input[name=ntp]').change(function() {
  if($(this).is(':checked'))
  {
    console.log("ntp");
    $('#ntp-fields').show();
  }
  else {
    $('#ntp-fields').hide();
  }
});
$('input[name=dns]').change(function() {
  if($(this).is(':checked'))
  {
    console.log("dns");
    $('#dns-fields').show();
  }
  else {
    $('#dns-fields').hide();
  }
});

$('#ntp-addbutton').click(function() {
  var scntDiv = $('#p_scents1');
  var i = 2;

  if($('#p_scents1 .add-ntp-server') != undefined)
  i = $('#p_scents1 .add-ntp-server').length + 2;
  $('<div class="form-group add-ntp-server" id="row_ntp_server_' + i +'"><label for="ntp_server_' + i +'" class="control-label col-xs-3">Server ' + i +'</label><div class="col-xs-6"><input type="text" class="form-control" id="ntp_server_' + i +'" name="ntp_server_' + i +'"></div><span class="remove-button glyphicon glyphicon-minus-sign" id="ntp_remove_server_' + i +'"></span></div></div>').appendTo(scntDiv);
  $('#ntp_remove_server_' + i).click(function() {
    $('#row_ntp_server_'+ i).remove();
    return false;
  });
  return false;
});

$('#dns-addbutton').click(function() {
  var scntDiv = $('#p_scents2');
  var i = 2;

  if($('#p_scents2 .add-dns-server') != undefined)
  i = $('#p_scents2 .add-dns-server').length + 2;
  $('<div class="form-group add-dns-server" id="row_dns_server_' + i +'"><label for="dns_server_' + i +'" class="control-label col-xs-3">Server ' + i +'</label><div class="col-xs-6"><input type="text" class="form-control" id="dns_server_' + i +'" name="dns_server_' + i +'"></div><span class="remove-button glyphicon glyphicon-minus-sign" id="dns_remove_server_' + i +'"></span></div></div>').appendTo(scntDiv);
  $('#dns_remove_server_' + i).click(function() {
    $('#row_dns_server_'+ i).remove();
    return false;
  });
  return false;
});


$('#generateconfig').click(function()
{
  $('.form-group').removeClass('has-error');
  $('.help-block').remove();
  $('#common_errors').hide();

  var validation_errors = [];

  var configStr = "";;
  if($('#wifi').is(":checked") == false && $('#wired').is(":checked") == false)
  {
    validation_errors.push({'key':'common_error' , 'message': 'You must configure either a WiFi or wired interface.'});
  }

  if($('#wifi').is(":checked") == true)
  {
    if($('#ssid').val() == "")
    {
      validation_errors.push({'key': 'ssid' , 'message':'SSID is required'});

    }

    configStr = configStr + "[wlan0]";
    configStr = configStr + "\r\n";
    configStr = configStr + "ssid=" + $('#ssid').val() + "\r\n";
    if($('#passphrase').val() != "")
    configStr = configStr + "passphrase=" + $('#passphrase').val() + "\r\n";
    if($('#wifidhcp').is(":checked") == true)
    {
      configStr = configStr + "mode=dhcp" + "\r\n";
    }
    else {
      if(!validateIPaddress($('#wifiip').val()))
      {
        validation_errors.push({'key': 'wifiip' ,'message' : 'You have entered an invalid IP address.'});
      }
      if(!validateIPaddress($('#wifigateway').val()))
      {
        validation_errors.push({'key': 'wifigateway' ,'message' : 'You have entered an invalid IP address.'});
      }
      if(!validateNetmask($('#wifinetmask').val()))
      {
        validation_errors.push({'key': 'wifinetmask' ,'message' : 'You have entered an invalid netmask.'});
      }
      configStr = configStr + "ip=" + $('#wifiip').val() + "\r\n";
      configStr = configStr + "netmask=" + $('#wifinetmask').val() + "\r\n";
      configStr = configStr + "gateway=" + $('#wifigateway').val() + "\r\n";
    }

    if($('#hiddenssid').is(":checked") == true)
    {
      configStr = configStr + "hidden_ssid=true" + "\r\n";
    }
    configStr = configStr + "\r\n";
  }

  if($('#wired').is(":checked") == true)
  {
    configStr = configStr + "[eth0]";
    configStr = configStr + "\r\n";
    if($('#wireddhcp').is(":checked") == true)
    {
      configStr = configStr + "mode=dhcp" + "\r\n";
    }
    else {
      if(!validateIPaddress($('#wiredip').val()))
      {
        validation_errors.push({'key': 'wiredip' ,'message' : 'You have entered an invalid IP address.'});
      }
      if(!validateIPaddress($('#wiredgateway').val()))
      {
        validation_errors.push({'key': 'wiredgateway' ,'message' : 'You have entered an invalid IP address.'});
      }
      if(!validateNetmask($('#wirednetmask').val()))
      {
        validation_errors.push({'key': 'wirednetmask' ,'message' : 'You have entered an invalid netmask.'});
      }
      configStr = configStr + "ip=" + $('#wiredip').val() + "\r\n";
      configStr = configStr + "netmask=" + $('#wirednetmask').val() + "\r\n";
      configStr = configStr + "gateway=" + $('#wiredgateway').val() + "\r\n";
    }
  }

  if($('#ntp').is(":checked") == true || $('#dns').is(":checked") == true)
  {
    configStr = configStr + "\r\n";
    configStr = configStr + "[generic]";
    configStr = configStr + "\r\n";
  }

  if($('#ntp').is(":checked") == true)
  {
    configStr = configStr + "ntp=";
    for(var i = 0; i < $('[id^="ntp_server_"]').length; i++)
    {
      var ntpid = "ntp_server_" + (i+1);
      var itm = $('[id^="ntp_server_"]')[i];
      if(validateIPaddress(itm.value) || validateFQDN(itm.value) )
      {
        if(i > 0)
        {
          configStr = configStr + ",";
        }
        configStr = configStr + itm.value;
      }
      else {
        validation_errors.push({ "key": ntpid, 'message': 'You have entered an invalid IP address/FQDN' });
      }

    }
    configStr = configStr + "\r\n";
  }



  if($('#dns').is(":checked") == true)
  {
    configStr = configStr + "dns=";

    for(var i = 0; i < $('[id^="dns_server_"]').length; i++)
    {
      var itm = $('[id^="dns_server_"]')[i];
      var dnsid = "dns_server_" + (i+1);
      if(!validateIPaddress(itm.value))
      {
        validation_errors.push({ "key": dnsid, 'message': 'You have entered an invalid IP address' });
      }
      if(i > 0)
      {
        configStr = configStr + ",";
      }
      configStr = configStr + itm.value;
    }
    configStr = configStr + "\r\n";
  }


  var validation_errors_length = validation_errors.length;
  for (var i = 0; i < validation_errors_length; i++) {
    if(validation_errors[i].key == 'common_error')
    {
      $('#common_errors').show();
      $('#common_errors').append('<p class="help-block">' + validation_errors[i].message + '</p>');
    }
    $('#' + validation_errors[i].key).closest('.form-group').addClass("has-error");
    if(validation_errors[i].key.startsWith("dns_server_") || validation_errors[i].key.startsWith("ntp_server_"))
    {
      $('#' + validation_errors[i].key).closest('.form-group').append('<p class="col-xs-offset-3 col-md-offset-3 col-xs-6 help-block">' + validation_errors[i].message + '</p>');
    }
    else {
      $('#' + validation_errors[i].key).closest('.form-group').append('<p class="col-md-offset-3 col-xs-6 help-block">' + validation_errors[i].message + '</p>');
    }

  }

  if(validation_errors_length == 0)
  {
    if(configStr.length > 5)
    {
      alert("Your config file is almost ready!\n\nYour browser will start to download the file as soon as you press OK below. Save the file on to the boot partition of your SD card and make sure to name it network.ini\n\n");
      saveFile("network.ini", configStr);
    }
    else {
      alert("Please select options before generating configuration");
    }
  }
});
