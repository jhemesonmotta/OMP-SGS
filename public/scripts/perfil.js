var tags = [];
var qtdFotos = 0;
var i = 0;

google.charts.load('current', {'packages':['corechart']});
      

function caller(fotos){
    fotos = fotos.slice(0, 10); // apenas pra diminuir a qtd;
    qtdFotos = fotos.length;

    document.querySelector("#sourceImage").src = fotos[0];
    document.querySelector("#sourceImage2").src = fotos[1];
    document.querySelector("#sourceImage3").src = fotos[2];
    document.querySelector("#sourceImage4").src = fotos[3];
    document.querySelector("#sourceImage5").src = fotos[4];
    document.querySelector("#sourceImage6").src = fotos[5];

    for(var foto of fotos){
         processImage(foto);
    }
}

function graficoImagem(imageId){
    var url = $('#' + imageId).attr('src');
    tags = [];
    qtdFotos = 1;
    i = 0;
    processImage(url);
}

function drawChart() {
    var dados = new google.visualization.DataTable();
    dados.addColumn('string', 'Tags');
    dados.addColumn('number', 'Porcentagem');

    for(var tag of tags){
        var pct = ((tag.confidence / qtdFotos) * 100).toFixed(2);

        dados.addRow(
            [tag.name, Number(pct)]
        );
    }
    
    var options = {'title':''};
    var chart = new google.visualization.BarChart(document.getElementById('chart'));
    chart.draw(dados, options);
}

function processImage(sourceImageUrl) {

    document.querySelector("#corpoInteiro").style.display = "none";
    document.querySelector("#loader").style.display = "block";

    var subscriptionKey = "e41a1dc7e72c43299f3419beb6f6c7c1";
    var uriBase ="https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/analyze";

    // Request parameters.
    var params = {
        "visualFeatures": "Tags,Categories,Description,Color",
        "details": "",
        "language": "en",
    };

    // Make the REST API call.
    $.ajax({
        url: uriBase + "?" + $.param(params),

        // Request headers.
        beforeSend: function(xhrObj){
            xhrObj.setRequestHeader("Content-Type","application/json");
            xhrObj.setRequestHeader(
                "Ocp-Apim-Subscription-Key", subscriptionKey);
        },

        type: "POST",

        // Request body.
        data: '{"url": ' + '"' + sourceImageUrl + '"}',
    })

    .done(function(data) {
        i ++;
        for(var temp of data.tags){
            var tem = false;
            for(var tag of tags){
                if(temp.name == tag.name){
                    tag.confidence = (tag.confidence + temp.confidence);
                    tem = true;
                }
            }
            if(!tem || tags.length == 0){
                tags.push(temp);
            }
        }
        if(i == qtdFotos){

            tags.sort(function(a,b) {
                return (a.confidence < b.confidence) ? 1 : ((b.confidence < a.confidence) ? -1 : 0);
            } );
            tags = tags.slice(0,5);            
            document.querySelector("#corpoInteiro").style.display = "block";
            document.querySelector("#loader").style.display = "none";

            google.charts.setOnLoadCallback(drawChart);
            drawChart();
        }
    })

    .fail(function(jqXHR, textStatus, errorThrown) {
        // Display error message.
        var errorString = (errorThrown === "") ? "Error. " :
            errorThrown + " (" + jqXHR.status + "): ";
        errorString += (jqXHR.responseText === "") ? "" :
            jQuery.parseJSON(jqXHR.responseText).message;
        alert(errorString);
    });
}