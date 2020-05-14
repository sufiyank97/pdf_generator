var a = [{
    "Section of the report": "F: Inside the property",
    "Element Number": "F7",
    "Element Name": "Woodwork(for example, staircase and joinery) "
},
{
    "Section of the report": "F: Inside the property",
    "Element Number": "F8",
    "Element Name": "Bathroom fittings"
},
{
    "Section of the report": "G: Services",
    "Element Number": "G1",
    "Element Name": "Electricity"
}]
console.log(a)
var n = ""
var p = []
a.map(a1 => {
    console.log(a1)
    if (a1["Section of the report"] === n) {
        p.push({
            "report": "",
            "number": a1["Element Number"],
            "name": a1["Element Name"]
        })
    } else {
        p.push({
            "report": a1["Section of the report"],
            "number": a1["Element Number"],
            "name": a1["Element Name"]
        })
    }
    console.log(typeof (a1["Section of the report"]))
    n = a1["Section of the report"]
    console.log(n, ' d')
})

var b = '[{“Section of the report”: “F: Inside the property”,“Element Number”: “F7”,“Element Name”: “Woodwork (for example, staircase and joinery)”},{“Section of the report”: “F: Inside the property”,“Element Number”: “F8”,“Element Name”: “Bathroom fittings”},{“Section of the report”: “G: Services”,“Element Number”: “G1”,“Element Name”: “Electricity”}]'
b = b.replace('/“/g', '"')
console.log(b)
