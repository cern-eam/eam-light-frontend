export const saveHistory = (key, value, desc) => {
    console.log("save history", key, value, desc); // Type: 'H' is necessery as it draws the 'history' icon 
}

export const fetchHistory = (key) => {
    return [
        {code: "A", desc: "A - Desc", type: "H"}, 
        {code: "B", desc: "B - Desc", type: "H"},
        {code: "C", desc: "C - Desc", type: "H"},
        {code: "D", desc: "D - Desc", type: "H"}
    ]
}