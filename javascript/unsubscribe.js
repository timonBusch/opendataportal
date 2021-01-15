function loadPopUp() {
    document.getElementById("callPopUp").click();
}

function unsubscribe() {
    var currentURL = (document.URL);
    var tableId = currentURL.split("#")[1];
    let mail = document.getElementById("unsubscribe_input").value

    let data = {
        'tblId': tableId,
        'mail': mail,
    }

    let formBody = []
    for (let property in data) {
        let encodedKey = encodeURIComponent(property)
        let encodedValue = encodeURIComponent(data[property])
        formBody.push(encodedKey + "=" + encodedValue)
    }
    formBody = formBody.join("&")

    postDataWithout(SWAC_config.datasources[1] + "subscriber/rmvSubscriber?" + formBody).then(function () {
        window.location.href="../sites/outline.html"
    })




}
