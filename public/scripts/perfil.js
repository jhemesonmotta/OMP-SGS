GlobalFlag = false;
var tags = [];
var qtdFotos = 0;
var i = 0;

function caller(fotos){
    qtdFotos = fotos.length;

    processImage(fotos[0]);
    document.querySelector("#sourceImage").src = fotos[0];
    // for(var foto of fotos){
    //      processImage(foto);
    // }
}

function processImage(sourceImageUrl) {

    document.querySelector("#corpoInteiro").style.display = "none";
    document.querySelector("#loader").style.display = "block";

    var subscriptionKey = "4dfab9a68a1e4a4ba92d3fa91996c4b5";
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
            tags.push(temp);
        }
        // if(i == qtdFotos){
            // fun��o que os agrupar� e retornar� as 5 tags mais recorrentes com a porcentagem de chances desta aparecer em fotos outras fotos desta "lista"
                // ex.: futuras fotos desta pessoa
            $("#responseTextArea").val(JSON.stringify(data, null, 2));
            document.querySelector("#corpoInteiro").style.display = "block";
            document.querySelector("#loader").style.display = "none";
        // }
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