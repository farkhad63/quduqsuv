const CryptoJS = require("crypto-js");
const jsrsasign = require('jsrsasign');

function decrypt_data(data) {
    let key = 'dmOA7sQAcHzqqcCHgFBkbA==';
    let iv = 'r963rojdls0khzvk';

    let word = data

    //use data value
    key = CryptoJS.enc.Utf8.parse(key);
    iv = CryptoJS.enc.Utf8.parse(iv);

    let base64 = CryptoJS.enc.Base64.parse(word);

    let src = CryptoJS.enc.Base64.stringify(base64);

    let decrypt = CryptoJS.AES.decrypt(src, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    let decryptedData = JSON.parse(decrypt.toString(CryptoJS.enc.Utf8));
    var payload = {
        cabinetSerialNumber: decryptedData.deviceInfo.cabinetSerialNumber,
        orderNo: decryptedData.orderNo,
        amount: decryptedData.orderInfo.amount,
        completeTime: decryptedData.orderInfo.completeTime,
        createTime: decryptedData.orderInfo.createTime,
        orderStatus: decryptedData.orderInfo.orderStatus,
        videoUrl1: decryptedData.orderInfo.videoUrl[0] || null,
        videoUrl2: decryptedData.orderInfo.videoUrl[1] || null,
    };
    return payload;
}

function get_order_detail(data) {
    let key = 'dmOA7sQAcHzqqcCHgFBkbA==';
    let iv = 'r963rojdls0khzvk';

    let word = data

    //use data value
    key = CryptoJS.enc.Utf8.parse(key);
    iv = CryptoJS.enc.Utf8.parse(iv);

    let base64 = CryptoJS.enc.Base64.parse(word);

    let src = CryptoJS.enc.Base64.stringify(base64);

    let decrypt = CryptoJS.AES.decrypt(src, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    let decryptedData = JSON.parse(decrypt.toString(CryptoJS.enc.Utf8));
    return decryptedData.orderDetailInfo;
}

const KEYUTIL = jsrsasign.KEYUTIL;
const hextob64 = jsrsasign.hextob64;

const privateKeyString = `-----BEGIN PRIVATE KEY-----
MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAM/p+2G6SehgCFszF9MZPQQ1raik0iH8bof2RB4r1dICIvfH6sUdFpbc1mcHpDUgUgtFihLdaeTXmjY4SVl8s+UikGUNxAw//YywUJ+BT4xmh6BGEe3jgBASTw15svh+M998yy7mGH8+C5C6cpSo1T4ojsYUd8y7QZG5mkUoSt8ZAgMBAAECgYBSOiiIQwO92lUTtIZEn6OpCY2vt9e/RzVzoirYf9+lmeC4fCFWaaWobpiA0N3ZgPnRqWPtCBI8RiSgMuyXbqE6U9+L5HKikD4l8xl28pNJ7P80d14I9JHq/wNZdF2hzwvoUzylZvhHzW/KHtCddWqDR/FUlbjOnh+B9gC5bFzeTQJBAPdBOSm21K2VLR2G7mVp6V2Ift8M48Q4qshsCwu7h64lndETkByBFiDlXwbwaDaOsc1Jpusq/O/KVwHvRbwCe5cCQQDXRIvTUJ36IM2hJ5nl1plm/nbSgVtxW31W8M2NIyTzhEMpJ4yUBatApqDPhaXIuoQneCkTxjw5byYysrKR3JDPAkEAuYKLM/wEF/Sr89Jv/VD4kX++yPVv0qI9qMA/jV73TrbUcLC/2FMV2jqeEKPBXOW1C3RuM1V+jx7+JupyJLysIwJAdzAOsxuJvHn5IGdKwIUHPo1ZwMe6l5LuXPrK9IAm72Wlwd2R6ksRPKSFmSEIX5FVpnzTUY2KvsoZvixOzo/u5QJBANnV13oMjMHYsQFS8ycjVv/8RUTdH7X5vH5hp5nm/R4nKhcG0tPXtvldoKY6wcolxof24vpuNUTUhZLIdA1k8lY=
-----END PRIVATE KEY-----`;

function signDataWithMD5RSA(privateKeyString, data) {
    var privateKey = KEYUTIL.getKey(privateKeyString);
    var sig = new jsrsasign.KJUR.crypto.Signature({alg: "MD5withRSA"});
    sig.init(privateKey);
    sig.updateString(data);
    var signature = sig.sign();
    return hextob64(signature);
}

function get_post_data(jsondata) {
    let json = JSON.stringify(jsondata)
    let jsons = JSON.stringify({
        nonce: "608b4d5f15e3faa88531e12f",
        timestamp: 1620790623607,
        value: {
            cabinetSerialNumber: "W0008444",
            doorNumber: 1,
            merchantNo: "Me00003110",
            operateType: "SHOPPING",
            orderCreateTime: "2024-01-28 17:23:25",
            orderNo: "WZ00000000000000110",
            payType: "MERCHANT_SELF_OPERATED_ORDER",
            productNo: "VISUAL"
        }
    });
    const data = json;
    const jsonObject = JSON.parse(data);
    const sortedKeys = Object.keys(jsonObject).sort();
    const sortedJsonObject = {};
    sortedKeys.forEach(key => {
        sortedJsonObject[key] = jsonObject[key];
    });
    const signature = signDataWithMD5RSA(privateKeyString, JSON.stringify(sortedJsonObject));
    return signature
}