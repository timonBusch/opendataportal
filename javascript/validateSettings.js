
window.onload = function () {
    let index = 42
    UIkit.util.on("#switcher", "shown", function (e) {
        index = UIkit.util.index(e.target);
    });

    document.getElementById("confirm").addEventListener('click', function () {
        getSettings(index)
    })

}

function getSettings(index) {
    let seconds = "0"
    let minutes = "0"
    let hours = "*"
    let day_of_month = "*"
    let month = "*"
    let day_of_week = "?"

    if(index === 42 || index === 0) {
        minutes = document.getElementById("hourly_minutes").value
    }else if(index === 1) {
        let time = document.getElementById("daily_time")
        let array = time.value.split(":")
        minutes = array[1]
        hours = array[0]
    }else if(index === 2) {
        day_of_week = document.getElementById("weekly_day").value
        let time = document.getElementById("weekly_time")
        let array = time.value.split(":")
        minutes = array[1]
        hours = array[0]
        day_of_month = "?"
    }

    let settings = {
        'settings' : seconds + " " + minutes + " " + hours + " " + day_of_month + " " + month + " " + day_of_week
    }
    console.log(settings)
    postDataWithout(SWAC_config.datasources[1] + "schedule/addScheduleDate", toUrlencoded(settings))
}


