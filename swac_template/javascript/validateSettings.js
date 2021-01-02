
window.onload = function () {
    document.getElementById('confirm')
}
function test() {
    UIkit.util.on('#switcher1', 'shown', function (e) {
        var index = UIkit.util.index(e.target)
        console.log(index)
    })
}

test()

