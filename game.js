const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

// タッチ位置
let touchX = null;

// タッチ開始
canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();

    const rect = canvas.getBoundingClientRect();
    touchX = e.touches[0].clientX - rect.left;
});

// タッチ移動
canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();

    const rect = canvas.getBoundingClientRect();
    touchX = e.touches[0].clientX - rect.left;
});

// タッチ終了
canvas.addEventListener("touchend", () => {
    touchX = null;
});

// プレイヤー
const player = {
    x: 190,
    y: 550,
    width: 100,
    height: 100,
    speed: 5
};

// プレイヤー画像
const suicuneImage = new Image();
suicuneImage.src = "suicune.png";

const enteiImage = new Image();
enteiImage.src = "entei.png";

const raikouImage = new Image();
raikouImage.src = "raikou.png";

// 弾
const bullets = [];

// 敵
const enemies = [];

// 敵弾用配列
const enemyBullets = [];

// スコア
let score = 0;
let life = 3;
let invincible = false;

// キー入力
const keys = {};

document.addEventListener("keydown", (e) => {
    keys[e.key] = true;

    if (  keys [" "]) {


    // スイクン
    if (life >= 3) {

        bullets.push({
            x: player.x + 20,
            y: player.y,
            width: 4,
            height: 10,
            vx: -1
        });

        bullets.push({
            x: player.x + 50,
            y: player.y,
            width: 4,
            height: 10,
            vx: 0
        });

        bullets.push({
            x: player.x + 80,
            y: player.y,
            width: 4,
            height: 10,
            vx: 1
        });

    }

    // エンテイ
    else if (life == 2) {

        for(let i = -2; i <= 2; i++){

            bullets.push({
                x: player.x + 50,
                y: player.y,
                width: 4,
                height: 10,
                vx: i
            });

        }

    }

 　　// ライコウ
　　　else if (life == 1) {

    bullets.push({
        x: player.x + 50,
        y: player.y,
        width: 12,
        height: 30,
        vx: 0
    });

}

    }

}

);

document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

// 敵弾発射
function shootEnemyBullet(enemy) {

    enemyBullets.push({
        x: enemy.x + 20,
        y: enemy.y + 40,
        width: 6,
        height: 6,
        vx: -2,
        vy: 4
    });

    enemyBullets.push({
        x: enemy.x + 20,
        y: enemy.y + 40,
        width: 6,
        height: 6,
        vx: 0,
        vy: 4
    });

    enemyBullets.push({
        x: enemy.x + 20,
        y: enemy.y + 40,
        width: 6,
        height: 6,
        vx: 2,
        vy: 4
    });
}

// 敵生成
function spawnEnemy() {

    enemies.push({
        x: Math.random() * (canvas.width - 40),
        y: -40,
        width: 40,
        height: 40,
        speed: 2
    });

}

setInterval(spawnEnemy, 1000);

// 当たり判定
function collision(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

// 更新処理
function update() {

    // 移動
    if (keys["ArrowLeft"]) player.x -= player.speed;
    if (keys["ArrowRight"]) player.x += player.speed;
    if (keys["ArrowUp"]) player.y -= player.speed;
    if (keys["ArrowDown"]) player.y += player.speed;

    // スマホ操作
if (touchX !== null) {
    player.x = touchX - player.width / 2;
}

    // 画面外に出ない
    if (player.x < 0) player.x = 0;
    if (player.x > canvas.width - player.width)
        player.x = canvas.width - player.width;

    if (player.y < 0) player.y = 0;
    if (player.y > canvas.height - player.height)
        player.y = canvas.height - player.height;

    player.x = Math.max(
    0,
    Math.min(canvas.width - player.width, player.x)
);
    // 弾移動
bullets.forEach(bullet => {
    bullet.x += bullet.vx || 0;
    bullet.y -= 8;
});

    // 弾削除
    for (let i = bullets.length - 1; i >= 0; i--) {
        if (bullets[i].y < -20) {
            bullets.splice(i, 1);
        }
    }

    // 敵移動
    enemies.forEach(enemy => {
        enemy.y += enemy.speed;

        if(Math.random() < 0.003){
            shootEnemyBullet(enemy);
        }
    });

    // 敵削除
    for (let i = enemies.length - 1; i >= 0; i--) {
        if (enemies[i].y > canvas.height + 50) {
            enemies.splice(i, 1);
        }
    }

　　//ヒットボックス
const hitbox = {
    x: player.x + 40,
    y: player.y + 40,
    width: 20,
    height: 20
};

    // 衝突判定
    for (let i = enemies.length - 1; i >= 0; i--) {

        for (let j = bullets.length - 1; j >= 0; j--) {

            if (collision(bullets[j], enemies[i])) {

                enemies.splice(i, 1);
                bullets.splice(j, 1);

                score += 100;

                break;
            }
        }
    }

    enemyBullets.forEach(bullet => {
    bullet.x += bullet.vx;
    bullet.y += bullet.vy;
});

for (let i = enemyBullets.length - 1; i >= 0; i--) {

    if (enemyBullets[i].y > canvas.height) {

        enemyBullets.splice(i, 1);

    } else if (
        collision(hitbox, enemyBullets[i]) &&
        !invincible
    ) {

        enemyBullets.splice(i, 1);

        life--;

        invincible = true;

        setTimeout(() => {
            invincible = false;
        }, 1000);

    }

}  

}


// 描画
function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // プレイヤー
let currentImage;

if (life >= 3) {
    currentImage = suicuneImage;
}
else if (life == 2) {
    currentImage = enteiImage;
}
else {
    currentImage = raikouImage;
}

ctx.drawImage(
    currentImage,
    player.x,
    player.y,
    player.width,
    player.height
);

ctx.fillStyle = "lime";

//デバック
// ctx.fillRect(
//     player.x + 40,
//     player.y + 40,
//     20,
//     20);

    // 弾
   if (life == 1) {
    ctx.fillStyle = "cyan";
}
else {
    ctx.fillStyle = "yellow";
}

    bullets.forEach(bullet => {
        ctx.fillRect(
            bullet.x,
            bullet.y,
            bullet.width,
            bullet.height
        );
    });

    // 敵

    ctx.fillStyle = "orange";

enemyBullets.forEach(bullet => {

    ctx.fillRect(
        bullet.x,
        bullet.y,
        bullet.width,
        bullet.height
    );

});
    ctx.fillStyle = "red";

    enemies.forEach(enemy => {
        ctx.fillRect(
            enemy.x,
            enemy.y,
            enemy.width,
            enemy.height
        );
    });

    // スコア
    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText("SCORE : " + score, 10, 30);
    ctx.fillText("LIFE : " + life, 10, 60);
    // ゲームオーバー表示
    if (life <= 0) {
        ctx.fillStyle = "red";
        ctx.font = "48px Arial";
        
        ctx.fillText(
            "GAME OVER",
            100,
            320
        );
    }

}

// メインループ
function gameLoop() {

    if (life <= 0) {
        draw();
        return;
    }

    update();
    draw();

    requestAnimationFrame(gameLoop);
}


gameLoop();