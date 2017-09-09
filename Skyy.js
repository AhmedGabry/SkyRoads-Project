document.addEventListener("DOMContentLoaded", startGame, false);

var canvas;
var engine;
var activeScene;
var prevScene;
var isWPressed = false;
var isSPressed = false;
var isDPressed = false;
var isAPressed = false;
var isFPressed = false;
var isIPressed = false;
var isKPressed = false;
var isLPressed = false;
var isJPressed = false;
var isOPressed = false;
var multi = false;
var whatGravity = false;
var isDrunk = false;
var box;
var box2;
var particleSystem;
var roadMat;
var levels = [];
var camera;
var Game = {};
Game.scene = [];
Game.ind = 0;

Game.createHomeScene = function (){
    modifyText("LevelTitle", " ");
    modifyText("Timer", " ");
    modifyText("Message", " ");
    modifyText("FawzeyaMessage", " ");
    modifyText("Sama7Message", " ");
    modifyText("Instruction","press h for help !");
    setTimeout(function () {
        modifyText("Instruction"," ");
    }, 6500);
    var scene = new BABYLON.Scene(engine);
    var gravityVector = new BABYLON.Vector3(0,-40, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    engine.displayLoadingUI();
    activeScene = scene
    activeScene.enablePhysics(gravityVector, physicsPlugin);
    whatGravity = false;
    isDrunk = false;
    //Levels list
    var angle = 0;
    for(var i = 1; i <= 9; i++) {
        levels[i] = new BABYLON.Mesh.CreateSphere("lvl" + i, 30, 1.5, activeScene);
        levels[i].position = new BABYLON.Vector3(10 * Math.cos(angle), 1,10 * Math.sin(angle));
        angle -= 2 * Math.PI / 9;
        var lvlMat = new BABYLON.StandardMaterial("lvlMat", activeScene);
        lvlMat.diffuseTexture = new BABYLON.Texture("images/"+i+".jpg", activeScene);
        levels[i].material = lvlMat;
    }
    loadFawzya();
    setEnvironment("home");
    createGround(100,100,0,0,0,0,0,0);
    setTimeout(function () {
        engine.hideLoadingUI();
    }, 3500);
    var sceneIndex = Game.scene.push(scene) - 1;
    Game.scene[sceneIndex].renderLoop = function () {
        this.render();
        // applysskMovements();
        levels.forEach(function(element) {
                    if (box.intersectsMesh(element, false)) {
                        GroundsNum = 0; ObsNum = 0;
                        multi = false;
                        fCrashed = false;
                        sCrashed = false;
                        fFell = false;
                        sFell = false;
                        switch(element.name) {
                            case 'lvl1' :
                                Game.createLevel1();
                                break;
                            case 'lvl2' :
                                Game.createLevel2();
                                break;
                            case 'lvl3' :
                                Game.createLevel3();
                                break;
                            case 'lvl4' :
                                Game.createLevel4();
                                break;
                            case 'lvl5' :
                                Game.createLevel5();
                                break;
                            case 'lvl6' :
                                Game.createLevel6();
                                break;
                            case 'lvl7' :
                                Game.createLevel7();
                                break;
                            case 'lvl8' :
                                Game.createLevel8();
                                break;
                            case 'lvl9' :
                                Game.createLevel9();
                                break;
                            default :
                                break;
                        }
                        Game.ind+= 1;
                    }
        });
    }
    return scene;
}
var fCrashed = false;
var sCrashed = false;
var fFell = false;
var sFell = false
function checkObs(){
    if(multi){
        for(var i = 0 ; i < ObsNum ; i++) {
            if (box.intersectsMesh(Obstacles[i], false)) {
                Explosion(box);
                fCrashed = true;
                break;
            }
            if (box2.intersectsMesh(Obstacles[i], false)) {
                Explosion(box2);
                sCrashed = true;
                break;
            }
        }
    }else{
        for(var i = 0 ; i < ObsNum ; i++) {
            if (box.intersectsMesh(Obstacles[i], false)) {
                Explosion(box);
                setTimeout(function () {
                    Game.createHomeScene();
                    Game.ind += 1;
                }, 1500);
                break;
            }
        }
    }
    if (multi && (fCrashed || sCrashed)) {
        var FawzeyaMessage = document.getElementById("FawzeyaMessage");
        //FawzeyaMessage.hidden = false;

        var Sama7Message = document.getElementById("Sama7Message");
        //Sama7Message.hidden = false;

        if (fCrashed) {
            FawzeyaMessage.innerHTML = "Fawzeya 3'ory fe dahyaaaa ";
            Sama7Message.innerHTML = "CONGRATS!! Sama7";
        }

        else {
            FawzeyaMessage.innerHTML = "Sama7 3'ory fe dahyaaaa ";
            Sama7Message.innerHTML = "CONGRATS!! Fawzeya";
        }
        fCrashed = false;
        sCrashed = false;
        setTimeout(function () {
            FawzeyaMessage.innerHTML = "";
            Sama7Message.innerHTML = "";
            Game.createHomeScene();
            Game.ind += 1;
        }, 3000);
    }
}
function checkFall(yFall = 0){
    if(multi){
        if (box.position.y < yFall) {
            Explosion(box);
            setTimeout(function () {
                particleSystem.stop();
            }, 500);
            fFell = true;
        }
        if (box2.position.y < yFall) {
            Explosion(box2);
            setTimeout(function () {
                particleSystem.stop();
            }, 500);
            sFell = true;
        }
    }else {
        if (box.position.y < yFall) {
            Explosion(box);
            setTimeout(function () {
                Game.createHomeScene();
                Game.ind += 1;
            }, 1500);
        }
    }
    if (multi && (fFell || sFell)) {
        var FawzeyaMessage = document.getElementById("FawzeyaMessage");
        //FawzeyaMessage.hidden = false;

        var Sama7Message = document.getElementById("Sama7Message");
        //Sama7Message.hidden = false;

        if (fFell) {
            FawzeyaMessage.innerHTML = "Fawzeya 3'ory fe dahyaaaa ";
            Sama7Message.innerHTML = "CONGRATS!! Sama7";
        }
        else {
            FawzeyaMessage.innerHTML = "Sama7 3'ory fe dahyaaaa ";
            Sama7Message.innerHTML = "CONGRATS!! Fawzeya";
        }
        fFell = false;
        sFell = false;
        setTimeout(function () {
            FawzeyaMessage.innerHTML = "";
            Sama7Message.innerHTML = "";
            Game.createHomeScene();
            Game.ind += 1;
        }, 3000);
    }
}
function startGame() {
    canvas = document.getElementById("renderCanvas");
    engine = new BABYLON.Engine(canvas, true);
    // engine.displayLoadingUI();
    Game.createHomeScene();
    setListeners();
    // setTimeout(function () {particleSystem.start();},2000);
    engine.runRenderLoop(function () {
        applysskMovements();
        Game.scene[Game.ind].renderLoop();
        // console.log(box.position.y);
    });
}

function loadFawzya(){
    //FAW-zya
    box = new BABYLON.Mesh.CreateBox("Spaceship",1,activeScene);
    var bm = new BABYLON.StandardMaterial("BM",activeScene);
    bm.alpha = 0.1;
    box.scaling = new BABYLON.Vector3(0.3,0.3,0.3);
    box.position = new BABYLON.Vector3(0,0.3,0);
    box.material = bm;
    box.speed = 5;
    box.frontVector = new BABYLON.Vector3(0, 0, -1);
    box.yRotation = 0;
    box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 20, friction: 0.15, restitution: 0 }, activeScene);
    box.applyGravity = true;
    BABYLON.SceneLoader.ImportMesh("", "scenes/", "sg-light-destroyer.babylon", activeScene, onShipLoaded);
    function onShipLoaded(newMeshes, particeSystems,skeletons) {
        // newMeshes[0].scaling = new BABYLON.Vector3(0.3,0.3,0.3);
        newMeshes[0].parent = box;
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
    freeCamera = new BABYLON.FreeCamera("asd", new BABYLON.Vector3(0, 2, -5), activeScene);
    freeCamera.attachControl(canvas);
    camera = new BABYLON.FollowCamera("follow",
        new BABYLON.Vector3(0, 2, -5), activeScene);

    camera.lockedTarget = box;
    camera.radius = 10; // how far from the object to follow
    camera.heightOffset = 2; // how high above the object to place the camera
    camera.rotationOffset = 0; // the viewing angle
    camera.cameraAcceleration = 0.05 // how fast to move
    camera.maxCameraSpeed = 20 // speed limit
    activeScene.activeCameras.push(camera);
}

