/**
 * 校验字符串是否为合法URL
 * @param {string} url
 * @returns {boolean}
 */
function isValidUrl(url) {
    if (typeof url !== 'string' || !url) return false;
    try {
        // 只允许 http(s) 和 ftp 协议
        const u = new URL(url);
        return ['http:', 'https:', 'ftp:'].includes(u.protocol);
    } catch (e) {
        return false;
    }
}
exports.isValidUrl = function(url) {
    return isValidUrl(url);
}
