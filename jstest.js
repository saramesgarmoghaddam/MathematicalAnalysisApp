let currentSpace = 1;
const totalSpaces = 4;
let p5Instance = null;
let epsilon = 30;
const epsilonSlider = document.getElementById("epsilon");
const epsValue = document.getElementById("epsValue");
const badge = document.getElementById("point-type");
const detail = document.getElementById("result-detail");
const spaceInfo = document.getElementById("spaceInfo");

const spaceTitles = [
    "",
    "ℝ — بازه باز روی محور اعداد حقیقی",
    "ℝ² — شکل نامتقارن در صفحه",
    "ℝ³ — کره در فضای سه‌بعدی",
    "فضای گسسته  "
];

function removeCanvas() {
    if (p5Instance) {
        p5Instance.remove();
        p5Instance = null;
    }
}

function createSketch(space) {
    removeCanvas();
    spaceInfo.innerText = spaceTitles[space];
    badge.className = "badge neutral";
    badge.textContent = "هنوز نقطه‌ای انتخاب نشده";
    detail.textContent = "روی شکل کلیک کنید تا نقطه تحلیل شود";

    if (space === 1 || space === 2 || space === 4) {
        // 2D
        p5Instance = new p5((p) => {
            let selected = null;

            p.setup = () => {
                let c = p.createCanvas(820, 540);
                c.parent('canvas-holder');
            };

            p.draw = () => {
                p.background(11, 19, 36);
                p.translate(p.width/2, p.height/2);

                if (space === 1) {
                    // ℝ
                    p.stroke(200);
                    p.strokeWeight(2);
                    p.line(-400, 0, 400, 0);

                    p.stroke(255);
                    p.strokeWeight(4);
                    p.line(-180, -30, -180, 30);
                    p.line(180, -30, 180, 30);

                    p.fill(255);
                    p.noStroke();
                    p.textSize(32);
                    p.text("0", -180, 60);
                    p.text("1", 180, 60);

                    p.stroke(0, 255, 213);
                    p.strokeWeight(12);
                    p.line(-170, 0, 170, 0);

                    p.noFill();
                    p.stroke(255, 60, 60);
                    p.strokeWeight(4);
                    p.circle(-180, 0, 20);
                    p.circle(180, 0, 20);

                    p.fill(0, 255, 213);
                    p.noStroke();
                    p.textSize(40);
                    p.text("(0,1)", 0, -80);
                } else if (space === 2) {
                    p.stroke(200);
                    p.strokeWeight(2);
                    p.line(-400, 0, 400, 0);
                    p.line(0, -300, 0, 300);

                    p.fill(0, 255, 213, 150);
                    p.stroke(0, 255, 213);
                    p.strokeWeight(4);
                    p.beginShape();
                    p.vertex(-160, 50);
                    p.vertex(-120, -80);
                    p.vertex(20, -120);
                    p.vertex(170, -20);
                    p.vertex(90, 140);
                    p.vertex(-60, 120);
                    p.endShape(p.CLOSE);
                } else if (space === 4) {
                    p.stroke(200);
                    p.strokeWeight(2);
                    p.line(-400, 0, 400, 0);
                    p.line(0, -300, 0, 300);

                    p.fill(255, 100, 100);
                    p.noStroke();
                    for (let x = -5; x <= 5; x++) {
                        for (let y = -5; y <= 5; y++) {
                            if ((x + y) % 2 === 0) {
                                p.circle(x * 50, y * 50, 15);
                            }
                        }
                    }
                }

                if (selected) {
                    // نقطه قرمز
                    p.fill(255, 60, 60);
                    p.noStroke();
                    p.circle(selected.x, selected.y, 14);

                    // دایره همسایگی ε (فقط در فضاهای پیوسته)
                    if (space !== 4) {
                        p.noFill();
                        p.stroke(255, 255, 255, 120);
                        p.strokeWeight(2);
                        p.circle(selected.x, selected.y, epsilon * 2); // *2 چون مختصات از مرکز است
                    }

                    p.fill(255, 210, 80);
                    p.textSize(20);
                    p.text(badge.textContent, selected.x, selected.y - 40);
                }
            };

           p.mousePressed = () => {
    let mx = p.mouseX - p.width/2;
    let my = p.mouseY - p.height/2;

    if (space === 1) {
        // فقط نقاط تقریبا روی محور
        if (Math.abs(my) > 10) { // کمتر از 10 پیکسل خطا اجازه داده شود
            badge.textContent = "⚠️ فقط روی محور کلیک کنید!";
            badge.className = "badge neutral";
            detail.textContent = "در فضای ۱ بعدی، نقاط فقط روی محور اعداد معنی دارند.";
            selected = null;
            return;
        }

        selected = { x: mx, y: 0 }; // y=0 برای محور

        let dist = Math.abs(mx);
        if (dist < 170) {
            badge.textContent = "نقطه درونی";
            badge.className = "badge interior";
            detail.textContent = "هر همسایگی کوچک اطراف این نقطه کاملاً داخل بازه (0,1) است.";
        } else if (dist < 190) {
            badge.textContent = "نقطه مرزی";
            badge.className = "badge boundary";
            detail.textContent = "هر همسایگی از این نقطه هم داخل و هم خارج بازه را شامل می‌شود.";
        } else {
            badge.textContent = "نقطه بیرونی";
            badge.className = "badge exterior";
            detail.textContent = "یک همسایگی کوچک اطراف این نقطه کاملاً خارج از بازه است.";
        }
    } 
    // فضای ۲ و ۴ یا بعدی همان کد قبلی بدون تغییر
else if (space === 2) {
    const polyVertices = [
        {x:-160, y:50},
        {x:-120, y:-80},
        {x:20, y:-120},
        {x:170, y:-20},
        {x:90, y:140},
        {x:-60, y:120}
    ];

    // بررسی اینکه کلیک داخل محدوده قابل رسم است یا نه
    const canvasLimitX = 400;
    const canvasLimitY = 300;
    const mxRel = mx; // مختصات نسبت به مرکز
    const myRel = my;

    if (mxRel < -canvasLimitX || mxRel > canvasLimitX || myRel < -canvasLimitY || myRel > canvasLimitY) {
        // خارج از فضای رسم، هیچ تحلیلی انجام نشود
        selected = null;
        badge.textContent = "هنوز نقطه‌ای انتخاب نشده";
        badge.className = "badge neutral";
        detail.textContent = "روی شکل کلیک کنید تا نقطه تحلیل شود";
        return;
    }

    selected = { x: mxRel, y: myRel };

    function pointInPolygon(point, vs) {
        let x = point.x, y = point.y;
        let inside = false;
        for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            let xi = vs[i].x, yi = vs[i].y;
            let xj = vs[j].x, yj = vs[j].y;
            let intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    }

    function pointNearEdge(point, vs, margin) {
        for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            let xi = vs[i].x, yi = vs[i].y;
            let xj = vs[j].x, yj = vs[j].y;
            let A = {x: xi, y: yi};
            let B = {x: xj, y: yj};
            let dx = B.x - A.x;
            let dy = B.y - A.y;
            let t = ((point.x - A.x)*dx + (point.y - A.y)*dy)/(dx*dx + dy*dy);
            t = Math.max(0, Math.min(1, t));
            let closest = {x: A.x + t*dx, y: A.y + t*dy};
            let dist = Math.hypot(point.x - closest.x, point.y - closest.y);
            if (dist <= margin) return true;
        }
        return false;
    }

    const margin = 4;

    const inside = pointInPolygon(selected, polyVertices);
    const nearEdge = pointNearEdge(selected, polyVertices, margin);

    if (inside && nearEdge) {
        badge.textContent = "نقطه مرزی";
        badge.className = "badge boundary";
        detail.textContent = "هر همسایگی کوچک اطراف این نقطه هم داخل و هم خارج شکل را شامل می‌شود.";
    } else if (inside) {
        badge.textContent = "نقطه درونی";
        badge.className = "badge interior";
        detail.textContent = "هر همسایگی کوچک اطراف این نقطه کاملاً داخل شکل است.";
    } else if (!inside && nearEdge) {
        badge.textContent = "نقطه مرزی";
        badge.className = "badge boundary";
        detail.textContent = "هر همسایگی اطراف این نقطه هم داخل هم خارج شکل را قطع می کند";
    } else {
        badge.textContent = "نقطه بیرونی";
        badge.className = "badge exterior";
        detail.textContent = "یک همسایگی کوچک اطراف این نقطه وجود دارد که  کاملاً خارج از شکل است.";
    }
}

};

        });
    } else {
        // WEBGL برای فضای ۳
        p5Instance = new p5((p) => {
            let selected = null;

            p.setup = () => {
                let c = p.createCanvas(820, 540, p.WEBGL);
                c.parent('canvas-holder');
            };

            p.draw = () => {
                p.background(11, 19, 36);
                p.orbitControl();
                p.ambientLight(120);
                p.rotateY(p.frameCount * 0.01);
                p.rotateX(p.frameCount * 0.005);

                p.stroke(200);
                p.strokeWeight(2);
                p.line(-300, 0, 0, 300, 0, 0);
                p.line(0, -300, 0, 0, 300, 0);
                p.line(0, 0, -300, 0, 0, 300);

                p.noStroke();
                p.ambientMaterial(0, 255, 213);
                p.sphere(160);

                if (selected) {
                    // نقطه قرمز 3D
                    p.push();
                    p.translate(selected.x, selected.y, selected.z);
                    p.fill(255, 60, 60);
                    p.noStroke();
                    p.sphere(8);
                    p.pop();

                    // دایره همسایگی ε روی صفحه 2D (برای وضوح)
                    p.push();
                    p.resetMatrix();
                    p.noFill();
                    p.stroke(255, 255, 255, 120);
                    p.strokeWeight(2);
                    p.circle(selected.screenX, selected.screenY, epsilon * 2);
                    p.pop();
                }
            };

            p.mousePressed = () => {
                let mx = (p.mouseX / p.width) * 2 - 1;
                let my = -(p.mouseY / p.height) * 2 + 1;
                let vec = p.createVector(mx, my, 0);
                vec.normalize();
                vec.mult(160);

                selected = { x: vec.x, y: vec.y, z: vec.z, screenX: p.mouseX, screenY: p.mouseY };

                let d = vec.mag();
                if (d < 160) badge.textContent = "نقطه درونی";
                else if (Math.abs(d - 160) < 20) badge.textContent = "نقطه مرزی";
                else badge.textContent = "نقطه بیرونی";

                badge.className = badge.textContent.includes("درونی") ? "badge interior" :
                                  badge.textContent.includes("مرزی") ? "badge boundary" : "badge exterior";
            };
        });
    }
}

// اسلایدر ε — فقط مقدار رو بروز می‌کنه (دایره در draw بروز می‌شه)
epsilonSlider.addEventListener("input", () => {
    epsilon = Number(epsilonSlider.value);
    epsValue.textContent = epsilon;
});

// فلش‌ها
document.getElementById("prevBtn").addEventListener("click", () => {
    currentSpace = currentSpace === 1 ? totalSpaces : currentSpace - 1;
    createSketch(currentSpace);
});

document.getElementById("nextBtn").addEventListener("click", () => {
    currentSpace = currentSpace === totalSpaces ? 1 : currentSpace + 1;
    createSketch(currentSpace);
});

// شروع
createSketch(currentSpace);