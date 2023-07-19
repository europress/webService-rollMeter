const maxLengthExt = 18 // 18 meters
const maxLengthInt = 99 // 99 cm
const rootDivId = document.querySelector("#height")

function separateMeter(meter) {
    const left = Math.floor(meter)
    const right = ((meter - Math.floor(meter)) * 100).toFixed(0)
    return [left, right]
}

function meter2angle(meter) {
    const cor = separateMeter(meter)
    return [Math.round(cor[0] * (360 / maxLengthExt)), Math.round(cor[1] * (360 / maxLengthInt))]
}

function angle2meter(angle) {
    const cor = separateMeter(
        (angle / (360 / maxLengthExt)).toFixed(2)
    )
    return cor
}

function viewMeter(cor) {
    return cor[0] + "." + cor[1] + "m"
}

function moveMeter(meter) {
    const angles = meter2angle(meter)
    const dot = rootDivId.querySelector(".dot")
    const debug = rootDivId.querySelector(".debug")

    dot.style.transform = "rotate(" + angles[0] + "deg)"
    debug.innerHTML = viewMeter(separateMeter(meter))
}

function rollMeter(meter, interval) {
    setTimeout(() => { moveMeter(meter) }, interval)
}

function demoRoll(cords, msec) {
    let i = 0
    // set trasitition speed
    const css_sec = "" + parseFloat(msec / 1000).toFixed(1)
    const dot = rootDivId.querySelector('.dot')
    dot.style.transition = "transform ease-in-out " + css_sec + "s"

    cords.split(" ").forEach(function (c) {
        rollMeter(parseFloat(c), i * msec)
        i++
    })

    // clear trasitition propertys after animations
    setTimeout(() => {
        dot.style.transition = "transform 0s"
    }, i * msec)
}

//----------------------------------------------------

document.addEventListener("DOMContentLoaded", function (e) {

    let is_dragging = false;
    const circle = rootDivId.querySelector('.circle')

    "mousedown touchstart".split(" ").forEach(function (event) {
        circle.addEventListener(event, function(e) {
             is_dragging = true 
            })
    })

    "mouseup touchend".split(" ").forEach(function (event) {
        document.addEventListener(event, function(e) {
             is_dragging = false 
            })
    })

    const handRolling = function (e) {
        if (is_dragging) {
            e.preventDefault()
            const circle = rootDivId.querySelector('.circle')
    
            let touch = undefined
            if (e.touches) {
                touch = e.touches[0];
            }
            const center_x = (circle.clientWidth / 2) + circle.getBoundingClientRect().left;
            const center_y = (circle.clientHeight / 2) + circle.getBoundingClientRect().top;
            const pos_x = e.pageX || touch.pageX;
            const pos_y = e.pageY || touch.pageY;
            const delta_y = center_y - pos_y;
            const delta_x = center_x - pos_x;
            let angle = Math.atan2(delta_y, delta_x) * (180 / Math.PI);
            angle -= 90;
            if (angle < 0) {
                angle = 360 + angle;
            }
            angle = Math.round(angle);
            const dot = rootDivId.querySelector('.dot')
            dot.style.transform = "rotate(" + angle + "deg)"
            const debug = rootDivId.querySelector('.debug')
            debug.innerHTML = viewMeter(angle2meter(angle))
        }
    }
    
    // const meter = document.querySelector('.meter')
    "mousemove touchmove".split(" ").forEach(function (e) {
        rootDivId.addEventListener(e, handRolling, false);
    })

    demoRoll("6.8 0.0", 1000)
})