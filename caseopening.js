var items = {
    blue: { //79.92%
        chance: { min: 1, max: 7988 },
        skin: "P90 | Grim",
        img: "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_p90_cu_p90_grimm_light_large.59514d7b54f637f314329bb3fef1c7ffd1b153ba.png"
    },
    purple: { //15.98%
        chance: { min: 7989, max: 9587 },
        skin: "Desert Eagle | Directive",
        img: "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_deagle_aq_desert_eagle_constable_light_large.fb2f2673dd3997a21bff9129e0d2e294c03095e8.png"
    },
    pink: { //3.20%
        chance: { min: 9588, max: 9908 },
        skin: "Tec-9 | Fuel Injector",
        img: "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_tec9_gs_tec9_supercharged_light_large.e3ebc20f10eae02790fe95703b6099acca1d1809.png"
    },
    red: { //0.64%
        chance: { min: 9909, max: 9973 },
        skin: "AK-47 | Neon Revolution",
        img: "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_ak47_cu_ak47_anarchy_light_large.6e98f0c6fcb81aaeca03c56eed68962f50c9ef94.png"
    },
    yellow: { //0.26%
        chance: { min: 9974, max: 10000 },
        skin: "Karambit | Gamma Doppler",
        img: "https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_karambit_am_gamma_doppler_phase1_light_large.769cf2ab676ea2a7d7322c258f57bac8dca00336.png"
    }
};

var quality = {
    WW: { min: 1, max: 790 },
    BS: { min: 791, max: 1786 },
    FT: { min: 1787, max: 6100 },
    MW: { min: 6101, max: 8560 },
    FN: { min: 8561, max: 10000 },
}

var tempCounter = 0;


function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
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
    if (rand > 5) {
        var stattrak = '<div class="stattrak_class">StatTrak&trade;</div>';
        return stattrak
    }
}

function resetInventory() {
    for (var i = 0; i < 7; i++) {
        document.getElementById("win_item" + i).remove();
        tempCounter = 0;
    }
}

function GenerateDrop() {
    $('.slots').css({ // resets position of wheel
        transition: "sdf",
        "margin-left": "0px"
    }, 10).html('');

    for (var i = 0; i < 90; i++) {
        var element;
        var rand = randomInt(1, 10000);
        for (x in items) {
            if (rand >= items[x].chance.min && rand <= items[x].chance.max) {
                element = '<div id="CardNumber' + i + '" class="item ' + x + '_item_color" style="background-image:url(' + items[x].img + ');"></div>';
                if (i === 77) {
                    var winningSkin = items[x].skin
                    var winningImage = items[x].img
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
            resetInventory()
        }

        $('#CardNumber77').addClass('winning-item');
        var win_element = "<div id='win_item" + tempCounter + "' class='item " + skinColor + "_item_color' style='background-image: url(" + skinImage + ")'></div>";
        $(win_element).appendTo('.inventory');
        var quality = getQuality()
        $(quality).appendTo('#win_item' + tempCounter);
        var stattrak = getStatTrak()
        $(stattrak).appendTo('#win_item' + tempCounter);
        tempCounter += 1;
    }, 500);
    $('.slots').css('margin-left', '-6770px');
}