const queryStringx = window.location.search;

const urlParamsx = new URLSearchParams(queryStringx)
let id_comments = urlParamsx.get('id')


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
 * Update SWAC component for comments
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



