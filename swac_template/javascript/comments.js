const queryStringx = window.location.search;

const urlParamsx = new URLSearchParams(queryStringx)
let id_comments = urlParamsx.get('id')

/**
 * Make post request to api content type
 * application/x-www-form-urlencoded;charset=UTF-8
 * @param url
 * @param data to store
 * @returns {Promise<any>}
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
        .then(response => response.json())
}

/**
 * Get comment from UI and transform to x-www-form-urlencoded
 */
function postComment() {

    let author = document.getElementById("comment_author").value
    let text = document.getElementById("comment_area").value

   let comment = {
       'author': author,
       'content': text,
       'tableId': id_comments
    }

    let formBody = []
    for (let property in comment) {
        let encodedKey = encodeURIComponent(property)
        let encodedValue = encodeURIComponent(comment[property])
        formBody.push(encodedKey + "=" + encodedValue)
    }
    formBody = formBody.join("&")

    postData("http://localhost:8080/opendataportal-1.0-SNAPSHOT/comment/addComment", formBody)

    //updateComments()

}

/**
 * Update SWAC component for comments TODO: Fix only deleting
 */
function updateComments() {

    getComments().then(data => {
        comments = data
        let component = document.getElementById("present_comments")

        component.swac_comp.removeAllData()
        component.swac_comp.addData("present_comments", comments.records)
    })

}

async function getComments() {
    let response = await fetch("http://localhost:8080/opendataportal-1.0-SNAPSHOT/comment/tableId?tableId=" + id_comments);
    return await response.json()
}

var comments

getComments().then(data => {
    comments = data
})



