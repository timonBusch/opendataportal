
let id_sub = new URLSearchParams(window.location.search).get('id')

function subscribe() {
    let mail = document.getElementById("subscribe_input")

    if(mail.value === "") {
        mail.classList.add("uk-animation-shake")

        setTimeout(function () {
            mail.classList.remove("uk-animation-shake")
        }, 500)
    }else {
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

        postDataWithout(SWAC_config.datasources[1] + "tbl_subscriber/addTblSubscriber?"+ formBody)
        UIkit.modal("#subscribe_modal").toggle()
    }


}

