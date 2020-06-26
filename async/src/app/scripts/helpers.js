const getId = async function(id) {
    return document.getElementById(id);
}

const getAllClass = async function(classname) {
    return document.getElementsByClassName(classname);
}

module.exports = {
    getId,
    getAllClass
}