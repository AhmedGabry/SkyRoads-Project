document.addEventListener("DOMContentLoaded", startGame, false);

var canvas;
var engine;
var activeScene,scene;
var isWPressed = false;
var isSPressed = false;
var isDPressed = false;
var isAPressed = false;
var isJPressed = false;
var box;
var particleSystem;
var roadMat;
var r;

function startGame() {
    canvas = document.getElementById("renderCanvas");
    engine = new BABYLON.Engine(canvas, true);
    scene = new BABYLON.Scene(engine);
    activeScene = scene;
    engine.displayLoadingUI();

    setListeners();
    var gravityVector = new BABYLON.Vector3(0,-40, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    activeScene.enablePhysics(gravityVector, physicsPlugin);

    //Road
    // r = new BABYLON.Mesh.CreateGround("R",50,50,1000,activeScene);
    // r.position = new BABYLON.Vector3(0,-1,-10);
    // r.physicsImpostor = new BABYLON.PhysicsImpostor(r, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.1, restitution: 0 }, activeScene);
    // r.checkCollisions = true;
    var le = new BABYLON.Mesh.CreateSphere("lvl", 30, 1.5, activeScene);
    le.applyGravity = true;
    le.checkCollisions = true;
    le.position = new BABYLON.Vector3(0,10,-3);
    le.physicsImpostor = new BABYLON.PhysicsImpostor(le, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 3, friction: 0, restitution: 0.9 }, activeScene);
    // var road = new BABYLON.Mesh.CreateBox("portal",1,activeScene);
    // road.scaling = new BABYLON.Vector3(5,0.1,100);
    // road.position = new BABYLON.Vector3(0,0,0);
    // var roadMat = new BABYLON.StandardMaterial("RMat",activeScene);
    // roadMat.alpha = 0.2;
    // road.material = roadMat;
    // road.checkCollisions = true;
    // road.physicsImpostor = new BABYLON.PhysicsImpostor(road, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.01, restitution: 0 }, activeScene);
    // // road.ellipsoid = new BABYLON.Vector3(3,0.1,20);
    // road.ellipsoidOffset = new BABYLON.Vector3(0,0,0);
    // drawEllipsoid(road);

    //Levels list
    var levels = [];
    for(var i = 0; i < 14; i++) {
        levels[i] = new BABYLON.Mesh.CreateSphere("lvl" + i, 30, 1.5, activeScene);// last 2 lvls have the same lvl13 name ?!
        levels[i].position = new BABYLON.Vector3(-2, 1,-(5 + i*3));
        var lvlMat = new BABYLON.StandardMaterial("lvlMat", activeScene);
        lvlMat.diffuseTexture = new BABYLON.Texture("images/"+i+".jpg", activeScene);
        levels[i].material = lvlMat;
        levels[i].checkCollisions = true;
    }

    loadFawzya();
    setEnvironment("home");
    Explosion();
    createGround(100,5,0,0,1,1,1);
    createGround(50,5,10,0,1,0,0);
    createGround(50,5,-10,0,0,0,0);
    setTimeout(function () {engine.hideLoadingUI();}, 2000);
    engine.runRenderLoop(function () {
        activeScene.render();
        applysskMovements();
    });
}

function loadFawzya(){
    //FAW-zya
    box = new BABYLON.Mesh.CreateBox("Spaceship",1,activeScene);
    var bm = new BABYLON.StandardMaterial("BM",activeScene);
    bm.alpha = 0.1;
    box.scaling = new BABYLON.Vector3(0.3, 0.3, 0.3);
    box.position = new BABYLON.Vector3(0,0.3,0);
    box.material = bm;
    box.ellipsoid = new BABYLON.Vector3(3, 1, 3);
    box.ellipsoidOffset = new BABYLON.Vector3(0, 0, 0);
    box.speed = 5;
    box.frontVector = new BABYLON.Vector3(0, 0, -1);
    box.yRotation = 0;
    // box.checkCollisions = true;
    box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 20, friction: 0.15, restitution: 0 }, activeScene);
    box.applyGravity = true;
    BABYLON.SceneLoader.ImportMesh("", "scenes/", "sg-light-destroyer.babylon", activeScene, onShipLoaded);
    function onShipLoaded(newMeshes, particeSystems,skeletons) {
        newMeshes[0].parent = box;
    }
    box.onCollide = function(mesh){
        console.log("tank collided with " + mesh.name);
        particleSystem.start();
    }
}

function setEnvironment(imgName){
    //Background
    var background = new BABYLON.Layer("back", "images/"+imgName+".jpg", activeScene);
    background.isBackground = true;
    background.texture.level = 0;

    //Light
    var light1 = new BABYLON.HemisphericLight("l1", new BABYLON.Vector3(0, 5, 0), activeScene);

    //Camera
    // var camera = new BABYLON.FreeCamera("follow", new BABYLON.Vector3(0, 2, 0), activeScene);
    // camera.attachControl(canvas);
    var camera = new BABYLON.FollowCamera("follow",
        new BABYLON.Vector3(0, 2, -5), activeScene);
    camera.lockedTarget = box;
    camera.radius = 10; // how far from the object to follow
    camera.heightOffset = 2; // how high above the object to place the camera
    camera.rotationOffset = 0; // the viewing angle
    camera.cameraAcceleration = 0.05 // how fast to move
    camera.maxCameraSpeed = 20 // speed limit
}

