async function main () {
    const code = generateCode()
    let currentAttempt = ''
    let found = false

    const intervalId = setPlayback(code)

    while(!found) {
        await sleep()
        currentAttempt = document.querySelector('input[name=currentAttempt]').value
        found = currentAttempt === code
    }

    console.log("finally!")
    stopPlayback(intervalId)
}

function generateCode () {
    const notes = ['A', 'C', 'D', 'E', 'G', 'a', 'c', 'd', 'e', 'g']
    let code = ''
    
    while (code.length < 6) {
        let index = Math.floor(Math.random() * Math.floor(notes.length))
        code += notes[index]
    }

    return code
}

function setPlayback (code) {
    play(code)
    return window.setInterval(() => play(code), 5000)
}

function sleep (delay = 50) { 
    return new Promise((resolve) => { setTimeout(resolve, delay) }) 
}

function stopPlayback (intervalId) {
    window.clearInterval(intervalId)
}

function play(code) {
    console.log(code)
}

window.addEventListener('load', main)
