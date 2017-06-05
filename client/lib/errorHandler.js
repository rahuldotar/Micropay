/**
 * Created by arun on 17/8/16.
 */


function checkInput(inputs) {
   var result = true;

    inputs.forEach(function (input) {

        if (input === undefined || input == {} || input === '' || input === ' ' || input == null) {

         
            result = false;

        }


    });

    return result;


}


function checkZero(inputs) {

    var result = false;

    inputs.forEach(function (input) {

        if (input === 0 || input === '0') {

            result = true;

        }


    });

    return result;

}

function checkEmail(email) {

    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (!filter.test(email)) {
        return false;
    }
    else {
        return true;
    }
}

function checkPhone(phone) {

    // phone = String(phone);
    // var phoneRe = /^[0-9]\d{2}[2-9]\d{2}\d{4}$/;
    // var digits = phone.replace(/\D/g, "");
    // return (digits.match(phoneRe) !== null);

    var isnum = /^\d+$/.test(phone);

    if (isnum == true && phone.length <= 12 && phone.length >= 7) {
        return true;
    }
    else {
        return false;
    }

}


function checkCountryCode(code) {

    // if (code.length <= 3 && code.length >= 2 ) {
    //     if (/^\d+$/.test(code.charAt(0)) == false && code.charAt(0) == '+') {
    //         return true;
    //     }
    //     else if (/^\d+$/.test(code) == true) {
    //         return true;
    //     }
    //     else { console.log("returning false on digit check");
    //         return false;
    //     }
    // }
    // else { console.log("returning false on main else");
    //     return false;
    // }


    if (code.length <= 3 && code.length >= 2) {
        if (/^\d+$/.test(code) == true) {
            return true;
        }
        else {
           
            return false;
        }
    }
    else {
       
        return false;
    }


}


function checkNum(str) {
    str = parseInt(str);
    console.log(str);
    return /^\d+$/.test(str);
}


function isInt(n){
    return Number(n) === n && n % 1 === 0;
}

function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
}

function checkName(name) {
    return /^[a-zA-Z ]{1,30}$/.test(name);
}

console.log(checkName("arun"));