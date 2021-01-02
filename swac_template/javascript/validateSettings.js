
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
    if(index === 42 || index === 0) {
        let minutes = document.getElementById("hourly_minutes")
        console.log(minutes.value)
        let settings = {
            'settings' : minutes
        }
        postData("http://localhost:8080/opendataportal-1.0-SNAPSHOT/schedule/addScheduleDate", toUrlencoded(settings))
    }else if(index === 1) {
        let time = document.getElementById("daily_time")
        console.log(time.value)
    }else if(index === 2) {
        let day = document.getElementById("weekly_day")
        let time = document.getElementById("weekly_time")
        console.log(day.value + " " + time.value)
    }
}


