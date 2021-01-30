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

        document.querySelector('a#note-' + note).addEventListener('click', () => {
            let attempt = document.querySelector('input[name=currentAttempt]')

            attempt.value += note
            
            if (attempt.value.length > 6) {
                attempt.value = attempt.value.slice(attempt.value.length - 6)
            }

            createjs.Sound.play(soundId)

            return false
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
    
    document.querySelector('button#melody-player').disabled = true
    playChord(code)
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
    document.querySelector('button#melody-player').addEventListener('click', () => {
        play(code)
        return false
    })
}

function sleep (delay = 50) { 
    return new Promise((resolve) => { setTimeout(resolve, delay) }) 
}

function playChord (code) {
    code.split('').forEach(async (note, index) => {
        await sleep(50 * (index + 1))
        createjs.Sound.play(`regulars/${mapping[note]}`)
    })
}

function play(code) {
    document.querySelector('button#melody-player').disabled = true
    window.setTimeout(() => { document.querySelector('button#melody-player').disabled = false }, 6000)
    code.split('').forEach(async (note, index) => {
        await sleep(715 * (index + 1))
        createjs.Sound.play(`regulars/${mapping[note]}`)
    })
}

window.addEventListener('load', () => {
    setup()
    main()
})