function Explosion(player){
    particleSystem = new BABYLON.ParticleSystem("particles", 2000, activeScene);
    particleSystem.particleTexture = new BABYLON.Texture("images/flare.png", activeScene);
    particleSystem.textureMask = new BABYLON.Color4(0.1, 0.8, 0.8, 1.0);
    particleSystem.emitter = player;
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
    particleSystem.start();
}
function applysskMovements() {
    var jump = 0.3;
    if (isFPressed && isWPressed && box.position.y < 0.5) {
        if(whatGravity)jump = 120;
        else jump = 60;
    }else {jump = 0.3;}

    if (isWPressed) {
        box.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(Number(box.frontVector.x) * -1 * box.speed,jump, Number(box.frontVector.z) *-1* box.speed));
    }
    if (isSPressed) {
        box.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(Number(box.frontVector.x)  * box.speed, Number(box.frontVector.y) * box.speed, Number(box.frontVector.z)  * box.speed));
    }
    if (isDPressed){
        if(isDrunk){box.yRotation -= .05;}
        else box.yRotation += .05;
    }
    if (isAPressed) {
        if(isDrunk){box.yRotation += .05;}
        else box.yRotation -= .05;
    }
    box.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(box.yRotation, 0, 0);
    box.frontVector.x = Math.sin(box.yRotation);
    box.frontVector.z = Math.cos(box.yRotation);

    if(multi){
        var jump2 = 0.3;
        if (isOPressed && isIPressed && box2.position.y < 0.5) {
            if(whatGravity)jump2 = 120;
            else jump2 = 60;
        }else {jump2 = 0.3;}

        if (isIPressed) {
            box2.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(Number(box2.frontVector.x) * -1 * box2.speed,jump2, Number(box2.frontVector.z) *-1* box2.speed));
        }
        if (isKPressed) {
            box2.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(Number(box2.frontVector.x)  * box2.speed, Number(box2.frontVector.y) * box2.speed, Number(box2.frontVector.z) * box2.speed));
        }
        if (isLPressed){
            if(isDrunk){box2.yRotation -= .05;}
            else box2.yRotation += .05;
        }
        if (isJPressed){
            if(isDrunk){box2.yRotation += .05;}
            else box2.yRotation -= .05;
        }
        box2.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(box2.yRotation, 0, 0);
        box2.frontVector.x = Math.sin(box2.yRotation);
        box2.frontVector.z = Math.cos(box2.yRotation);
    }
}

