//three.js实现三维场景
//COLORS
var Colors = {
    red:0xf25346,
    white:0xd8d0d1,
    brown:0x59332e,
    pink:0xF5986E,
    brownDark:0x23190f,
    blue:0x68c3c0,
    green:0x009900,
};
//场景、相机、渲染器
var scene, camera, renderer, container;
//屏幕的尺寸
var HEIGHT, WIDTH;
//创建场景，包括相机、渲染器等
HEIGHT = window.innerHeight;
WIDTH = window.innerWidth;
//场景
scene = new THREE.Scene();
//创建相机
var aspectRatio = WIDTH / HEIGHT;
var fieldOfView = 60;
var nearPlane = 1;
var farPlane = 1000;
camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
    );
camera.position.set(0,200,600);
//renderer，透明、抗锯齿
renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(WIDTH, HEIGHT);
renderer.shadowMap.enabled = true;//允许投射阴影
//获取HTML中的一个容器，放置canvas
document.body.appendChild(renderer.domElement);
//创建光源，实现光照效果
var ambientLight, directionalLight;
//环境光，设置不产生阴影
ambientLight=new THREE.AmbientLight(0x444444);
scene.add(ambientLight);
//平行光，设置产生阴影
directionalLight = new THREE.DirectionalLight(0xffffff, .9);
directionalLight.position.set(300, 100, 300);
directionalLight.castShadow = true;
directionalLight.shadow.camera.left = -400;
directionalLight.shadow.camera.right = 400;
directionalLight.shadow.camera.top = 400;
directionalLight.shadow.camera.bottom = -400;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 1000;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);

//创建一个平面
var floor = new THREE.PlaneGeometry(600, 600);
var floormaterial = new THREE.MeshPhongMaterial({color:0xd7e0f7});
var floormesh = new THREE.Mesh(floor, floormaterial);
floormesh.rotateX(-Math.PI/2);
floormesh.position.y = -100;
floormesh.receiveShadow = true;
floormesh.castShadow = true;
scene.add(floormesh);

//立方体
var box = new THREE.BoxGeometry(30, 30, 30, 10, 10, 10);
//进行纹理贴图
var texture1 = THREE.ImageUtils.loadTexture("./resource/crate.jpg");
var texture2 = THREE.ImageUtils.loadTexture("./resource/crate.jpg");
var texture3 = THREE.ImageUtils.loadTexture("./resource/crate.jpg");
var texture4 = THREE.ImageUtils.loadTexture("./resource/crate.jpg");
var texture5 = THREE.ImageUtils.loadTexture("./resource/crate.jpg");
var texture6 = THREE.ImageUtils.loadTexture("./resource/crate.jpg");
var materialArr=[
    new THREE.MeshPhongMaterial({map:texture1}),
    new THREE.MeshPhongMaterial({map:texture2}),
    new THREE.MeshPhongMaterial({map:texture3}),
    new THREE.MeshPhongMaterial({map:texture4}),
    new THREE.MeshPhongMaterial({map:texture5}),
    new THREE.MeshPhongMaterial({map:texture6})
];
var facematerial=new THREE.MeshFaceMaterial(materialArr);
var boxmesh = new THREE.Mesh(box, facematerial);
boxmesh.position.y = -85;
//允许投射阴影
boxmesh.castShadow = true;
boxmesh.receiveShadow = true;
scene.add(boxmesh);

//球体，作为太阳，按一定轨迹运动，并且平行光光源也随之运动
var sphere = new THREE.SphereGeometry(25,40,40);
var spherematerial = new THREE.MeshLambertMaterial({
    color:0xff0000,
});
var spheremesh = new THREE.Mesh(sphere, spherematerial)
spheremesh.scale.set(0.5, 0.5, 0.5);
spheremesh.position.set(300, 100, 300);
scene.add(spheremesh);
//光源的移动轨迹, 先生成一条线，沿着这条线移动
var lightPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(300,100,300),
    new THREE.Vector3(200,130,200),
    new THREE.Vector3(0,150,0),
    new THREE.Vector3(-200,130,-200),
    new THREE.Vector3(-300,100,-300)
]);
var geomLine = new THREE.Geometry();
geomLine.vertices = lightPath.getPoints(50);
var matLine = new THREE.LineBasicMaterial({color : 0x0000ff});
var line = new THREE.Line(geomLine, matLine);
// scene.add(line);

