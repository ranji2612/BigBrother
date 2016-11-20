

function getAjax(message) {
  console.log(message);
        var flag=0;
        var params = {
            // Request parameters
            "autocorrect": "{boolean}",
            "urls": "{boolean}",
            "PII": "{boolean}",
            "listId": "{string}",
        };

        return $.ajax({
            url: "https://westus.api.cognitive.microsoft.com/contentmoderator/moderate/v1.0/ProcessText/Screen/?language=eng&" + $.param(params),
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Content-Type","text/plain");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","72a8f61d4834426f90659815a1e7b7ea");
            },
            type: "POST",
            // Request body
            data: message,
        })

}
text=getAjax("We found this. \n the cut. fuck");
text.done(function(data) {

            console.log(data);

            if(data.Terms==null)
            {
                flag=0;
            }
            else{

            }
        })
        .fail(function(err) {
            // alert("error");
            console.log(err)
        });
