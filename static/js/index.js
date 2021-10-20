loadDocumentValues();
loadTableData();

function loadDocumentValues() {
    document.title = location.hostname + " - Website";
    document.getElementById("title").innerHTML = "Raspberry Pi | <b>" + location.hostname + "</b>";
}

async function loadTableData() {
    var response = await fetch("/data/information.json");
    var data = await response.json();

    document.getElementById("tablebody").innerHTML = "";

    data.forEach(function(element) {
        document.getElementById("tablebody").innerHTML += "<tr><td>" + element.name + "</td><td>" + element.kuerzel + "</td><td>" + element.website + "</td>" + "<td><button class='delete' onclick=\"deleteRequest(this.parentNode.parentNode.getElementsByTagName('td')[2].innerText)\"><i class='material-icons'>&#xE872;</i></button></td>" + "</tr>";
    });
}

async function warning() {
    var doRestart = confirm('Sind Sie sicher, dass Sie das Dashboard neustarten wollen? (2 Minuten)');
    if (doRestart) {
        await fetch("/server/restart", { method: "POST" });
    }
}

function deleteRequest(elem) {
    fetch("/items/del", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({ "websitename": elem })
    })
    loadTableData();
}