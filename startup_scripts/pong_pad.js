StartupEvents.registry('item', event => {
    if(global.pongItem==undefined) {
        Platform.mods.pongjs.name = "PongJS"

        event.create("pongjs:pong_pad").unstackable().texture("pongjs:item/pong_pad")
        global.pongItem = "pongjs:pong_pad"
    }
})