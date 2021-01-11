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

    postData(SWAC_config.datasources[1] + "subscriber/rmvSubscriber", formBody)



}

function postData(url, data) {
    return fetch(url, {
        body: data,
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        method: 'POST',
        mode: 'cors',
        redirect: 'follow',
        referrer: 'no-referrer',
    })
        .then(response => window.location.href="../sites/outline.html")

}