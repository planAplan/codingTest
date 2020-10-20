export function compareString(str, target) {
    let strArr = str.split("");
    let result = strArr.map(s => {
        s = s.toLowerCase();
        target = target.toString().toLowerCase();
        return target.includes(s)
    })
    return result.every(i => i);
}