//绘制一辆车：三个立方体和四个圆柱体组成
var carmesh = new THREE.Object3D();
//驾驶舱
var geomCockpit = new THREE.BoxGeometry(25, 18, 25);
var matCockpit = new THREE.MeshPhongMaterial({color:Colors.red});
var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
cockpit.receiveShadow = true;
cockpit.castShadow = true;
carmesh.add(cockpit);
//车头
var geomCarhead = new THREE.BoxGeometry(25, 18, 15);
var matCarhead = new THREE.MeshPhongMaterial({color:Colors.white});
//调整部分点的位置，使立方体发生形变
geomCarhead.vertices[1].y-=7;
geomCarhead.vertices[1].x-=2;
geomCarhead.vertices[4].y-=7;
geomCarhead.vertices[4].x+=2;
var carhead = new THREE.Mesh(geomCarhead, matCarhead);
carhead.position.z = -20;
carhead.receiveShadow = true;
carhead.castShadow = true;
carmesh.add(carhead);
//创建一个与车头同样大小同样位置的不可见立方体，用于碰撞检测
var collisionCubeGeom = new THREE.BoxGeometry(25, 18, 15, 10, 10, 10);
var collisionCubeMat = new THREE.MeshBasicMaterial({color: 0xfff000});
var collisionCube = new THREE.Mesh(collisionCubeGeom, collisionCubeMat);
collisionCube.position.set(0, -84, 252.5);
//车尾
var geomCartail = new THREE.BoxGeometry(25, 18, 15);
var matCartail = new THREE.MeshPhongMaterial({color:Colors.white});
geomCartail.vertices[0].y-=5;
geomCartail.vertices[0].x-=2;
geomCartail.vertices[5].y-=5;
geomCartail.vertices[5].x+=2;
var cartail = new THREE.Mesh(geomCartail, matCartail);
cartail.position.z = 20;
cartail.receiveShadow = true;
cartail.castShadow = true;
carmesh.add(cartail);
//车轮:左前，右前，左后，右后
var geomTire1 = new THREE.CylinderGeometry(7,7,2,40);
var matTire1 = new THREE.MeshPhongMaterial({color:Colors.brownDark});
var tire1 = new THREE.Mesh(geomTire1, matTire1);
tire1.position.set(-12.5, -9, -12.5);
tire1.rotateZ(Math.PI/2);
tire1.receiveShadow = true;
tire1.castShadow = true;
carmesh.add(tire1);

var geomTire2 = new THREE.CylinderGeometry(7,7,2,40);
var matTire2 = new THREE.MeshPhongMaterial({color:Colors.brownDark});
var tire2 = new THREE.Mesh(geomTire2, matTire2);
tire2.position.set(12.5, -9, -12.5);
tire2.rotateZ(Math.PI/2);
tire2.receiveShadow = true;
tire2.castShadow = true;
carmesh.add(tire2);

var geomTire3 = new THREE.CylinderGeometry(7,7,2,40);
var matTire3 = new THREE.MeshPhongMaterial({color:Colors.brownDark});
var tire3 = new THREE.Mesh(geomTire3, matTire3);
tire3.position.set(-12.5, -9, 12.5);
tire3.rotateZ(Math.PI/2);
tire3.receiveShadow = true;
tire3.castShadow = true;
carmesh.add(tire3);

var geomTire4 = new THREE.CylinderGeometry(7,7,2,40);
var matTire4 = new THREE.MeshPhongMaterial({color:Colors.brownDark});
var tire4 = new THREE.Mesh(geomTire4, matTire4);
tire4.position.set(12.5, -9, 12.5);
tire4.rotateZ(Math.PI/2);
tire4.receiveShadow = true;
tire4.castShadow = true;
carmesh.add(tire4);

