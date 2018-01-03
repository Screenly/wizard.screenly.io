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

function convertNetmaskToCIDR(netmask) {
  var maskNodes = netmask.match(/(\d+)/g);
  var cidr = 0;
  for(var i in maskNodes)
  {
    cidr += (((maskNodes[i] >>> 0).toString(2)).match(/1/g) || []).length;
  }
  return cidr;
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

$('#wifi-fields').hide();
$('#wired-fields').hide();
$('#dns-fields').hide();
$('#ntp-fields').hide();
$('#common_errors').hide();
$('#wifi-no-dhcp-fields').hide();
$('#wired-no-dhcp-fields').hide();
$('input[name=wifidhcp]').prop('checked', 'checked');
$('input[name=wireddhcp]').prop('checked', 'checked');
$('input[id=screenlyv1]').prop('checked', 'checked');

$('input[name=screenlyversion]').change(function() {
  console.log("Screenly version changed");
  var ntp = document.getElementById("ntp")
  if($('input[id=screenlyv1]').is(':checked'))
  {
    console.log("Screenly v1 is selected");
    ntp.disabled = false;
  }
  else
  {
    console.log("Screenly v2 is selected");
    ntp.disabled = true;
    $('#ntp-fields').hide();
  }
});

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

  // Validate and get values from user

  var validation_errors = [];

  var v1Str = "";
  var v2Str = "network:\r\n  version: 2\r\n";

  var has_wifi = $('#wifi').is(":checked");
  var wifi_ssid = $('#ssid').val();
  var wifi_hidden_ssid = $('#hiddenssid').is(":checked");
  var wifi_passphrase = $('#passphrase').val();
  var wifi_dhcp = $('#wifidhcp').is(":checked");
  var wifi_ip = $('#wifiip').val();
  var wifi_gw = $('#wifigateway').val();
  var wifi_mask = $('#wifinetmask').val();

  var has_wired = $('#wired').is(":checked");
  var wired_dhcp = $('#wireddhcp').is(":checked");
  var wired_ip = $('#wiredip').val();
  var wired_gw = $('#wiredgateway').val();
  var wired_mask = $('#wirednetmask').val();

  var has_custom_ntp = $('#ntp').is(":checked");
  var ntp_server_list = [];

  var has_custom_dns = $('#dns').is(":checked");
  var dns_server_list = [];

  if(has_wifi == false && has_wired == false) {
    validation_errors.push({'key':'common_error' , 'message': 'You must configure either a WiFi or wired interface.'});
  }

  if(has_custom_ntp == true) {
    for(var i = 0; i < $('[id^="ntp_server_"]').length; i++) {
      var itm = $('[id^="ntp_server_"]')[i];
      var ntpid = "ntp_server_" + (i+1);
      if(validateIPaddress(itm.value) || validateFQDN(itm.value) ) {
        ntp_server_list.push(itm.value);
      }
      else {
        validation_errors.push({ "key": ntpid, 'message': 'You have entered an invalid IP address/FQDN' });
      }
    }
  }

  if(has_custom_dns == true) {
    for(var i = 0; i < $('[id^="dns_server_"]').length; i++) {
      var itm = $('[id^="dns_server_"]')[i];
      var dnsid = "dns_server_" + (i+1);
      if(validateIPaddress(itm.value)) {
        dns_server_list.push(itm.value);
      }
      else {
        validation_errors.push({ "key": dnsid, 'message': 'You have entered an invalid IP address' });
      }
    }
  }

  if(has_wifi == true) {
    if(wifi_ssid == "")
      validation_errors.push({'key': 'ssid' , 'message':'SSID is required'});

    if(wifi_dhcp == false) {
      if(!validateIPaddress(wifi_ip)) {
        validation_errors.push({'key': 'wifiip' ,'message' : 'You have entered an invalid IP address.'});
      }
      if(!validateIPaddress(wifi_gw)) {
        validation_errors.push({'key': 'wifigateway' ,'message' : 'You have entered an invalid IP address.'});
      }
      if(!validateNetmask(wifi_mask)) {
        validation_errors.push({'key': 'wifinetmask' ,'message' : 'You have entered an invalid netmask.'});
      }
    }
  }

  if(has_wired == true) {
    if(wired_dhcp == false) {
      if(!validateIPaddress(wired_ip)) {
        validation_errors.push({'key': 'wiredip' ,'message' : 'You have entered an invalid IP address.'});
      }
      if(!validateIPaddress(wired_gw)) {
        validation_errors.push({'key': 'wiredgateway' ,'message' : 'You have entered an invalid IP address.'});
      }
      if(!validateNetmask(wired_mask)) {
        validation_errors.push({'key': 'wirednetmask' ,'message' : 'You have entered an invalid netmask.'});
      }
    }
  }

  // Filling the data for v1 configuration

  if(has_wifi == true) {
    v1Str += "[wlan0]\r\nssid=" + wifi_ssid + "\r\n";
    if(wifi_passphrase != "") {
      v1Str += "passphrase=" + wifi_passphrase + "\r\n";
    }
    if(wifi_dhcp == true) {
      v1Str += "mode=dhcp\r\n";
    }
    else {
      v1Str += "ip=" + wifi_ip + "\r\n";
      v1Str += "netmask=" + wifi_mask + "\r\n";
      v1Str += "gateway=" + wifi_gw + "\r\n";
    }
    if(wifi_hidden_ssid == true) {
      v1Str += "hidden_ssid=true" + "\r\n";
    }
    v1Str += "\r\n";
  }

  if(has_wired == true) {
    v1Str = v1Str + "[eth0]\r\n";
    if(wired_dhcp == true) {
      v1Str = v1Str + "mode=dhcp" + "\r\n";
    }
    else {
      v1Str += "ip=" + wired_ip + "\r\n";
      v1Str += "netmask=" + wired_mask + "\r\n";
      v1Str += "gateway=" + wired_gw + "\r\n";
    }
  }

  if(has_custom_ntp == true || has_custom_dns == true) {
    v1Str += "\r\n[generic]\r\n";
  }

  if(has_custom_ntp == true) {
    v1Str += "ntp=";
    for(var i = 0; i < ntp_server_list.length; i++) {
      if (i > 0) {
        v1Str += ","
      }
      v1Str += ntp_server_list[i];
    }
    v1Str += "\r\n";
  }

  if(has_custom_dns == true) {
    v1Str += "dns=";
    for(var i = 0; i < dns_server_list.length; i++) {
      if (i > 0) {
        v1Str += ","
      }
      v1Str += dns_server_list[i];
    }
    v1Str += "\r\n";
  }

  // Filling the data for v2 configuration
  
  if(has_wired == true) {
    var ethConfig = "";

    v2Str += "  ethernets:\r\n";
    v2Str += "    all-en:\r\n";
    v2Str += "      match:\r\n";
    v2Str += "        name: \"en*\"\r\n";

    if(wired_dhcp == true) {
      ethConfig += "      dhcp4: true\r\n";
    }
    else {
      ethConfig += "      addresses: [" + wired_ip + "/" + convertNetmaskToCIDR(wired_mask) + "]\r\n";
      ethConfig += "      gateway4: " + wired_gw + "\r\n";
    }

    if(has_custom_dns == true) {
      ethConfig += "      nameservers:\r\n"
      ethConfig += "        addresses: ["
      for(var i = 0; i < dns_server_list.length; i++) {
        if (i > 0) {
          ethConfig += ","
        }
        ethConfig += dns_server_list[i];
      }
      ethConfig += "]\r\n";
    }

    v2Str += ethConfig;

    v2Str += "    all-eth:\r\n";
    v2Str += "      match:\r\n";
    v2Str += "        name: \"eth*\"\r\n";
    v2Str += ethConfig;
  }

  if(has_wifi == true) {

    v2Str += "  wifis:\r\n";
    v2Str += "    all-wlans:\r\n";
    v2Str += "      match:\r\n";
    v2Str += "        name: \"wl*\"\r\n";  // This will match both old (wlan0) and newer (wlp7s0) naming schemas

    v2Str += "      access-points:\r\n";
    v2Str += "        \"" + wifi_ssid + "\":\r\n";

    if(wifi_passphrase != "" || wifi_hidden_ssid) {
      v2Str += "          password: \"" + wifi_passphrase + "\"\r\n";
    }

    if(wifi_dhcp == true) {
      v2Str += "      dhcp4: true\r\n";
    }
    else {
      v2Str += "      addresses: [" + wifi_ip + "/" + convertNetmaskToCIDR(wifi_mask) + "]\r\n";
      v2Str += "      gateway4: " + wifi_gw + "\r\n";
    }

    if(has_custom_dns == true) {
      v2Str += "      nameservers:\r\n"
      v2Str += "        addresses: ["
      for(var i = 0; i < dns_server_list.length; i++) {
        if (i > 0) {
          v2Str += ","
        }
        v2Str += dns_server_list[i];
      }
      v2Str += "]\r\n";
    }
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
    if(v1Str.length > 5)
    {
      if($('input[id=screenlyv1]').is(':checked'))
      {
        var configStr = v1Str;
        var configFileName = "network.ini"
      }
      else
      {
        var configStr = v2Str;
        var configFileName = "network.yaml"
      }
      alert("Your config file is almost ready!\n\nYour browser will start to download the file as soon as you press OK below. Save the file on to the boot partition of your SD card and make sure to name it " + configFileName + "\n\n");
      saveFile(configFileName, configStr);
    }
    else {
      alert("Please select options before generating configuration");
    }
  }
});
