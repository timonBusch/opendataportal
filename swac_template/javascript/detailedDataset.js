const queryString = window.location.search;
console.log(queryString)

const urlParams = new URLSearchParams(queryString)
//records.id(urlParams.get(id))

var records = {"records":[{"datacapture":true,"parent_id":7,"type_id":7,"name":"Sensor fuer Ausrichtungstests","description":"Erfasste Werte eines Sensors, der im Verlauf der Messungen unterschiedlich ausgerichtet wurde, um die Auswirkung der verschiedenen Einstrahlungswinkel experimentell nachzuvollziehen.","id":20,"manualcapture":false}]}



//fetch('tbl_observedobject.json').then(res => res.json()).then(data => console.log(data))

