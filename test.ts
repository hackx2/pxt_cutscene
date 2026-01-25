// tests go here; this will not be compiled when this package is used as an extension.

// (Optional) Enable verbose mode for debugging
cutscene.verboseMode = true;

const SPEED: number = 100;
//assets.image`cat1`
// Create the cat sprite
const cat: Sprite = sprites.create(assets.image`cat1`);

// Center the cat on screen
cat.setPosition(screen.width / 2, screen.height / 2);
cat.scale = 0.7; // Set initial scale

// Create a cutscene handler
const cutsceneHandler = cutscene.create();

// (Optional) Automatically stop once all events have finished running
cutsceneHandler.autoStop = true;

// Walk right event (ID: "walkRight")
cutsceneHandler.add(500, "walkRight", () => {
    cat.vx = SPEED;
});

// Sine zoom event (ID: "zoom")
cutsceneHandler.add(500, "zoom", () => {
    let t: number = 0;
    game.onUpdateInterval(25, () => {
        t += 0.1;
        // scary math stuff (ignore)
        cat.scale = 0.6 + ((0.7 - 0.6) / 2) * (Math.sin(t) + 1);
    });
});
cutsceneHandler.remove("zoom"); // Remove zoom event

// Stop event (ID: "stop")
cutsceneHandler.add(2000, "stop", () => {
    cat.vx = 0;
});

// Jump event (ID: "jump")
cutsceneHandler.add(2500, "jump", () => {
    cat.vy = -SPEED;
});


cutsceneHandler.add(2500, "jump", () => {
    music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.UntilDone)
});

// Fall event (ID: "fall")
cutsceneHandler.add(2700, "fall", () => {
    cat.vy = SPEED;
});

// Land event (ID: "land")
cutsceneHandler.add(2895, "land", () => {
    cat.vy = 0;
});

// Walk right again (ID: "walkRight")
cutsceneHandler.add(3100, "walkRight", () => {
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
