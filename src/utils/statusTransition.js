const transitions = {

TODO:[
"IN_PROGRESS",
"BLOCKED"
],

IN_PROGRESS:[
"IN_REVIEW",
"BLOCKED"
],

IN_REVIEW:[
"DONE",
"BLOCKED"
],

DONE:[],

BLOCKED:[
"TODO",
"IN_PROGRESS"
]

};

module.exports=(from,to)=>{

return transitions[from]
?.includes(to);

}