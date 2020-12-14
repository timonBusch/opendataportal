


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
        .then(response => response.json())
}

function postComment() {
    const queryString = window.location.search;

    const urlParams = new URLSearchParams(queryString)
    let id = urlParams.get('id')

    let author = document.getElementById("comment_author").value
    let text = document.getElementById("comment_area").value

   let comment = {
       'author': author,
       'content': text,
       'tableId': id
    }

    let formBody = []
    for (let property in comment) {
        let encodedKey = encodeURIComponent(property)
        let encodedValue = encodeURIComponent(comment[property])
        formBody.push(encodedKey + "=" + encodedValue)
    }
    formBody = formBody.join("&")

    postData("http://localhost:8080/opendataportal-1.0-SNAPSHOT/comment/addComment", formBody).then(function (data) {
        console.log(data)
    })

    getComments().then(data => {
        comments = data
    })
    //updateComments()

}

function updateComments() {

    let component = document.getElementById("present_comments")
    component.swac_comp.removeAllData()
    component.swac_comp.addData(comments)
}

async function getComments() {
    let response = await fetch("http://localhost:8080/opendataportal-1.0-SNAPSHOT/comment");
    return await response.json()
}

var comments

getComments().then(data => {
    comments = data
})



