var currentClass = ""

var audioPlaying = false;

function animateCSS(element, animationName, callback) {
    const node = document.querySelector(element)
    node.classList.add("animated", animationName)

    function handleAnimationEnd() {
        node.classList.remove("animated", animationName)
        node.removeEventListener("animationend", handleAnimationEnd)
    
        if (typeof callback === "function") callback()
    }

    node.addEventListener("animationend", handleAnimationEnd)
}

function getImage(objectClass) {
    if(objectClass == "apple") {
        return "apple_overlay.png"
    } else if(objectClass == "banana") {
        return "banana_overlay.png"
    } else if(objectClass == "orange") {
		return "orange-06.png"
	} else if(objectClass == "cow") {
		return "cow-10.png"
	} else if(objectClass == "zebra") {
		return "zebra-11.png"
	} else {
        return "mouse_over-09.png"
    }
}

function getSound(objectClass) {
    if(objectClass == "apple") {
        return "Apple.m4a"
    } else if(objectClass == "banana") {
        return "Banana.m4a"
	} else if(objectClass == "cow") {
        return "Cow_Moo.mp3"
	} else if(objectClass == "") {
        return ""
    } else {
        return ""
    }
}

function classifyAndNext(model) {
	model.detect(video).then(pred => {
        pred = pred.map(x => x.class)
        pred = pred.filter((value, index, arr) => arr.indexOf(value) == index)

        var newClass = ""

        if(pred.includes("apple")) {
            newClass = "apple"
        } else if(pred.includes("banana")) {
            newClass = "banana"
	    } else if(pred.includes("orange")) {
            newClass = "orange"
		} else if(pred.includes("cow")) {
            newClass = "cow"
		} else if(pred.includes("zebra")) {
            newClass = "zebra"
        } else {
            newClass = ""
        } 

        if(currentClass != newClass) {
            if(currentClass == "") {
                // new card coming in
                document.getElementById("overlay").src = getImage(newClass)
                //animateCSS("#overlay", "slideInUp")
            }
            else if(newClass == "") {
                // card sliding out
                document.getElementById("overlay").src = getImage(newClass)
            }
            else {
                // change from one card to another
                document.getElementById("overlay").src = getImage(newClass)
            }

            var sound = getSound(newClass)
            if(sound && sound.length > 0 && !audioPlaying) {
                audioPlaying = true
                var audio = new Audio(sound)
                audio.play()

                setTimeout(function() { audioPlaying = false }, 3000)
            }

            currentClass = newClass
        }


		setTimeout(function() {
			classifyAndNext(model)
		}, 100)
	});
}

var video = document.getElementById("video");

if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {

	navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } } }).then(function(stream) {
		video.srcObject = stream;
		video.play();
	});

    cocoSsd.load().then(model => {
        classifyAndNext(model)
        alert("Loaded")
    });

} else{
    alert ("Camera not available")
}

