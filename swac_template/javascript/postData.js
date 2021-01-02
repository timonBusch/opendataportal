/**
 * Posts given data to the given url
 *
 * @param url
 * @param data
 * @returns {Promise<void>}
 */
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
        .then(response => {
            location.reload()
        });
}

function toUrlencoded(data) {

    let formBody = []
    for (let property in data) {
        let encodedKey = encodeURIComponent(property)
        let encodedValue = encodeURIComponent(data[property])
        formBody.push(encodedKey + "=" + encodedValue)
    }
    formBody = formBody.join("&")
    return formBody
}