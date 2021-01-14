
let id_sub = new URLSearchParams(window.location.search).get('id')

function postData(url, data) {
    return fetch(url, {
        body: JSON.stringify(data),
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'user-agent': 'Mozilla/4.0 MDN Example',
            'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        method: 'POST',
        mode: 'cors',
        redirect: 'follow',
        referrer: 'no-referrer',
    })
        .then(response => response.json())
}

function subscribe() {
    let mail = document.getElementById("subscribe_input")

    let subscriber = {
        'emailAddress': mail.value,
        'tableId': id_sub
    }

    let formBody = []
    for (let property in subscriber) {
        let encodedKey = encodeURIComponent(property)
        let encodedValue = encodeURIComponent(subscriber[property])
        formBody.push(encodedKey + "=" + encodedValue)
    }
    formBody = formBody.join("&")

    postDataWithout(SWAC_config.datasources[1] + "tbl_subscriber/addTblSubscriber?" + formBody)

}

