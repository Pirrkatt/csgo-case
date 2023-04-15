var gamma2;

async function loadGamma2() {
    gamma2 = await (await fetch('./JSON/case-gamma2.json')).json();
}
// console.log(document.location.pathname);

$(window).on('load', async function() {
    loadGamma2();
});

// const response = await fetch("./steam.php?url=" + encodeURIComponent('https://steamcommunity.com/market/priceoverview/?appid=730&currency=1&market_hash_name=StatTrak%E2%84%A2%20M4A1-S%20|%20Hyper%20Beast%20(Minimal%20Wear)'));

async function getItemPrice(url) { // fix
    try {
        const response = await fetch("./steam.php?url=" + url);
        if (response.status == 200) {
            const jsonData = await response.json();
            // console.log(jsonData.median_price);
            return jsonData.median_price
        } else {
            console.log(await response.text());
        }

    } catch (e) {
        console.error("Error", e)
    }
}

var drop_chance = {
    blue: { min: 1, max: 7988 },
    purple: { min: 7989, max: 9587 },
    pink: { min: 9588, max: 9908 },
    red: { min: 9909, max: 9973 },
    yellow: { min: 9974, max: 10000 }, // 0.27%?
};

var quality = {
    "WW": { min: 1, max: 790 },
    "BS": { min: 791, max: 1786 },
    "FT": { min: 1787, max: 6100 },
    "MW": { min: 6101, max: 8560 },
    "FN": { min: 8561, max: 10000 },
};

function getItemUrl(itemName, isStattrak, quality, color) {
    var link = "https://steamcommunity.com/market/priceoverview/?appid=730&currency=1&market_hash_name=";

    if (color == "yellow") {
        link = link + encodeURIComponent("★ ")
    }

    if (isStattrak) {
        link = link + encodeURIComponent("StatTrak™ ")
    }

    link = link + encodeURIComponent(itemName)

    var arr = {
        "WW": "Well-Worn",
        "BS": "Battle-Scarred",
        "FT": "Field-Tested",
        "MW": "Minimal Wear",
        "FN": "Factory New",
    }

    var qualityName = " (" + arr[quality] + ")"
    link = link + encodeURIComponent(qualityName)
    return encodeURIComponent(link)
}

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
            return grade
        }
    }
}

function getStatTrak() {
    var rand = randomInt(1, 10)
    if (rand === 1) {
        return true
    }
    return false
}

function invPriceText(value) {
    if (value === undefined) {
        value = "N/A"
    }
    var price = '<div class="itemvalue_inv_small">' + value + '</div>';
    $(price).appendTo('#added_inventory' + tempCounter + '');
}

var random_array = [];
var tempCounter = 0;

var simulateKnife = false;
var currently_rolling = false;
var simulationCount = 1;
const keyPrice = 2.5;

function simulateKnifeToggle() {
    return simulateKnife = document.getElementById("switchToggle").checked;
}

function moneySpent(param, price) {
    if (param === "add") {
        var totalKeysCost = (simulationCount * keyPrice)
        var string = "Total Cases Opened for a Knife: <span class='color-white'>" + simulationCount + "</span>"
        string = string + "<br>" + "Total Money Spent on Keys: <span class='color-orange'>$" + totalKeysCost + "</span>"
        if (price !== undefined) {
            var newPrice = price.replace('$', '')
            string = string + "<br>" + "Knife Value: <span class='color-" + ((newPrice > totalKeysCost) ? 'green' : 'red') + "'>" + price + "</span>"
        } else { string = string + "<br>" + "Knife Value: <span class='color-gray'>None Listed on Steam Market</span>" }
        var moneyText = '<div class="money-spent-text">' + string + '</div>';
        return moneyText
    }
    if (param === "remove") {
        simulationCount = 1
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
    var stattrak = getStatTrak()
    var quality = getQuality()

    setTimeout(function() {
        OpenCase(winningSkin, winningImage, winningColor, stattrak, quality);
    }, 500);
}

function OpenCase(skinName, skinImage, skinColor, isStattrak, qualityGrade) {
    $('.slots').css({
        transition: "all 8s cubic-bezier(.08,.6,0,1)"
    });

    tempCounter += 1;
    setTimeout(function() {
            if (tempCounter > 7) {
                for (var i = 1; i < 8; i++) { // resets inventory
                    document.getElementById("added_inventory" + i).remove();
                    tempCounter = 1;
                }
            }

            var marketUrl = getItemUrl(skinName, isStattrak, qualityGrade, skinColor)
            getItemPrice(marketUrl).then(function(response) {
                invPriceText(response)
                if (simulateKnife) {
                    $(moneySpent("add", response)).appendTo('.sim-container');
                }
            })

            $('#CardNumber77').addClass('winning-item'); // green border on winning item
            var win_element = "<div id='added_inventory" + tempCounter + "' class='item " + skinColor + "_item_color' style='background-image: url(" + skinImage + ")'></div>";
            $(win_element).appendTo('.inventory'); //adds winning item to inventory
            var grade = '<div class="weapon_quality">' + qualityGrade + '</div>';
            $(grade).appendTo('#added_inventory' + tempCounter);
            var stattrak_class = '<div class="stattrak_class">StatTrak&trade;</div>';
            if (isStattrak) {
                $(stattrak_class).appendTo('#added_inventory' + tempCounter);
            }
            var nameText = '<div class="item-name-text">' + ((skinColor === "yellow") ? ("★ " + skinName) : skinName) + '</div>';
            $(nameText).appendTo('#added_inventory' + tempCounter);
        },
        8500);
    $('.slots').css('margin-left', '-6770px');
}