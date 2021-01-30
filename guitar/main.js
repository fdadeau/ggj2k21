const mapping = {
    A: 'A3',
    C: 'C3',
    D: 'D3',
    E: 'E3',
    G: 'G3',
    a: 'A4',
    c: 'C4',
    d: 'D4',
    e: 'E4',
    g: 'G4'
}

function setup () {
    ['A', 'C', 'D', 'E', 'G', 'a', 'c', 'd', 'e', 'g'].forEach((note) => {
        const
            fileName = mapping[note],
            soundId = `regulars/${fileName}`

        createjs.Sound.registerSound(`notes/regulars/${fileName}.mp3`, soundId)

        document.querySelector('tr.string > td#note-' + note).addEventListener('click', () => {
            let attempt = document.querySelector('input[name=currentAttempt]')

            attempt.value += note
            
            if (attempt.value.length > 6) {
                attempt.value = attempt.value.slice(attempt.value.length - 6)
            }

            createjs.Sound.play(soundId)
        })
    })
}

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
    return window.setInterval(() => play(code), 15000)
}

function sleep (delay = 50) { 
    return new Promise((resolve) => { setTimeout(resolve, delay) }) 
}

function stopPlayback (intervalId) {
    window.clearInterval(intervalId)
}

function play(code) {
    code.split('').forEach(async (note, index) => {
        await sleep(715 * (index + 1))
        createjs.Sound.play(`regulars/${mapping[note]}`)
    })
}

window.addEventListener('load', () => {
    setup()
    main()
})
