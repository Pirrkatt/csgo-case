var gamma2; // LOCALHOST
fetch('./JSON/gamma2case.json')
    .then((response) => response.json())
    .then((json) => gamma2 = json);

// https://steamcommunity.com/market/priceoverview/?appid=730&currency=1&market_hash_name=StatTrak%E2%84%A2%20M4A1-S%20|%20Hyper%20Beast%20(Minimal%20Wear)
// $(window).on('load', function() {
//     $.getJSON('./JSON/gamma2case.json', function(json) {
//         gamma2 = json
//     })

//     $.getJSON('https://steamcommunity.com/market/priceoverview/?appid=730&currency=1&market_hash_name=StatTrak%E2%84%A2%20M4A1-S%20|%20Hyper%20Beast%20(Minimal%20Wear)', function(data) {
//         console.log(data);
//     });
// });

var drop_chance = {
    blue: { min: 1, max: 7988 },
    purple: { min: 7989, max: 9587 },
    pink: { min: 9588, max: 9908 },
    red: { min: 9909, max: 9973 },
    yellow: { min: 9974, max: 10000 }, // 0.27%?
};

var quality = {
    WW: { min: 1, max: 790 },
    BS: { min: 791, max: 1786 },
    FT: { min: 1787, max: 6100 },
    MW: { min: 6101, max: 8560 },
    FN: { min: 8561, max: 10000 },
};

var tempCounter = 0;


function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function randomInArray(array) {
    return Math.floor(Math.random() * array.length);
    // return array[Math.floor(Math.random() * array.length)];
}

function getQuality() {
    var rand = randomInt(1, 10000)
    for (grade in quality) {
        if (rand >= quality[grade].min && rand <= quality[grade].max) {
            var text = '<div class="weapon_quality">' + grade + '</div>';
            return text
        }
    }
}

function getStatTrak() {
    var rand = randomInt(1, 10)
    if (rand == 1) {
        var stattrak = '<div class="stattrak_class">StatTrak&trade;</div>';
        return stattrak
    }
}

var simulateKnife = false
var currently_rolling = false
var simulationCount = 1
var keyPrice = 2.5

function simulateKnifeToggle() {
    return simulateKnife = document.getElementById("switchToggle").checked;
}

function moneySpent(param) {
    if (param === "add") {
        var string = "Total Cases Opened for a Knife: <span class='color-white'>" + simulationCount + "</span>"
        string = string + "<br>" + "Total Money Spent on Keys:  <span class='color-green'>" + (simulationCount * keyPrice) + "$</span>"
        string = string + "<br>" + "Knife Value: <span class='color-red'>" + "Unknown</span>"
        var moneyText = '<div class="money-spent-text">' + string + '</div>';
        return moneyText
    }
    if (param === "remove") {
        $('.money-spent-text').remove();
    }
}

function hideButton() {
    var button = $('.roll-button')
    button.css({ cursor: "default", opacity: 0, transition: "opacity 1s" })
    currently_rolling = true

    setTimeout(function() {
        button.css({ cursor: "pointer", opacity: 1, transition: "opacity 1s" })
        currently_rolling = false
    }, 9200);
}

function clickOpen() {
    if (currently_rolling) {
        return
    }

    $('.slots').css({ // resets position of wheel
        transition: "sdf",
        "margin-left": "0px"
    });
    hideButton()
    moneySpent("remove")
    return GenerateDrop()
}

var random_array = [];

function GenerateDrop() {
    for (var i = 0; i < 90; i++) { // resets cards
        $('#CardNumber' + i).remove();
    }

    for (var i = 0; i < 90; i++) {
        var rand = randomInt(1, 10000);
        random_array[i] = rand
        if (simulateKnife) {
            if (i === 77) {
                if (!(rand >= drop_chance.yellow.min)) {
                    simulationCount += 1
                    return GenerateDrop() // call function again if winning item is not yellow (knife)
                } else {
                    $(moneySpent("add")).appendTo('.sim-container');
                }
            }
        }
    }

    for (var z = 0; z < 90; z++) {
        for (x in drop_chance) {
            if (random_array[z] >= (drop_chance[x].min) && random_array[z] <= (drop_chance[x].max)) {
                var random_drop = randomInArray(gamma2[x])
                var skin_name = gamma2[x][random_drop][0]
                var skin_image = gamma2[x][random_drop][1]
                element = '<div id="CardNumber' + z + '" class="item ' + x + '_item_color" style="background-image:url(' + skin_image + ');"></div>';
                if (z === 77) {
                    var winningSkin = skin_name
                    var winningImage = skin_image
                    var winningColor = x
                }
            }
        }
        $(element).appendTo('.slots');
    }

    setTimeout(function() {
        OpenCase(winningSkin, winningImage, winningColor);
    }, 500);
}

function OpenCase(skinName, skinImage, skinColor) {
    $('.slots').css({
        transition: "all 8s cubic-bezier(.08,.6,0,1)"
    });

    setTimeout(function() {
        if (tempCounter >= 7) {
            for (var i = 0; i < 7; i++) { // resets inventory
                document.getElementById("added_inventory" + i).remove();
                tempCounter = 0;
            }
        }

        $('#CardNumber77').addClass('winning-item'); // green border on winning item
        var win_element = "<div id='added_inventory" + tempCounter + "' class='item " + skinColor + "_item_color' style='background-image: url(" + skinImage + ")'></div>";
        $(win_element).appendTo('.inventory'); //adds winning item to inventory
        $(getQuality()).appendTo('#added_inventory' + tempCounter);
        $(getStatTrak()).appendTo('#added_inventory' + tempCounter);
        tempCounter += 1;
    }, 8500);
    $('.slots').css('margin-left', '-6770px');
}