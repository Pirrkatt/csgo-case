var gamma2;
fetch('./JSON/gamma2case.json')
    .then((response) => response.json())
    .then((json) => gamma2 = json);

// var items = {
//     blue: { //79.92%
//         skin: "P90 | Grim",
//         img: "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_p90_cu_p90_grimm_light_large.59514d7b54f637f314329bb3fef1c7ffd1b153ba.png"
//     },
//     purple: { //15.98%
//         skin: "Desert Eagle | Directive",
//         img: "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_deagle_aq_desert_eagle_constable_light_large.fb2f2673dd3997a21bff9129e0d2e294c03095e8.png"
//     },
//     pink: { //3.20%
//         skin: "Tec-9 | Fuel Injector",
//         img: "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_tec9_gs_tec9_supercharged_light_large.e3ebc20f10eae02790fe95703b6099acca1d1809.png"
//     },
//     red: { //0.64%
//         skin: "AK-47 | Neon Revolution",
//         img: "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_ak47_cu_ak47_anarchy_light_large.6e98f0c6fcb81aaeca03c56eed68962f50c9ef94.png"
//     },
//     yellow: { //0.26%
//         skin: "Karambit | Gamma Doppler",
//         img: "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_karambit_am_gamma_doppler_phase1_light_large.769cf2ab676ea2a7d7322c258f57bac8dca00336.png"
//     }
// };

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

function resetCards() {
    for (i = 0; i < 90; i++) {
        $('#CardNumber' + i).remove();
    }
}

function resetInventory() {
    for (var i = 0; i < 7; i++) {
        document.getElementById("added_inventory" + i).remove();
        tempCounter = 0;
    }
}

var simulateKnife = false
var simulations = 1
var keyPrice = 2.5

function simulateKnifeToggle() {
    return simulateKnife = document.getElementById("switchToggle").checked;
}

function simText(param) {
    // console.log($('.simulating-text').css("visibility")
    $('.simulating-text').css({
        "visibility": param
    });
    $('.lds-roller').css({
        "visibility": param
    });
}

function getMoneySpent() {
    var string = "Total Cases Opened for a Knife: <span class='color-white'>" + simulations + "</span>"
    string = string + "<br>" + "Total Money Spent on Keys:  <span class='color-green'>" + (simulations * keyPrice) + "$</span>"
    string = string + "<br>" + "Knife Value: <span class='color-red'>" + "Unknown</span>"
    var moneyText = '<div class="money-spent-text">' + string + '</div>';
    return moneyText
}

function GenerateDrop() {
    $('.slots').css({ // resets position of wheel
        transition: "sdf",
        "margin-left": "0px"
    });

    resetCards()
    if (simulateKnife) {
        simText("visible")
    }
    for (var i = 0; i < 90; i++) {
        var rand = randomInt(1, 10000);

        for (x in drop_chance) {
            if (rand >= (drop_chance[x].min) && rand <= (drop_chance[x].max)) {
                var random_drop = randomInArray(gamma2[x])
                var skin_name = gamma2[x][random_drop][0]
                var skin_image = gamma2[x][random_drop][1]
                element = '<div id="CardNumber' + i + '" class="item ' + x + '_item_color" style="background-image:url(' + skin_image + ');"></div>';
                if (i === 77) {
                    var winningSkin = skin_name
                    var winningImage = skin_image
                    var winningColor = x

                    if (simulateKnife) {
                        //show simulating text...
                        if (!(rand >= 9974)) {
                            simulations += 1
                            return GenerateDrop()
                        } else {
                            $(getMoneySpent()).appendTo('.sim-container');
                        }
                    }
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
    if (simulateKnife) {
        simText("hidden")
    }
    setTimeout(function() {
        if (tempCounter >= 7) {
            resetInventory()
        }

        $('#CardNumber77').addClass('winning-item');
        var win_element = "<div id='added_inventory" + tempCounter + "' class='item " + skinColor + "_item_color' style='background-image: url(" + skinImage + ")'></div>";
        $(win_element).appendTo('.inventory');
        $(getQuality()).appendTo('#added_inventory' + tempCounter);
        $(getStatTrak()).appendTo('#added_inventory' + tempCounter);
        tempCounter += 1;
    }, 8500);
    // $('.slots').css('margin-left', -(tempCounter + 1) * 6770 + 'px');
    $('.slots').css('margin-left', '-6770px');
}