carmesh.position.set(0, -84, 272.5);
carmesh.receiveShadow = true;
carmesh.castShadow = true;
scene.add(carmesh);

//绘制一颗树, 圆柱和锥形组成,Group与Object3D作用相同
var tree = new THREE.Group();
//树干
var geomTrunk = new THREE.CylinderGeometry(6, 6, 30);
var matTrunk = new THREE.MeshLambertMaterial({color:Colors.brown});
var trunk = new THREE.Mesh(geomTrunk, matTrunk);
trunk.castShadow = true;
trunk.receiveShadow = true;
tree.add(trunk);
//树叶， 三部分组合而成
var geomLeaves1 = new THREE.ConeGeometry(20, 30, 8);
var matLeaves1 = new THREE.MeshLambertMaterial({color:0x006600});
var bottomLeaves = new THREE.Mesh(geomLeaves1, matLeaves1);
bottomLeaves.receiveShadow = true;
bottomLeaves.castShadow = true;
bottomLeaves.position.y = 25;
tree.add(bottomLeaves);

var geomLeaves2 = new THREE.ConeGeometry(17, 30, 8);
var matLeaves2 = new THREE.MeshLambertMaterial({color:0x006600});
var middleLeaves = new THREE.Mesh(geomLeaves2, matLeaves2);
middleLeaves.receiveShadow = true;
middleLeaves.castShadow = true;
middleLeaves.position.y = 40;
tree.add(middleLeaves);

var geomLeaves3 = new THREE.ConeGeometry(15, 30, 8);
var matLeaves3 = new THREE.MeshLambertMaterial({color:0x006600});
var topLeaves = new THREE.Mesh(geomLeaves3, matLeaves3);
topLeaves.receiveShadow = true;
topLeaves.castShadow = true;
topLeaves.position.y = 55;
tree.add(topLeaves);

tree.position.set(-100, -85, -100);
scene.add(tree);

//粒子系统下雪效果
var snowCount = 2000;
var geomsnow = new THREE.Geometry();
var matsnow = new THREE.PointsMaterial({
    size: 10,
    map: THREE.ImageUtils.loadTexture("./resource/snow.png"),
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity:0.8,
});

for(var p=0; p<snowCount; p++){
    //在平面所在的空间范围内随机创建雪花
    var pX = Math.random()*600-300;
    var pY = Math.random()*500;
    var pZ = Math.random()*600-300;
    var vertice = new THREE.Vector3(pX, pY, pZ);
    //移动速度
    vertice.velocityY = 0.1+Math.random() / 3;
    vertice.velocityX = (Math.random() - 0.5) / 3;
    geomsnow.vertices.push(vertice);
}

var snow = new THREE.Points(geomsnow, matsnow);

scene.add(snow);
//更新每个雪花的位置
function updateSnow(){
    var vertices = snow.geometry.vertices;
    vertices.forEach(function(v){
        v.y = v.y - (v.velocityY);
        v.x = v.x - (v.velocityX);
        if(v.y<=-100){
            v.y = 500;
        }
        if(v.x<=-300||v.x>=300){
            //碰到边界，水平方向调整为相反方向
            v.velocityX = v.velocityX*-1;
        }
    });
    snow.geometry.verticesNeedUpdate = true;
}

//进行碰撞检测
var collideMeshList = [];
collideMeshList.push(boxmesh, trunk);//将立方体和数作为检测的对象
var crash = false;

function collisionDetect(){
    var originPoint = collisionCube.position.clone();
    for (var vertexIndex = 0; vertexIndex < collisionCube.geometry.vertices.length; vertexIndex++) {
        // 顶点原始坐标
        var localVertex = collisionCube.geometry.vertices[vertexIndex].clone();
        // 顶点经过变换后的坐标
        var globalVertex = localVertex.applyMatrix4(collisionCube.matrix);
        var directionVector = globalVertex.sub(collisionCube.position);
        var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
        var collisionResults = ray.intersectObjects(collideMeshList);
        if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
            crash = true;
            break;
        }
        crash = false;
    }
    if(crash){
        //发生碰撞后回到最初位置
        carmesh.position.set(0, -84, 272.5);
        collisionCube.position.set(0, -84, 252.5);
    }
}