function setListeners(){
    document.addEventListener("keyup", function () {
        if (event.key == 'a' || event.key == 'A' || event.keyCode == '37') {isAPressed = false;}
        if (event.key == 's' || event.key == 'S' || event.keyCode == '40') {isSPressed = false;}
        if (event.key == 'd' || event.key == 'D' || event.keyCode == '39') {isDPressed = false;}
        if (event.key == 'w' || event.key == 'W' || event.keyCode == '38') {isWPressed = false;}
        if (event.key == 'f' || event.key == 'F' || event.keyCode == '32') {isFPressed = false;}

        if (event.key == 'i' || event.key == 'I') {isIPressed = false;}
        if (event.key == 'k' || event.key == 'K') {isKPressed = false;}
        if (event.key == 'j' || event.key == 'J') {isJPressed = false;}
        if (event.key == 'l' || event.key == 'L') {isLPressed = false;}
        if (event.key == 'o' || event.key == 'O') {isOPressed = false;}

        if ((event.key == 'm' || event.key == 'M') && !multi) {enableMulti(); multi = true;}
        if (event.key == 'C' || event.key == 'c'){activeScene.activeCameras.push(freeCamera);}
        if (event.key == 'V' || event.key == 'v'){activeScene.activeCameras.push(camera);}
        if (event.key == 'h' || event.key == 'H') {modifyText("Instruction", " ");}
    });
    document.addEventListener("keydown", function () {
        if (event.key == 'a' || event.key == 'A' || event.keyCode == '37') {isAPressed = true;}
        if (event.key == 's' || event.key == 'S' || event.keyCode == '40') {isSPressed = true;}
        if (event.key == 'd' || event.key == 'D' || event.keyCode == '39') {isDPressed = true;}
        if (event.key == 'w' || event.key == 'W' || event.keyCode == '38') {isWPressed = true;}
        if (event.key == 'f' || event.key == 'F' || event.keyCode == '32') {isFPressed = true;}

        if (event.key == 'i' || event.key == 'I') {isIPressed = true;}
        if (event.key == 'k' || event.key == 'K') {isKPressed = true;}
        if (event.key == 'j' || event.key == 'J') {isJPressed = true;}
        if (event.key == 'l' || event.key == 'L') {isLPressed = true;}
        if (event.key == 'o' || event.key == 'O') {isOPressed = true;}

        if (event.key == 'h' || event.key == 'H') {modifyText("Instruction", "well it's obvious ! don't fall ! avoid obstacles ! and win !! :D Player1 can use arrows and space or WASD and F, Player2 can use IJKL and O for jumping ! press m to enable Multiplayer press c for free camera and v for follow camera that's it !");}
    });
}

var Grounds = [];
var GroundsNum = 0;
function createGround(len,wid, xPos, yPos, zPos,rr,gg,bb, fric = 0.01){
    Grounds[GroundsNum] = new BABYLON.Mesh.CreateBox("Ground"+GroundsNum,1,activeScene);
    Grounds[GroundsNum].scaling = new BABYLON.Vector3(wid,0.1,len);
    Grounds[GroundsNum].position = new BABYLON.Vector3(xPos,yPos,zPos);
    roadMat = new BABYLON.StandardMaterial("RMat",activeScene);
    roadMat.alpha = 0.5;
    roadMat.diffuseColor = new BABYLON.Vector3(rr,gg,bb);
    Grounds[GroundsNum].checkCollisions = true;
    Grounds[GroundsNum].physicsImpostor = new BABYLON.PhysicsImpostor(Grounds[GroundsNum], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: fric, restitution: 0.01 }, activeScene);
    Grounds[GroundsNum].material = roadMat;
    GroundsNum++;
}

var Obstacles = [];
var ObsNum = 0;
function createObstacle(wid,hieght,len, xPos, yPos, zPos,rr,gg,bb,m = 200){
    Obstacles[ObsNum] = new BABYLON.Mesh.CreateBox("Obs",1,activeScene);
    Obstacles[ObsNum].scaling = new BABYLON.Vector3(wid,hieght,len);
    Obstacles[ObsNum].position = new BABYLON.Vector3(xPos,yPos,zPos);
    ObsMat = new BABYLON.StandardMaterial("ObsMat",activeScene);
    ObsMat.alpha = 1;
    ObsMat.diffuseColor = new BABYLON.Vector3(rr,gg,bb);
    Obstacles[ObsNum].checkCollisions = true;
    Obstacles[ObsNum].physicsImpostor = new BABYLON.PhysicsImpostor(Obstacles[ObsNum], BABYLON.PhysicsImpostor.BoxImpostor, { mass: m, friction: 1, restitution: 0.01 }, activeScene);
    Obstacles[ObsNum].material = ObsMat;
    ObsNum++;
}

