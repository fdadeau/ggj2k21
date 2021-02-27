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

    this.ready = false
    this.started = false
    this.over = false

    this.setup = function () {
        const notes = ['A', 'C', 'D', 'E', 'G', 'a', 'c', 'd', 'e', 'g']

        createjs.Sound.registerSound(`guitar/assets/short-circuit.mp3`, 'short-circuit')

        notes.forEach((note) => {
            const
                fileName = this.mapping[note],
                soundId = `regulars/${fileName}`
    
            createjs.Sound.registerSound(`guitar/notes/regulars/${fileName}.mp3`, soundId)
    
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

        this.resize()
        window.addEventListener('resize', this.resize)

        element.querySelector(".btnBack").addEventListener("click", function(e) {
            this.stop();
        }.bind(this));    
    }

    this.resize = function () {
        const ratio = document.documentElement.clientHeight / document.documentElement.clientWidth

        document.querySelectorAll('.fret-V').forEach(element => element.style.left = `${21 * ratio}vw`)
        document.querySelectorAll('.fret-VII').forEach(element => element.style.left = `${61 * ratio}vw`)
        document.querySelectorAll('.fret-VIII').forEach(element => element.style.left = `${80 * ratio}vw`)
    }

    this.start = function () {
        if (!this.ready) {
            this.setup()
            this.code = this.generateCode()
            if (DEBUG) console.log(this.code)
            this.ready = true
        }
        element.classList.add("show");
        this.setPlayback()
        this.started = true
    }
    
    this.stop = function() {
        element.classList.remove("show");
        this.started = false
        if (this.game) {
            this.game.endgame("guitar");
        }
    }
    
    this.isSolved = function() {
        return this.over;   
    }

    this.update = function(now) {
        if (!this.started || this.over) {
            return
        }

        const currentAttempt = document.querySelector('input[name=currentAttempt]').value
        if (currentAttempt === this.code) {
            document.querySelector('button#melody-player').disabled = true
            this.playFinale()
            this.over = true
            this.stop();
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

    this.playFinale = function () {
        const AMinor7 = ['A3', 'E3', 'A4', 'C4', 'G4']
        AMinor7.forEach(async (note, index) => {
            await this.sleep(50 * (index + 1))
            createjs.Sound.play(`regulars/${note}`)
        })

        window.setTimeout(() => { createjs.Sound.play('short-circuit') }, 900)
        window.setTimeout(() => this.stop(), 1250)
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