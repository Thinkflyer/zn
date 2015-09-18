/**
 * BadgeManager 静态类
 * 只需要关心对应业务的角标增长值，自动计算总的角标数，并设置App角标plus.runtime.setBadgeNumber
 * @author fanrong33
 * @version 1.0.1 build 20150630
 */
;function BadgeManager(){
};
/**
 * 角标增长
 * @param {String} key  键值
 * @param {Number} step 增长值
 */
BadgeManager.setInc = function(key, step){
    var key = "badge_"+key;
    var badge_total_number = plus.storage.getItem("badge_total_number");
    var badge_key_number   = plus.storage.getItem(key);
    badge_total_number = parseInt(badge_total_number); // 字符串转数字
    badge_key_number  = parseInt(badge_key_number);
    if(!badge_key_number) badge_key_number    = 0;
    if(!badge_total_number) badge_total_number = 0;
    badge_key_number   = badge_key_number + step;
    badge_total_number = badge_total_number + step;

    plus.storage.setItem(key, badge_key_number.toString()); // 数字转字符串
    plus.storage.setItem("badge_total_number", badge_total_number.toString());

    // 设置APP图标的角标
    plus.runtime.setBadgeNumber(badge_total_number);
}

/**
 * 角标减少
 * @param {String} key  键值
 * @param {Number} step 减少值
 */
BadgeManager.setDec = function(key, step){
    var key = "badge_"+key;
    var badge_total_number = plus.storage.getItem("badge_total_number");
    var badge_key_number   = plus.storage.getItem(key);
    badge_total_number = parseInt(badge_total_number);
    badge_key_number  = parseInt(badge_key_number);
    if(!badge_key_number) badge_key_number   = 0;
    if(!badge_total_number) badge_total_number = 0;
    badge_key_number   = badge_key_number - step;
    badge_total_number = badge_total_number - step;

    if(badge_key_number < 0)    badge_key_number = 0;
    if(badge_total_number < 0) badge_total_number = 0;

    plus.storage.setItem(key, badge_key_number.toString());
    plus.storage.setItem("badge_total_number", badge_total_number.toString());

    // 设置APP图标的角标
    plus.runtime.setBadgeNumber(badge_total_number);
}

/**
 * 根据key获取对应的角标值
 * @param {String} key
 */
BadgeManager.getBadgeNumber = function(key){
    var key = "badge_"+key;
    var badge_key_number = plus.storage.getItem(key);
    badge_key_number       = parseInt(badge_key_number);

    if(!badge_key_number) badge_key_number = 0;
    return badge_key_number;
}

/**
 * 删除key对应的角标值
 * @param {String} key
 */
BadgeManager.removeBadgeNumber = function(key){
    var key = "badge_"+key;
    var badge_total_number = plus.storage.getItem("badge_total_number");
    var badge_key_number   = plus.storage.getItem(key);
    badge_total_number = parseInt(badge_total_number);
    badge_key_number  = parseInt(badge_key_number);
    if(!badge_key_number) badge_key_number   = 0;
    if(!badge_total_number) badge_total_number = 0;
    badge_total_number = badge_total_number - badge_key_number;

    if(badge_total_number < 0) badge_total_number = 0;

    plus.storage.removeItem(key);
    plus.storage.setItem("badge_total_number", badge_total_number.toString());

    // 设置APP图标的角标
    plus.runtime.setBadgeNumber(badge_total_number);
}