Game.createLevel1 = function () { //"You Know What To Do !"
    var scene = new BABYLON.Scene(engine);
    var gravityVector = new BABYLON.Vector3(0,-40, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    modifyText("LevelTitle","'You Know What To Do!'");
    activeScene = scene
    activeScene.enablePhysics(gravityVector, physicsPlugin);
    loadFawzya();
    setEnvironment("1");
    createGround(100,5,0,0,0,1,1,1);
    createGround(50,5,10,0,0,1,0,0);
    createGround(50,5,-10,0,0,1,1,0);
    createGround(10,3,0,0,-60,1,1,1);
    createGround(10,3,0,0,-75,0,1,1);
    createGround(10,5,10,0,-90,1,1,1);
    createGround(10,5,-10,0,-90,1,1,1);
    createGround(10,3,0,0,-130,1,0,1);
    createGround(10,3,10,0,-135,0,0,1);
    createGround(10,5,-10,0,-135,0,0,1);
    createGround(20,5,0,0,-145,0,0.5,1);
    // createGround(15,15,0,0,-175,0.5,0,1);
    createGround(10,10,0,0,-165,0.5,0,1);
    createGround(10,10,10,0,-175,0.5,0,1);
    createGround(10,10,-10,0,-175,0.5,0,1);
    createGround(10,10,0,0,-185,0.5,0,1);
    createGround(20,8,0,0,-205,0,0.8,0.3);
    createGround(20,6,0,0,-225,0,0.8,0.3);
    createGround(20,4,0,0,-245,0,0.8,0.3);
    createGround(20,2,0,0,-265,0,0.8,0.3);
    createGround(20,1,0,0,-285,0,0.8,0.3);
    createGround(50,2,-5,0,-310,0.2,0.8,0.6);
    createGround(5,5,0,0,-335,0.2,0.8,0.6);
    createGround(50,2,5,0,-355,0.2,0.8,0.6);
    createGround(5,5,0,0,-380,0.2,0.8,0.6);
    var sceneIndex = Game.scene.push(scene) - 1;
    Game.scene[sceneIndex].renderLoop = function () {
        this.render();
        checkFall();
        checkObs();
        if(multi){
            if (box2.intersectsMesh(Grounds[23], false)) {
                modifyText("FawzeyaMessage", "Fawzeya 3'ory fe dahyaaaa");
                modifyText("Sama7Message", "CONGRATS!! Sama7");
                setTimeout(function () {
                    Game.createHomeScene();
                    Game.ind += 1;
                }, 3000);
            }
            else if(box.intersectsMesh(Grounds[23], false)){
                modifyText("FawzeyaMessage", "Sama7 3'ory fe dahyaaaa");
                modifyText("Sama7Message", "CONGRATS!! Fawzya");
                setTimeout(function () {
                    Game.createHomeScene();
                    Game.ind += 1;
                }, 3000);
            }
        }
        else {
            if (box.intersectsMesh(Grounds[23], false)) {
                modifyText("Message", "CONGRATULATIONS!! You win.");
                setTimeout(function () {
                    Game.createHomeScene();
                    Game.ind += 1;
                }, 3000);
            }
        }
    }
    return scene;
}
Game.createLevel2 = function () { //"TWO is my lucky number"
    var scene = new BABYLON.Scene(engine);
    var gravityVector = new BABYLON.Vector3(0,-40, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    var count = 0;
    var count2 = 0;
    modifyText("LevelTitle", "'Two is your my number'");
    activeScene = scene
    activeScene.enablePhysics(gravityVector, physicsPlugin);
    loadFawzya();
    setEnvironment("2");
    createGround(50,5,0,0,-25,1,1,1);
    createGround(5,50,27.5,0,-47.5,1,1,1);
    createGround(50,5,50,0,-75,1,1,1);
    createGround(5,100,2.5,0,-102.5,1,1,1);
    createGround(2,50,-72.5,0,-102.5,1,1,1);
    createGround(100,4,-99.5,0,-53.5,1,1,1);
    createGround(3.5,99,-52,0,-1.75,1,1,1);
    var sceneIndex = Game.scene.push(scene) - 1;
    Game.scene[sceneIndex].renderLoop = function () {
        this.render();
        checkFall();
        if (box.intersectsMesh(Grounds[0], false)&& box.intersectsMesh(Grounds[6], false)){count++;}
        if(multi){
            if (box2.intersectsMesh(Grounds[0], false)&& box2.intersectsMesh(Grounds[6], false)){count2++;}
            if (count2 == 3) {
                modifyText("FawzeyaMessage", "Fawzeya 3'ory fe dahyaaaa");
                modifyText("Sama7Message", "CONGRATS!! Sama7");
                setTimeout(function () {
                    Game.createHomeScene();
                    Game.ind += 1;
                }, 3000);
            }
            else if(count == 3){
                modifyText("FawzeyaMessage", "Sama7 3'ory fe dahyaaaa");
                modifyText("Sama7Message", "CONGRATS!! Fawzya");
                setTimeout(function () {
                    Game.createHomeScene();
                    Game.ind += 1;
                }, 3000);
            }
        }
        else {
            if (count == 3) {
                modifyText("Message", "CONGRATULATIONS!! You win.");
                setTimeout(function () {
                    Game.createHomeScene();
                    Game.ind += 1;
                }, 3000);
            }
        }
    }
    return scene;
}

Game.createLevel3 = function () { //"Porsche with no brakes"
    var scene = new BABYLON.Scene(engine);
    var gravityVector = new BABYLON.Vector3(0,-40, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    modifyText("LevelTitle", "'Porsche with no brakes'");
    activeScene = scene
    activeScene.enablePhysics(gravityVector, physicsPlugin);
    loadFawzya();
    setEnvironment("3");
    createGround(100, 5, 0, 0, 0, 1, 1, 1, 0);
    createGround(10, 100, -52.5, 0, -45, 1, 1, 1, 0);
    createGround(100, 10, -97.5, 0, -100, 1, 1, 1, 0);
    createGround(10, 100, -52.5, 0, -155, 1, 1, 1, 0);
    createGround(100, 5, 0, 0, -200, 1, 1, 1, 0);
    createGround(5, 100, -52.5, 0, -247.5, 1, 1, 1, 0);
    createGround(100, 2, -103.5, 0, -295, 1, 1, 1, 0);
    createGround(2, 100, -52.5, 0, -344, 1, 1, 1, 0);
    createGround(100, 2, -1.5, 0, -393, 1, 1, 1, 0)
    var sceneIndex = Game.scene.push(scene) - 1;
    Game.scene[sceneIndex].renderLoop = function () {
        this.render();
        checkFall();
        if(multi){
            if (box2.intersectsMesh(Grounds[8], false)) {
                modifyText("FawzeyaMessage", "Fawzeya 3'ory fe dahyaaaa");
                modifyText("Sama7Message", "CONGRATS!! Sama7");
                setTimeout(function () {
                    Game.createHomeScene();
                    Game.ind += 1;
                }, 3000);
            }
            else if(box.intersectsMesh(Grounds[8], false)){
                modifyText("FawzeyaMessage", "Sama7 3'ory fe dahyaaaa");
                modifyText("Sama7Message", "CONGRATS!! Fawzya");
                setTimeout(function () {
                    Game.createHomeScene();
                    Game.ind += 1;
                }, 3000);
            }
        }
        else {
            if (box.intersectsMesh(Grounds[8], false)) {
                modifyText("Message", "CONGRATULATIONS!! You win.");
                setTimeout(function () {
                    Game.createHomeScene();
                    Game.ind += 1;
                }, 3000);
            }
        }
    }
    return scene;
}

Game.createLevel4 = function () { //"Let go, trust me"
    var scene = new BABYLON.Scene(engine);
    var gravityVector = new BABYLON.Vector3(0,-40, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    var letGo = false;
    var letGo2 = false;
    modifyText("LevelTitle", "'Let go, trust me!'");
    activeScene = scene
    activeScene.enablePhysics(gravityVector, physicsPlugin);
    loadFawzya();
    setEnvironment("4");
    createGround(50,5,0,0,-20,0.7,0.7,0.3);
    createGround(10,4,4.5,0,-50,0.7,0.7,0.3);
    createGround(10,4,-4.5,0,-50,0.7,0.7,0.3);
    createGround(10,4,8.5,0,-60,0.7,0.7,0.3);
    createGround(10,4,-8.5,0,-60,0.7,0.7,0.3);
    createGround(10,4,12.5,0,-70,0.7,0.7,0.3);
    createGround(10,4,-12.5,0,-70,0.7,0.7,0.3);
    createGround(30,3,12.5,0,-95,0.7,0.7,0.3);
    createGround(30,3,-12.5,0,-95,0.7,0.7,0.3);
    createGround(30,2,12.5,0,-133,0.7,0.7,0.3);
    createGround(30,2,-12.5,0,-133,0.7,0.7,0.3);
    createGround(30,10,0,0,-168,0.7,0.7,0.3);
    createObstacle(2,2,1,4,0,-160,1,0,0);
    createObstacle(2,2,1,2,0,-161,1,0,0);
    createObstacle(2,2,1,0,0,-162,1,0,0);
    createObstacle(2,2,1,-4,0,-167,1,0,0);
    createObstacle(2,2,1,-2,0,-168,1,0,0);
    createObstacle(2,2,1,0,0,-169,1,0,0);
    createObstacle(2,2,1,4,0,-174,1,0,0);
    createObstacle(2,2,1,2,0,-175,1,0,0);
    createObstacle(2,2,1,0,0,-176,1,0,0);
    createGround(5,5,0,0,-190,0.7,0.7,0.3);
    createGround(5,5,0,0,-200,0.7,0.7,0.3);
    var sceneIndex = Game.scene.push(scene) - 1;
    Game.scene[sceneIndex].renderLoop = function () {
        this.render();
            if(multi){
                if (box2.intersectsMesh(Grounds[13], false)){letGo2 = true;}
                if (box2.position.y < -10 && letGo2) {
                    modifyText("FawzeyaMessage", "Fawzeya 3'ory fe dahyaaaa");
                    modifyText("Sama7Message", "CONGRATS!! Sama7");
                    setTimeout(function () {
                        Game.createHomeScene();
                        Game.ind += 1;
                    }, 3000);
                }
                else if(box.position.y < -10 && letGo){
                    modifyText("FawzeyaMessage", "Sama7 3'ory fe dahyaaaa");
                    modifyText("Sama7Message", "CONGRATS!! Fawzya");
                    setTimeout(function () {
                        Game.createHomeScene();
                        Game.ind += 1;
                    }, 3000);
                }
            }
            else {
                if (box.position.y < -10 && letGo) {
                    modifyText("Message", "CONGRATULATIONS!! You win.");
                    setTimeout(function () {
                        Game.createHomeScene();
                        Game.ind += 1;
                    }, 3000);
                }
            }
            checkObs();
            checkFall();
        if (box.intersectsMesh(Grounds[13], false)){letGo = true;}
    }
    return scene;
}
Game.createLevel5 = function () { //"just give up this time"
    var scene = new BABYLON.Scene(engine);
    var gravityVector = new BABYLON.Vector3(0,-40, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    modifyText("LevelTitle", "'Just give up this time'");
    activeScene = scene
    activeScene.enablePhysics(gravityVector, physicsPlugin);
    loadFawzya();
    setEnvironment("5");
    createGround(300, 60, 0, 0, -140, 1, 1, 1);
    //wid, hieght, len, xPos, yPos, zPos, rr, gg, bb, m = 200
    createObstacle(20 , 3 , 5, -20 , 5 , -20 , 0.3, 0, 0.4);
    createObstacle(20, 3 , 5, 20 , 5 , -20 , 0.3, 0, 0.4);
    createObstacle(45 , 3 , 5, 7.5 , 5 , -40 , 0.3, 0, 0.4);
    createObstacle(45 , 3 , 5, -7.5 , 5 , -60 , 0.3, 0, 0.4);
    createObstacle(15 , 3 , 5, 22.5 , 5 , -80 , 0.3, 0, 0.4);
    createObstacle(15 , 3 , 5, -7.5 , 5 , -80 , 0.3, 0, 0.4);
    createObstacle(45 , 3 , 5, 7.5 , 5 , -100 , 0.3, 0, 0.4);
    createObstacle(28 , 3 , 5, 16 , 5 , -120 , 0.3, 0, 0.4);
    createObstacle(18 , 3 , 5, -21 , 5 , -120 , 0.3, 0, 0.4);
    createObstacle(12 , 3, 5, -24 , 5 , -140 , 0.3, 0, 0.4);
    createObstacle(12 , 3 , 5, 0, 5 , -140 , 0.3, 0, 0.4);
    createObstacle(12 , 3  , 5, 24, 5 , -140 , 0.3, 0, 0.4);
    createObstacle(20 , 3 , 5, -20, 5 , -160, 0.3, 0, 0.4);
    createObstacle(20 , 3 , 5, 20, 5 , -160 , 0.3, 0, 0.4);
    createObstacle(20, 3, 5, -20, 5, -180, 0.3, 0, 0.4);
    createObstacle(20, 3, 5, 20, 5, -180, 0.3, 0, 0.4);
    createObstacle(45, 3, 5, 7.5, 5, -200, 0.3, 0, 0.4);
    createObstacle(45, 3, 5, -7.5, 5, -220, 0.3, 0, 0.4);
    createObstacle(15, 3, 5, 22.5, 5, -240, 0.3, 0, 0.4);
    createObstacle(15, 3, 5, -7.5, 5, -240, 0.3, 0, 0.4);
    var sceneIndex = Game.scene.push(scene) - 1;
    Game.scene[sceneIndex].renderLoop = function () {
        this.render();
        checkObs();
        if(multi){
            if (box2.position.y < -10) {
                modifyText("FawzeyaMessage", "Fawzeya 3'ory fe dahyaaaa");
                modifyText("Sama7Message", "CONGRATS!! Sama7");
                setTimeout(function () {
                    Game.createHomeScene();
                    Game.ind += 1;
                }, 3000);
            }
            else if(box.position.y < -10){
                modifyText("FawzeyaMessage", "Sama7 3'ory fe dahyaaaa");
                modifyText("Sama7Message", "CONGRATS!! Fawzya");
                setTimeout(function () {
                    Game.createHomeScene();
                    Game.ind += 1;
                }, 3000);
            }
        }
        else {
            if (box.position.y < -10) {
                modifyText("Message", "CONGRATULATIONS!! You win.");
                setTimeout(function () {
                    Game.createHomeScene();
                    Game.ind += 1;
                }, 3000);
            }
        }
    }
    return scene;
}
Game.createLevel6 = function () { //"after 6th bottle of vodka"
    var scene = new BABYLON.Scene(engine);
    var gravityVector = new BABYLON.Vector3(0,-40, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    isDrunk = true;
    modifyText("LevelTitle", "'After the 5th bottle of Vodka'");
    activeScene = scene
    activeScene.enablePhysics(gravityVector, physicsPlugin);
    loadFawzya();
    setEnvironment("6");
    createGround(50,5,0,0,-20,0.9,0.72,0.18);
    createGround(10,3,-5,0,-55,0.9,0.72,0.18);
    createGround(10,3,0,0,-70,0.9,0.72,0.18);
    createGround(10,3,5,0,-85,0.9,0.72,0.18);
    createGround(5,3,0,0,-100,0.9,0.72,0.18);
    createGround(5,3,-5,0,-115,0.9,0.72,0.18);
    createGround(30,10,0,0,-140,0.9,0.72,0.18);
    createObstacle(7,2,2,1.5,0,-126,0.55,0.77,0.11);
    createObstacle(7,2,2,-1.5,0,-132,0.55,0.77,0.11);
    createObstacle(7,2,2,1.5,0,-138,0.55,0.77,0.11);
    createObstacle(7,2,2,-1.5,0,-144,0.55,0.77,0.11);
    createGround(4,10,-15,0,-155,0.9,0.72,0.18);
    createGround(4,10,-30,0,-165,0.9,0.72,0.18);
    createObstacle(1,1,1,-30,0,-164,0.9,0.72,0.18);
    createGround(4,10,-45,0,-175,0.9,0.72,0.18);
    createGround(4,10,-60,0,-165,0.9,0.72,0.18);
    createObstacle(1,1,1,-60,0,-166,0.9,0.72,0.18);
    createGround(4,10,-75,0,-155,0.9,0.72,0.18);

    var sceneIndex = Game.scene.push(scene) - 1;
    Game.scene[sceneIndex].renderLoop = function () {
        this.render();
        checkFall();
        checkObs();
        if(multi){
            if (box2.intersectsMesh(Grounds[11], false)) {
                modifyText("FawzeyaMessage", "Fawzeya 3'ory fe dahyaaaa");
                modifyText("Sama7Message", "CONGRATS!! Sama7");
                setTimeout(function () {
                    Game.createHomeScene();
                    Game.ind += 1;
                }, 3000);
            }
            else if(box.intersectsMesh(Grounds[11], false)){
                modifyText("FawzeyaMessage", "Sama7 3'ory fe dahyaaaa");
                modifyText("Sama7Message", "CONGRATS!! Fawzya");
                setTimeout(function () {
                    Game.createHomeScene();
                    Game.ind += 1;
                }, 3000);
            }
        }
        else {
            if (box.intersectsMesh(Grounds[11], false)) {
                modifyText("Message", "CONGRATULATIONS!! You win.");
                setTimeout(function () {
                    Game.createHomeScene();
                    Game.ind += 1;
                }, 3000);
            }
        }
    }
    return scene;
}

Game.createLevel7 = function () { //"what gravity ?!"
    var scene = new BABYLON.Scene(engine);
    var gravityVector = new BABYLON.Vector3(0,-40, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    modifyText("LevelTitle", "'Gravity! ...What Gravity ?!'" );
    activeScene = scene
    activeScene.enablePhysics(gravityVector, physicsPlugin);
    loadFawzya();
    setEnvironment("7");
    whatGravity = true;
    createGround(50, 30, 0, 0, -20, 0.6, 0.7, 0.3);
    createGround(30, 25, 0, 0, -80, 0.6, 0.7, 0.3);
    createGround(10, 30, -37.5, 0, -120, 0.7, 0.7, 0.3);
    createGround(10, 30, 37.5, 0, -120, 0.7, 0.7, 0.3);
    createGround(100, 15, -37.5, 0, -195, 0.7, 0.7, 0.3);
    createGround(100, 15, 37.5, 0, -195, 0.7, 0.7, 0.3);
    createGround(25, 20, 0, 0, -195, 0.7, 0.7, 0.3);
    createGround(50, 20, 0, 0, -262.5, 0.7, 0.7, 0.3);
    createGround(30, 50, 0, 0, -322.5, 0.7, 0.7, 0.3);
    createGround(20, 10, 40, 0, -367.5, 0.7, 0.7, 0.3);
    createGround(20, 10, -40, 0, -367.5, 0.7, 0.7, 0.3);
    //               w   h  l x  y    z  r       b        g
    createObstacle(20, 4, 3, 0, 2, -25, 72 / 255, 244 / 255, 66 / 255);
    createObstacle(10, 4, 2, 0, 2, -80, 72 / 255, 244 / 255, 66 / 255);
    createObstacle(5, 4, 5, -30, 2, -120, 72 / 255, 244 / 255, 66 / 255);
    createObstacle(5, 4, 5, -45, 2, -120, 72 / 255, 244 / 255, 66 / 255);
    createObstacle(5, 4, 5, 30, 2, -120, 72 / 255, 244 / 255, 66 / 255);
    createObstacle(5, 4, 5, 45, 2, -120, 72 / 255, 244 / 255, 66 / 255);
    createObstacle(10, 4, 5, -37.5, 2, -205, 72 / 255, 244 / 255, 66 / 255);
    createObstacle(10, 4, 5, 37.5, 2, -205, 72 / 255, 244 / 255, 66 / 255);
    createObstacle(10, 4, 5, 0, 2, -262.5, 72 / 255, 244 / 255, 66 / 255);
    createObstacle(30, 4, 2.5, 0, 2, -322.5, 72 / 255, 244 / 255, 66 / 255);
    var sceneIndex = Game.scene.push(scene) - 1;
    Game.scene[sceneIndex].renderLoop = function () {
        this.render();
        checkObs();
        checkFall();
        if(multi){
            if (box2.intersectsMesh(Grounds[10], false)) {
                modifyText("FawzeyaMessage", "Fawzeya 3'ory fe dahyaaaa");
                modifyText("Sama7Message", "CONGRATS!! Sama7");
                setTimeout(function () {
                    Game.createHomeScene();
                    Game.ind += 1;
                }, 3000);
            }
            else if(box.intersectsMesh(Grounds[10], false)){
                modifyText("FawzeyaMessage", "Sama7 3'ory fe dahyaaaa");
                modifyText("Sama7Message", "CONGRATS!! Fawzya");
                setTimeout(function () {
                    Game.createHomeScene();
                    Game.ind += 1;
                }, 3000);
            }
        }
        else {
            if (box.intersectsMesh(Grounds[10], false)) {
                modifyText("Message", "CONGRATULATIONS!! You win.");
                setTimeout(function () {
                    Game.createHomeScene();
                    Game.ind += 1;
                }, 3000);
            }
        }
    }
    return scene;
}

Game.createLevel8 = function () { //"Gone in 60 seconds"
    var scene = new BABYLON.Scene(engine);
    var gravityVector = new BABYLON.Vector3(0,-40, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    modifyText("LevelTitle", "'Gone in 60 seconds'" );
    activeScene = scene
    activeScene.enablePhysics(gravityVector, physicsPlugin);
    loadFawzya();
    setEnvironment("8");

    createGround(60, 5, 0, 0, 0, 0.7, 0.7, 0.3);
    createGround(5, 30, -17.5, 0, 0, 0.7, 0.7, 0.3);
    createGround(5, 50, -27.5, 0, -27.5, 0.7, 0.7, 0.3);
    createGround(22.5, 5, -15, 0, -13.75, 0.7, 0.7, 0.3);
    createGround(5, 50, -27.5, 0, 15, 0.7, 0.7, 0.3);
    createGround(22.5, 5, -27.5, 0, -13.75, 0.7, 0.7, 0.3);
    createGround(10, 5, -15, 0, 7.5, 0.7, 0.7, 0.3);
    createGround(10, 5, -27.5, 0, 7.5, 0.7, 0.7, 0.3);
    createGround(15, 5, -27.5, 0, 25, 0.7, 0.7, 0.3);
    createGround(47.7, 5, -55, 0, -6, 0.7, 0.7, 0.3);
    createGround(5, 10, -62.5, 0, -9.5, 0.7, 0.7, 0.3);
    createGround(45, 5.5, -70, 0, 10.5, 0.7, 0.7, 0.3);
    createGround(20, 10, -45, 0, 30, 0.7, 0.7, 0.3);
    var timer = 60;
    var time = 60;
    var stopTimer = false;
    modifyText("Timer", "Time: "+time);
    var sceneIndex = Game.scene.push(scene) - 1;
    Game.scene[sceneIndex].renderLoop = function () {
        this.render();
        checkFall();
        timer -= 1;
        if (timer == 0 && !stopTimer) {
            time--;
            modifyText("Timer", "Time: " + time);
            timer = 60;
        }
        if (time == 0) {
            stopTimer = true;
            modifyText("Message", "Tick tock, time's up");
            setTimeout(function () {
                Game.createHomeScene();
                Game.ind += 1;
            }, 3000);
        }
        if(multi){
            if (box2.intersectsMesh(Grounds[8], false)) {
                modifyText("FawzeyaMessage", "Fawzeya 3'ory fe dahyaaaa");
                modifyText("Sama7Message", "CONGRATS!! Sama7");
                setTimeout(function () {
                    Game.createHomeScene();
                    Game.ind += 1;
                }, 3000);
            }
            else if(box.intersectsMesh(Grounds[8], false)){
                modifyText("FawzeyaMessage", "Sama7 3'ory fe dahyaaaa");
                modifyText("Sama7Message", "CONGRATS!! Fawzya");
                setTimeout(function () {
                    Game.createHomeScene();
                    Game.ind += 1;
                }, 3000);
            }
        }
        else {
            if (box.intersectsMesh(Grounds[8], false)) {
                modifyText("Message", "CONGRATULATIONS!! You win.");
                setTimeout(function () {
                    Game.createHomeScene();
                    Game.ind += 1;
                }, 3000);
            }
        }
    }
    return scene;
}

Game.createLevel9 = function () { //"built TOUGH"
    var scene = new BABYLON.Scene(engine);
    var gravityVector = new BABYLON.Vector3(0,-40, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    modifyText("LevelTitle", "'Built TOUGH'");
    activeScene = scene
    activeScene.enablePhysics(gravityVector, physicsPlugin);
    loadFawzya();
    setEnvironment("9");
    createGround(30,5,0,0,-10,158/255,5/255,0);
    createGround(30,10,0,0,-45,158/255,5/255,0);
    createObstacle(2,2,2,0,0,-38,91/255,2/255,0,1);
    createObstacle(2,2,2,2,0,-40,91/255,2/255,0,1);
    createObstacle(2,2,2,-2,0,-40,91/255,2/255,0,1);
    createObstacle(2,2,2,4,0,-42,91/255,2/255,0,1);
    createObstacle(2,2,2,-4,0,-42,91/255,2/255,0,1);
    createGround(50,2,0,0,-90,158/255,5/255,0);
    createObstacle(2,0.5,1,0,0,-75,91/255,2/255,0,1);
    createObstacle(2,0.7,1,0,0,-83,91/255,2/255,0,1);
    createObstacle(2,1,1,0,0,-90,91/255,2/255,0,1);
    createObstacle(2,1.2,1,0,0,-97,91/255,2/255,0,1);
    createObstacle(2,1.5,1,0,0,-105,91/255,2/255,0,1);
    createGround(50,20,0,0,-145,158/255,5/255,0);
    createObstacle(4,5,3,-4,0,-130,91/255,2/255,0,10);
    createObstacle(4,5,1,4,0,-130,91/255,2/255,0,10);
    createObstacle(5,3,2,-2,0,-140,91/255,2/255,0,10);
    createObstacle(1,4,2,2,0,-140,91/255,2/255,0,10);
    createObstacle(1,1,6,0,0,-145,91/255,2/255,0,10);
    createObstacle(4,3,5,2,0,-150,91/255,2/255,0,10);
    createObstacle(2,5,1,-2,0,-150,91/255,2/255,0,10);
    createObstacle(5,2,3,4,0,-160,91/255,2/255,0,10);
    createObstacle(3,5,3,-4,0,-160,91/255,2/255,0,10);
    createGround(30,2,0,0,-190,158/255,5/255,0);
    createObstacle(2,1.5,1,0,0,-180,91/255,2/255,0,10);
    createObstacle(2,2,1,0,0,-185,91/255,2/255,0,10);
    createObstacle(2,2,1,0,0,-190,91/255,2/255,0,10);
    createObstacle(2,2.5,1,0,0,-200,91/255,2/255,0,10);
    createGround(5,5,0,0,-215,158/255,5/255,0);
    var sceneIndex = Game.scene.push(scene) - 1;
    Game.scene[sceneIndex].renderLoop = function () {
        this.render();
        checkFall();
        if(multi){
            if (box2.intersectsMesh(Grounds[5], false)) {
                modifyText("FawzeyaMessage", "Fawzeya 3'ory fe dahyaaaa");
                modifyText("Sama7Message", "CONGRATS!! Sama7");
                setTimeout(function () {
                    Game.createHomeScene();
                    Game.ind += 1;
                }, 3000);
            }
            else if(box.intersectsMesh(Grounds[5], false)){
                modifyText("FawzeyaMessage", "Sama7 3'ory fe dahyaaaa");
                modifyText("Sama7Message", "CONGRATS!! Fawzya");
                setTimeout(function () {
                    Game.createHomeScene();
                    Game.ind += 1;
                }, 3000);
            }
        }
        else {
            if (box.intersectsMesh(Grounds[5], false)) {
                modifyText("Message", "CONGRATULATIONS!! You win.");
                setTimeout(function () {
                    Game.createHomeScene();
                    Game.ind += 1;
                }, 3000);
            }
        }
    }
    return scene;
}
function enableMulti(){
    //Sama7
    box2 = new BABYLON.Mesh.CreateBox("Spaceship2",1,activeScene);
    var bm2 = new BABYLON.StandardMaterial("BM",activeScene);
    bm2.alpha = 0.1;
    box2.scaling = new BABYLON.Vector3(0.3, 0.3, 0.3);
    box2.position = new BABYLON.Vector3(0,0.3,-2);
    box2.material = bm2;
    box2.speed = 5;
    box2.frontVector = new BABYLON.Vector3(0, 0, -1);
    box2.yRotation = 0;
    box2.physicsImpostor = new BABYLON.PhysicsImpostor(box2, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 20, friction: 0.15, restitution: 0 }, activeScene);
    box2.applyGravity = true;
    BABYLON.SceneLoader.ImportMesh("", "scenes/", "sg-light-destroyer.babylon", activeScene, onShipLoaded);
    function onShipLoaded(newMeshes, particeSystems,skeletons) {
        newMeshes[0].parent = box2;
    }
    var camera2 = new BABYLON.FollowCamera("follow",
        new BABYLON.Vector3(0, 2, -5), activeScene);
    camera2.lockedTarget = box2;
    camera2.radius = 10; // how far from the object to follow
    camera2.heightOffset = 2; // how high above the object to place the camera
    camera2.rotationOffset = 0; // the viewing angle
    camera2.cameraAcceleration = 0.05 // how fast to move
    camera2.maxCameraSpeed = 20 // speed limit
    activeScene.activeCameras.push(camera2);
    camera2.viewport = new BABYLON.Viewport(0.5,0,0.5,1);
    camera.viewport = new BABYLON.Viewport(0,0,0.5,1);
}
function modifyText(componentName,message)
{
    var component = document.getElementById(componentName);
    component.innerHTML = message;
}