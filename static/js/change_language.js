console.log("NICE TRYY")

function copyToClipboard() {
    console.log("NICE TRY")
    var lang_butt = document.getElementById("lang")
    if (lang_butt.innerHTML == "EN") {
        lang_butt.innerHTML  = "RU"
    } else {
        lang_butt.innerHTML  = "EN"
    }
}