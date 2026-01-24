// tests go here; this will not be compiled when this package is used as an extension.

// (Optional) Enable verbose mode for debugging
cutscene.verboseMode = true;

const SPEED: number = 100;

// Create the cat sprite
const cat: Sprite = sprites.create(assets.image`cat1`);

// Center the cat on screen
cat.setPosition(screen.width / 2, screen.height / 2);
cat.scale = 0.7; // Set initial scale

// Create a cutscene handler
const cutsceneHandler = cutscene.create();

// (Optional) Automatically stop once all events have finished running
cutsceneHandler.stopWhenFinished = true;

// Walk right event (ID: "walkRight")
cutsceneHandler.add(500, "walkRight", (handler) => {
    cat.vx = SPEED;
});

// Sine zoom event (ID: "zoom")
cutsceneHandler.add(500, "zoom", (handler) => {
    let t: number = 0;
    game.onUpdateInterval(25, () => {
        t += 0.1;
        // scary math stuff (ignore)
        cat.scale = 0.6 + ((0.7 - 0.6) / 2) * (Math.sin(t) + 1);
    });
});
cutsceneHandler.remove("zoom"); // Remove zoom event

// Stop event (ID: "stop")
cutsceneHandler.add(2000, "stop", (handler) => {
    cat.vx = 0;
});

// Jump event (ID: "jump")
cutsceneHandler.add(2500, "jump", (handler) => {
    cat.vy = -SPEED;
});

// Fall event (ID: "fall")
cutsceneHandler.add(2700, "fall", (handler) => {
    cat.vy = SPEED;
});

// Land event (ID: "land")
cutsceneHandler.add(2895, "land", (handler) => {
    cat.vy = 0;
});

// Walk right again (ID: "walkRight")
cutsceneHandler.add(3100, "walkRight", (handler) => {
    cat.vx = SPEED;
});

// Repeat the cutscene every 4.5 seconds
game.onUpdateInterval(4500, () => {
    cat.vx = 0;
    cat.setPosition(0 - cat.width / 2, screen.height / 2);
    cutsceneHandler.start();
});

// Start the cutscene
cutsceneHandler.start();
