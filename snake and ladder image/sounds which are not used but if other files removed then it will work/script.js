function rando() {
    let a = Math.random();
    return (Math.floor(a * 6) + 1);
}

let turn = 0;
let alfa = document.getElementsByClassName("dice")[0].addEventListener("click", () => {
    animatedice()
    setTimeout(() => {

        document.getElementsByClassName("dicero")[0].innerHTML = "";
        document.getElementsByClassName("snake")[0].innerHTML = "";
        document.getElementsByClassName("ladder")[0].innerHTML = "";

        let b = rando()
        document.getElementsByClassName("dice")[0].style.backgroundImage = `url("snake and ladder image/dice${b}.png")`
        let turponu = Number(document.getElementById(`player${turn + 1}`).parentElement.childElementCount)
        console.log(turponu)
        let turnpo = document.getElementById(`player${turn + 1}`).parentElement.getAttribute("id");
        turnpo = Number(turnpo)
        if (b == 6) {
            if (turn == 0) {
                run(turponu, b, turnpo, (turn + 1))
                turn = 0;
            }
            else {
                run(turponu, b, turnpo, (turn + 1))
                turn = 1;
            }
        }
        else {
            if (turn == 0) {
                run(turponu, b, turnpo, (turn + 1))
                turn = 1;
            }
            else {
                run(turponu, b, turnpo, (turn + 1))
                turn = 0;
            }
        }
    }, 501);

})
function run(turponu, b, turnpo, turn) {

    let sum = b + turnpo;
    let ladderis = checkladder(sum)
    let snakeis = checksnake(sum)
    let turnoppo = turn == 1 ? (2) : (1);

    document.getElementById(`player${turn}`).style.width = "50px"
    document.getElementById(`player${turn}`).style.height = "50px"
    document.getElementById(`player${turn}`).classList.remove("initial")
    document.getElementById(`player${turn}`).parentElement.getAttribute("id")

    if (sum == 80) {
        document.getElementsByClassName("another")[0].innerHTML = `<div class="gameover"> GAME OVER ..... </div>`
        document.getElementsByClassName("gameover")[0].innerHTML = `<audio src="snake and ladder image/gameover.mp3" autoplay></audio>`
    }
    else if (sum == 100) {
        document.getElementsByClassName("another")[0].innerHTML = `<div class="gameover"> GAME OVER ..... </div>`
        document.getElementsByClassName("gameover")[0].innerHTML = `<audio src="snake and ladder image/gameover.mp3" autoplay></audio>`
    }

    else if (snakeis[0]) {
        if (turponu == 2) {
            document.getElementById(`player${turn}`).parentElement.innerHTML = `<div class="button2 initial" id="player${turnoppo}"></div>`
            document.getElementById(`${turnpo + b}`).innerHTML = `<div class="button2 " id="player${turn}"></div>`
            document.getElementsByClassName("snake")[0].inerHTML = `<audio src="snake and ladder image/hiss.mp3" autoplay></audio>`
            setTimeout(() => {
                document.getElementById(`player${turn}`).parentElement.innerHTML = ``
                let div = document.createElement("div")
                div.classList.add("button2"),
                    div.setAttribute("id", `player${turn}`)
                document.getElementById(`${checksnake(sum)[2]}`).append(div)
            }, 500);
        }
        else {
            document.getElementById(`player${turn}`).parentElement.innerHTML = ``
            let div = document.createElement("div")
            div.classList.add("button2"),
                div.setAttribute("id", `player${turn}`)
            document.getElementById(`${turnpo + b}`).append(div)
            document.getElementsByClassName("snake")[0].inerHTML = `<audio src="snake and ladder image/hiss.mp3" autoplay></audio>`
            setTimeout(() => {
                document.getElementById(`player${turn}`).parentElement.innerHTML = ``
                let div = document.createElement("div")
                div.classList.add("button2"),
                    div.setAttribute("id", `player${turn}`)
                document.getElementById(`${checksnake(sum)[2]}`).append(div)
            }, 500);
        }
    }
    else if (ladderis[0]) {
        if (turponu == 2) {
            document.getElementById(`player${turn}`).parentElement.innerHTML = `<div class="button2 initial" id="player${turnoppo}"></div>`
            document.getElementById(`${turnpo + b}`).innerHTML = `<div class="button2 " id="player${turn}"></div>`
            document.getElementsByClassName("ladder")[0].inerHTML = `<audio src="snake and ladder image/ladder.mp3" autoplay></audio>`
            setTimeout(() => {
                document.getElementById(`player${turn}`).parentElement.innerHTML = ``
                let div = document.createElement("div")
                div.classList.add("button2"),
                    div.setAttribute("id", `player${turn}`)
                document.getElementById(`${ladderis[2]}`).append(div)
            }, 500);
        }
        else {
            document.getElementById(`player${turn}`).parentElement.innerHTML = ``
            let div = document.createElement("div")
            div.classList.add("button2"),
                div.setAttribute("id", `player${turn}`)
            document.getElementById(`${turnpo + b}`).append(div)
            document.getElementsByClassName("ladder")[0].inerHTML = `<audio src="snake and ladder image/ladder.mp3" autoplay></audio>`
            setTimeout(() => {
                document.getElementById(`player${turn}`).parentElement.innerHTML = ``
                let div = document.createElement("div")
                div.classList.add("button2"),
                    div.setAttribute("id", `player${turn}`)
                document.getElementById(`${ladderis[2]}`).append(div)
            }, 500);
        }
    }
    else if (sum < 100) {
        if (turponu == 2) {
            document.getElementById(`player${turn}`).parentElement.innerHTML = `<div class="button2 initial" id="player${turnoppo}"></div>`
            document.getElementById(`${turnpo + b}`).innerHTML = `<div class="button2 " id="player${turn}"></div>`

        }
        else {
            document.getElementById(`player${turn}`).parentElement.innerHTML = ``
            let div = document.createElement("div")
            div.classList.add("button2"),
                div.setAttribute("id", `player${turn}`)
            document.getElementById(`${turnpo + b}`).append(div)
        }
    }

    else {

    }

}

