function filterimage(img) {


        var params = {
            // Request parameters
            "CacheImage": "false",
        };



      return  $.ajax({
            url: "https://westus.api.cognitive.microsoft.com/contentmoderator/moderate/v1.0/ProcessImage/Evaluate?" + $.param(params),
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Content-Type","application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","72a8f61d4834426f90659815a1e7b7ea");
            },
            async: false,
            type: "POST",
            // Request body
            data: "{\"DataRepresentation\":\"URL\",\"Value\":\""+img+"\"}",
        })


}
/*
img="https://scontent.xx.fbcdn.net/v/t1.0-0/s130x130/14925434_1308365342529722_4573687656935891926_n.jpghttps://scontent.xx.fbcdn.net/v/t1.0-0/s130x130/14925434_1308365342529722_4573687656935891926_n.jpg?oh=b4fc795b41d0d7977173cb1a1c2ac50e&oe=58CA18E0";
img=filterimage(img);
console.log(img);

img.done(function(data) {
console.log(data);

if(data.IsImageAdultClassified==true || data.IsImageRacyClassified==true)
{
    flag=1;
}
else
{
    flag=0;
}
})
img.fail(function() {
            alert("error");
        });
*/