//gui控件的对象变量
var boxguicontrols = {
    转速: 0,
    缩放: 1,
};
var groundguicontrols = {
    缩放: 1,
    颜色: floormaterial.color.getStyle(),
};
var sphereguicontrols = {
    缩放: 1,
    颜色: spherematerial.color.getStyle(),
};

var gui = new dat.GUI();
//设置交互界面位置
gui.domElement.style = 'position:absolute;top:0px;right:0px';

var floorfolder = gui.addFolder("ground");
floorfolder.add(groundguicontrols, '缩放', 0.5, 2);
floorfolder.addColor(groundguicontrols, '颜色');
floorfolder.open();

var spherefolder = gui.addFolder("sphere");
spherefolder.add(sphereguicontrols, '缩放', 0.5, 2);
spherefolder.addColor(sphereguicontrols, '颜色');
spherefolder.open();

var boxfolder = gui.addFolder("box");
boxfolder.add(boxguicontrols, '缩放', 0.5, 2);
boxfolder.add(boxguicontrols, '转速', {静止: 0, 低速: 0.005, 中速: 0.05, 高速: 0.2});
boxfolder.open();

//根据gui的设置更新物体
function guiUpdate(){
    boxmesh.scale.set(boxguicontrols.缩放, boxguicontrols.缩放, boxguicontrols.缩放);
    boxmesh.rotateY(boxguicontrols.转速);
    floormesh.scale.set(groundguicontrols.缩放, groundguicontrols.缩放, groundguicontrols.缩放);
    floormaterial.color.setStyle(groundguicontrols.颜色);
    spheremesh.scale.set(sphereguicontrols.缩放, sphereguicontrols.缩放, sphereguicontrols.缩放);
    spherematerial.color.setStyle(sphereguicontrols.颜色);

}

//pos记录球体和平行光光源在轨迹上的位置， 0<=pos<1
var pos = 0;
function render(){
    renderer.render(scene, camera);
    //沿着轨迹移动光源和球体
    pos+=0.001;
    if(pos<1){
        var point = lightPath.getPointAt(pos);//在line上取点作为球体和光源的位置
        spheremesh.position.set(point.x, point.y, point.z);
        directionalLight.position.set(point.x, point.y, point.z);
    }else{
        pos = 0;
    }
    updateSnow();
    guiUpdate();
    collisionDetect();
    requestAnimationFrame(render);
}

//鼠标的位置
var mousePos = {x: 0, y: 0};

function handleMouseMove(event){
    //进行坐标系的转换， 更新鼠标的位置
    var tx = -1 + (event.clientX / WIDTH)*2;
    var ty = 1 - (event.clientY / HEIGHT)*2;
    mousePos = {x:tx, y:ty};
}

//按键检测, 控制小车移动, 若移动超出平面的一端边界，则回到另一端的边界
document.onkeydown = function(e) {
    switch (e.key) {
        case "w":
            carmesh.translateZ(-4);
            collisionCube.translateZ(-4);
            if(carmesh.position.z < -272.5){
                carmesh.position.z = 272.5;
                collisionCube.position.z = 252.5;
            }
            break;
        case "s":
            carmesh.translateZ(4);
            collisionCube.translateZ(4);
            if(carmesh.position.z > 272.5){
                carmesh.position.z = -272.5;
                collisionCube.position.z = -292.5;
            }
            break;
        case "a":
            carmesh.translateX(-4);
            collisionCube.translateX(-4);
            if(carmesh.position.x<-287.5){
                carmesh.position.x = 287.5;
                collisionCube.position.x = 287.5;
            }
            break;
        case "d":
            carmesh.translateX(4);
            collisionCube.translateX(4);
            if(carmesh.position.x > 287.5){
                carmesh.position.x = -287.5;
                collisionCube.position.x = -287.5;
            }
            break;
        default:
            break;
    }
};

render();
//创建控件对象, 可通过鼠标拖拽、滚轮、方向键等从不同的角度观察场景
var orbitcontrols = new THREE.OrbitControls(camera, renderer.domElement);