module.exports = function(storage) {
    var history = loadFromStorage();

    function loadFromStorage() {
        var historyString = storage.getItem("history");

        if(historyString)
            return JSON.parse(historyString);
        else
            return [];
    }

    function saveToStorage() {
        storage.setItem("history", JSON.stringify(history));
    }

    function add(input) {
        if (isObject(input) && !containsInput(input)) {
            history.push(input);
            saveToStorage();
        }
    }

    function containsInput(input) {
        if(history.indexOf(input) > -1)
            return true;
        if(!input.diceConfig)
            return false;

        var sortedInput = input.diceConfig.sort(function(a, b) { return a.size - b.size; });
        return history.filter(function(historyItem) {
            if(!historyItem.diceConfig)
                return false;

            var sortedHistoryItem = historyItem.diceConfig.sort(function(a, b) { return a.size - b.size; });

            if(sortedHistoryItem.modifier != sortedInput.modifier)
                return false;
            if(sortedHistoryItem.length != sortedInput.length)
                return false;

            for(var i = 0; i < sortedInput.length; i++)
                if(sortedInput[i].size != sortedHistoryItem[i].size || sortedInput[i].number != sortedHistoryItem[i].number)
                    return false;

            return true;
        }).length;
    }

    function list() {
        return history;
    }

    function isObject(obj) {
        return !!obj && Object.prototype.toString.call(obj) === '[object Object]';
    }

    return {
        add: add,
        list: list
    };
};
