const getId = function(id) {
    return document.getElementById(id);
}

const getAllClass = function(classname) {
    return document.getElementsByClassName(classname);
}

module.exports = {
    getId,
    getAllClass
}