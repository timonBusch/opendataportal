
function postData(url, data) {
    return fetch(url, {
        body: JSON.stringify(data),
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'user-agent': 'Mozilla/4.0 MDN Example',
            'content-type': 'application/json'
        },
        method: 'POST',
        mode: 'cors',
        redirect: 'follow',
        referrer: 'no-referrer',
    })
        .then(response => response.json())
}
/*
function subscribe() {
    let mail = document.getElementById("subscribe_input")
    alert(mail.value)

}
*/
function promptInput(input = "") {
    UIkit.util.on('#subscribe_modal', 'click', function (e) {
        UIkit.modal.prompt('Name:', 'Your name').then(function (name) {
            console.log('Prompted:', name)
        });
    });
}
