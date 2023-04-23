let keyIndex = 0
let lastActivation = false
let activation = false

let lastMouseY = 0

let ballPosX = 0
let ballPosY = 0
let ballVecX = 0
let ballVecY = 0

let screenH = 0
let screenW = 0
let mouseY = 0

// Trigger the game by setting the activation to true
// when player left clicked with a book containing secret in first page
ItemEvents.clientLeftClicked("written_book", event => {
    let { item } = event
    if (item.id == global.pongItem) {
        activation = true
    }
})

ClientEvents.paintScreen(event => {
    let { width, height, mouseY: screenMouseY } = event
    screenH = height
    screenW = width
    mouseY = screenMouseY
})

ClientEvents.tick(event => {
    if (activation) {
        if (!lastActivation) {
            event.player.paint({
                // Initialize the panels
                panelRight: {
                    type: "rectangle",
                    x: '$screenW-16', y: '$mouseY-32',
                    w: 8, h: 64,
                    alignX: 'left',
                    draw: 'always',
                    texture: "naive:textures/panel.png"
                },
                panelLeft: {
                    type: "rectangle",
                    x: '8', y: '$mouseY-32',
                    w: 8, h: 64,
                    alignX: 'left',
                    draw: 'always',
                    texture: "naive:textures/panel.png"
                },
                // Initialize the ball
                ball: {
                    type: "item",
                    item: "minecraft:snowball",
                    w: 32, h: 32,
                    draw: "always"
                }
            })

            //Iniitalize the position and speed and merge it later
            ballPosX = screenW / 2
            ballPosY = screenH / 2
            ballVecX = 2
            ballVecY = 2
        }

        event.player.paint({
            ball: {
                x: ballPosX,
                y: ballPosY
            }
        })

        ballPosX += ballVecX
        ballPosY += ballVecY

        // Collided with top/bottom border, revert the VecY
        if (ballPosY <= 0 || ballPosY >= screenH)
            ballVecY = -ballVecY

        // About to collide with panel
        if (ballPosX <= 16 || ballPosX >= screenW - 16) {
            if (Math.abs(mouseY - ballPosY) <= 32) {
                ballVecX = -ballVecX

                // Spice it up by adding random extra speed to the ball
                let vecAddiX = Math.random() / 10
                let vecAddiY = Math.random() / 10
                if (ballVecX < 0) vecAddiX = -vecAddiX
                if (ballVecY < 0) vecAddiY = - vecAddiY
                ballVecX += vecAddiX
                ballVecY += vecAddiY
            }

            // Ugh oh, game is over
            if (ballPosX <= -16 || ballPosX >= screenW + 16) {
                activation = false
                return
            }
        }

    } else if (!activation && lastActivation) {
        event.player.paint({
            panelRight: { remove: true },
            panelLeft: { remove: true },
            ball: { remove: true }
        })
    }
    lastActivation = activation
})

ClientEvents.loggedIn(event => {
    activation = false
})

ClientEvents.loggedOut(event => {
    activation = false
})