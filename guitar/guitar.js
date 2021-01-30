"use strict";

function GuitarGame(element) {
    this.mapping = {
        'A': 'A3',
        'C': 'C3',
        'D': 'D3',
        'E': 'E3',
        'G': 'G3',
        'a': 'A4',
        'c': 'C4',
        'd': 'D4',
        'e': 'E4',
        'g': 'G4'
    }

    this.code = ''

    this.started = false
    this.over = false

    this.setup = function () {
        ['A', 'C', 'D', 'E', 'G', 'a', 'c', 'd', 'e', 'g'].forEach((note) => {
            const
                fileName = this.mapping[note],
                soundId = `regulars/${fileName}`
    
            createjs.Sound.registerSound(`notes/regulars/${fileName}.mp3`, soundId)
    
            document.querySelector('a#note-' + note).addEventListener('click', () => {
                if (this.over) {
                    return
                }
                
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

    this.start = function () {
        this.setup()
        this.code = this.generateCode()
        element.classList.add("show");
        this.setPlayback()
        this.started = true
    }
    
    this.stop = function() {
        element.classList.remove("show");
        this.started = false
    }
    
    this.update = function(now) {
        if (!this.started || this.over) {
            return
        }

        const currentAttempt = document.querySelector('input[name=currentAttempt]').value
        if (currentAttempt === this.code) {
            document.querySelector('button#melody-player').disabled = true
            this.playChord()
            this.over = true
        }
    }

    this.generateCode = function () {
        const notes = ['A', 'C', 'D', 'E', 'G', 'a', 'c', 'd', 'e', 'g']
        let code = ''
        
        while (code.length < 6) {
            let index = Math.floor(Math.random() * Math.floor(notes.length))
            code += notes[index]
        }

        return code
    }

    this.setPlayback = function () {
        this.play()
        document.querySelector('button#melody-player').addEventListener('click', () => {
            this.play()
            return false
        })
    }

    this.sleep = function (delay = 50) { 
        return new Promise((resolve) => { setTimeout(resolve, delay) }) 
    }

    this.playChord = function () {
        this.code.split('').forEach(async (note, index) => {
            await this.sleep(50 * (index + 1))
            createjs.Sound.play(`regulars/${this.mapping[note]}`)
        })
    }

    this.play = function () {
        if (this.over) {
            return
        }

        document.querySelector('button#melody-player').disabled = true
        window.setTimeout(() => { document.querySelector('button#melody-player').disabled = false }, 6000)
        this.code.split('').forEach(async (note, index) => {
            await this.sleep(715 * (index + 1))
            createjs.Sound.play(`regulars/${this.mapping[note]}`)
        })
    }
}