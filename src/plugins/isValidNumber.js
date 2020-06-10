export default function (str) {
    if (
        str &&
        ("" + str).trim().length !== 0 &&
        !isNaN(parseFloat(str)) &&
        Number(str) >= 0
    )
        return true;

    return false;
}