function Explosion(){
    particleSystem = new BABYLON.ParticleSystem("particles", 2000, activeScene);
    particleSystem.particleTexture = new BABYLON.Texture("images/flare.png", activeScene);
    particleSystem.textureMask = new BABYLON.Color4(0.1, 0.8, 0.8, 1.0);
    particleSystem.emitter = box;
    // particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, 0); // Starting all From
    // particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 0); // To...
    particleSystem.color1 = new BABYLON.Color4(1, 0, 0, 0);
    particleSystem.color2 = new BABYLON.Color4(1, 200/255, 0, 0);
    particleSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);
    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 0.3;
    particleSystem.minLifeTime = 0.3;
    particleSystem.maxLifeTime = 0.7;
    particleSystem.emitRate = 2000;
    particleSystem.direction1 = new BABYLON.Vector3(-7, 8, 8);
    particleSystem.direction2 = new BABYLON.Vector3(7, 8, -8);
    particleSystem.gravity = new BABYLON.Vector3(0, 9.81, 0);
}
function applysskMovements() {
    var jump = 0.3;
    if (isJPressed && box.position.y <= 0.22 && isWPressed) {
        // var jump = new BABYLON.Animation("myAnimation","position.y",2,BABYLON.Animation.ANIMATIONTYPE_FLOAT,BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        // var jumpKeys = [];
        // jumpKeys.push({frame:0, value:box.position.y});
        // jumpKeys.push({frame:1, value:box.position.y+5});
        // jumpKeys.push({frame:2, value:box.position.y});
        // jump.setKeys(jumpKeys);
        // box.animations = [];
        // box.animations.push(jump);
        // activeScene.beginAnimation(box,0,2,true);
        // box.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(Number(box.frontVector.x) * -1 * box.speed, 15, Number(box.frontVector.z) *-1* box.speed));
        // box.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, 500, 0), box.getAbsolutePosition());
        jump = 60;
    }else {jump = 0.3;}

    if (isWPressed) {
        // box.moveWithCollisions(box.frontVector.multiplyByFloats(box.speed, box.speed, box.speed));//3ayzen n accelerate !
        box.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(Number(box.frontVector.x) * -1 * box.speed,jump, Number(box.frontVector.z) *-1* box.speed));
    }
    if (isSPressed) {
        // var reverseVector = box.frontVector.multiplyByFloats(-1, 1, -1).multiplyByFloats(box.speed, box.speed, box.speed);
        // box.moveWithCollisions(reverseVector);
        box.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(Number(box.frontVector.x)  * box.speed, Number(box.frontVector.y) * box.speed, Number(box.frontVector.z)  * box.speed));
    }
    if (isDPressed)
        // box.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(1,0,0));
        // box.rotation.y += .1 ;
        box.yRotation += .01;
    if (isAPressed)
        // box.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(-1,0,0));
        // box.rotation.y -= .1 ;
        box.yRotation -= .01;
    box.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(box.yRotation, 0, 0);
    box.frontVector.x = Math.sin(box.yRotation);
    box.frontVector.z = Math.cos(box.yRotation);
}

function setListeners(){
    document.addEventListener("keyup", function () {
        if (event.key == 'a' || event.key == 'A') {isAPressed = false;}
        if (event.key == 's' || event.key == 'S') {isSPressed = false;}
        if (event.key == 'd' || event.key == 'D') {isDPressed = false;}
        if (event.key == 'w' || event.key == 'W') {isWPressed = false;}
        if (event.key == 'j' || event.key == 'J') {isJPressed = false;}
    });

    document.addEventListener("keydown", function () {
        if (event.key == 'a' || event.key == 'A') {isAPressed = true;}
        if (event.key == 's' || event.key == 'S') {isSPressed = true;}
        if (event.key == 'd' || event.key == 'D') {isDPressed = true;}
        if (event.key == 'w' || event.key == 'W') {isWPressed = true;}
        if (event.key == 'j' || event.key == 'J') {isJPressed = true;}
    });
}

var Grounds = [];
var GroundsNum = 0;
function createGround(len,wid, xPos, zPos,rr,gg,bb){
    Grounds[GroundsNum] = new BABYLON.Mesh.CreateBox("Ground",1,activeScene);
    Grounds[GroundsNum].scaling = new BABYLON.Vector3(wid,0.1,len);
    Grounds[GroundsNum].position = new BABYLON.Vector3(xPos,0,zPos);
    roadMat = new BABYLON.StandardMaterial("RMat",activeScene);
    roadMat.alpha = 0.5;
    roadMat.diffuseColor = new BABYLON.Vector3(rr,gg,bb);
    Grounds[GroundsNum].checkCollisions = true;
    Grounds[GroundsNum].physicsImpostor = new BABYLON.PhysicsImpostor(Grounds[GroundsNum], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.01, restitution: 0.01 }, activeScene);
    Grounds[GroundsNum].material = roadMat;
    GroundsNum++;
}