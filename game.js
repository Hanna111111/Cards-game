var Tile = function(x, y, face) {
    this.x = x;
    this.y = y;
    this.face = face;
    this.width = 70;
};

Tile.prototype.drawFaceDown = function() {
    fill(245, 245, 201);
    stroke(255, 247, 0);
    rect(this.x, this.y, this.width, this.width, 30);
    image(getImage("cute/Star"), this.x, this.y, this.width, this.width);
    this.isFaceUp = false;
};

Tile.prototype.drawFaceUp = function() {
    fill(201, 211, 245);
    stroke(0, 17, 255);
    strokeWeight(4);
    rect(this.x, this.y, this.width, this.width, 10);
    image(this.face, this.x, this.y, this.width, this.width);
    this.isFaceUp = true;
};

Tile.prototype.isUnderMouse = function(x, y) {
    return x >= this.x && x <= this.x + this.width  &&
        y >= this.y && y <= this.y + this.width;
};

// Declare an array of all possible faces
var faces = [
    getImage("avatars/primosaur-seed"),
    getImage("avatars/primosaur-sapling"),
    getImage("avatars/primosaur-seedling"),
    getImage("avatars/primosaur-tree"),
    getImage("avatars/primosaur-ultimate"),
    getImage("avatars/purple-pi"),
    getImage("avatars/purple-pi-pink"),
    getImage("avatars/purple-pi-teal"),
    getImage("avatars/leaf-yellow"),
    getImage("avatars/spunky-sam-orange")
];

// Make an array which has 2 of each, then randomize it
var possibleFaces = faces.slice(0);
var selected = [];
for (var i = 0; i < 10; i++) {
    // Randomly pick one from the array of remaining faces
    var randomInd = floor(random(possibleFaces.length));
    var face = possibleFaces[randomInd];
    // Push 2 copies onto array
    selected.push(face);
    selected.push(face);
    // Remove from array
    possibleFaces.splice(randomInd, 1);
}

// Now we need to randomize the array
selected.sort(function() {
    return 0.5 - Math.random();
});

// Create the tiles
var tiles = [];
for (var i = 0; i < 5; i++) {
    for (var j = 0; j < 4; j++) {
        tiles.push(new Tile(i * 95 + 20, j * 95 + 20, selected.pop()));
    }
}

background(62, 60, 166);

// Now draw them face up
for (var i = 0; i < tiles.length; i++) {
    tiles[i].drawFaceDown();
}

var flippedTiles = [];
var delayStartFC = null;

mouseClicked = function() {
    for (var i = 0; i < tiles.length; i++) {
        if (tiles[i].isUnderMouse(mouseX, mouseY)) {
            if (flippedTiles.length < 2 && !tiles[i].isFaceUp) {
                tiles[i].drawFaceUp();
                flippedTiles.push(tiles[i]);
                if (flippedTiles.length === 2) {
                    if (flippedTiles[0].face === flippedTiles[1].face) {
                        flippedTiles[0].isMatch = true;
                        flippedTiles[1].isMatch = true;
                    }
                    delayStartFC = frameCount;
                    loop();
                }
            } 
        }
    }
};

draw = function() {
    if (delayStartFC && (frameCount - delayStartFC) > 40) {
        for (var i = 0; i < tiles.length; i++) {
            if (!tiles[i].isMatch) {
                tiles[i].drawFaceDown();
            }
        }
        flippedTiles = [];
        delayStartFC = null;
        noLoop();
    }
};
