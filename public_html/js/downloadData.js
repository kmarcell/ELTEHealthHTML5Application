
function DownloadData(callback)
{
    var parseDate = d3.time.format("%Y-%m-%dT%X%Z").parse; // exp.: 2015-10-20T09:29:05+02:00

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange=function() {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            var json = JSON.parse(xmlhttp.responseText);
            var data = json.rows;
            data.forEach(function(d) {
                d.value.startTime = parseDate(d.value.startTime.substring(0, 22) + "00");
            });
            
            if (typeof callback === "function") {
                callback(data);
             }
       }
    };

    xmlhttp.open("GET"," http://ec2-52-29-5-113.eu-central-1.compute.amazonaws.com:5984/labor/_design/sessions/_view/by_user_id", true);
    xmlhttp.setRequestHeader("Accept", "application/json; charset=utf-8");
    xmlhttp.send();
}