function animatedice() {
    document.getElementsByClassName("dicero")[0].innerHTML = `<audio src="snake and ladder image/dicerotate.mp3" autoplay></audio>`
    let inter = setInterval(() => {
        document.getElementsByClassName("dice")[0].classList.add("moving")
        document.getElementsByClassName("dice")[0].style.backgroundImage = `url("snake and ladder image/dice${rando()}.png")`
    }, 100);


    setTimeout(() => {
        document.getElementsByClassName("dice")[0].classList.remove("moving")
        clearInterval(inter)
    }, 500);
}

function pathdecider(num, count) {
    let a = [];
    let g = count + num;

    if (g <= 100) {
        for (let i = 0; i < count; i++) {
            if (num % 20 < 10 && num % 20 > 0) {
                a.push("right")
                num++
            }
            else if (num % 10 == 0) {
                a.push("top")
                num++
            }
            else {
                a.push("left")
                num++
            }
        }
    }
    else {
        a.push("none")
    }
}

function checksnake(a) {
    let e = [true]
    let b = [17, 54, 62, 64, 87, 93, 95, 98]
    let c = [7, 34, 19, 60, 24, 73, 75, 79]
    for (let id = 0; id < b.length; id++) {
        if (a == b[id]) {
            document.getElementsByClassName("snake")[0].innerHTML = ` <audio src="snake and ladder image/hiss.mp3" autoplay></audio>`
            e.push(b[id])
            e.push(c[id])
            return e;
        };
    }
    return false;
}
function checkladder(a) {
    let e = [true]
    let b = [1, 4, 9, 21, 28, 51, 71, 80]
    let c = [38, 14, 31, 42, 84, 67, 91, 100]
    for (let id = 0; id < b.length; id++) {
        if (a == b[id]) {
            document.getElementsByClassName("ladder")[0].innerHTML = ` <audio src="snake and ladder image/ladder.mp3" autoplay></audio>`
            e.push(b[id])
            e.push(c[id])
            return e;
        };
    }
    return false;
}