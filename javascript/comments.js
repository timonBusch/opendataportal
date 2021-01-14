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

    postDataWithout(SWAC_config.datasources[1] + "comment/addComment?" + formBody)

}

/**
 * Fetches comments from backend
 * @returns {Promise<any>}
 */
async function getComments() {

    let response = await fetch(SWAC_config.datasources[1] + "comment/tableId?tableId=" + id_comments);
    return await response.json()
}


var comments

getComments().then(data => {
    comments = data
}).catch(function () {
    UIkit.notification({
        message: 'Error while getting comments',
        status: 'warning',
        timeout: 5000
    });
})



