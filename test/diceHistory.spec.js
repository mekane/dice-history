var expect = require('chai').expect;
var diceHistory = require('../diceHistory');
var localStorageMock = require('localStorage');

function newDiceHistory() {
    localStorageMock.clear();
    return diceHistory(localStorageMock);
}

describe('the diceHistory module', function () {
    it('should be a constructor', function () {
        expect(diceHistory).to.be.a('function');
    });

    it('expects to be passed a storage mechanism that conforms to the localStorage api', function () {
        var dh = newDiceHistory();
        expect(dh).to.be.an('object');
    });

    it('should have a list method', function () {
        var dh = newDiceHistory();
        expect(dh.list).to.be.a('function');
    });

    it('should return an empty array initially', function () {
        var dh = newDiceHistory();
        expect(dh.list()).to.deep.equal([]);
    });

    it('should have an add method', function () {
        var dh = newDiceHistory();
        expect(dh.add).to.be.a('function');
    });

    it('should ignore non-object values', function () {
        var dh = newDiceHistory();
        dh.add();
        dh.add(null);
        dh.add(1);
        dh.add([]);
        dh.add("test");
        expect(dh.list()).to.deep.equal([]);
    });

    it('should remember an added object', function () {
        var dh = newDiceHistory();
        dh.add({foo: 'bar'});
        expect(dh.list()).to.deep.equal([{foo: 'bar'}]);
    });

    it('should remember more objects', function () {
        var dh = newDiceHistory();

        var testObj1 = {value: 1};
        var testObj2 = {value: 2};

        dh.add(testObj1);
        dh.add(testObj2);

        expect(dh.list()).to.deep.equal([testObj1, testObj2]);
    });

    it('discards duplicate entries that are the same reference', function () {
        var dh = newDiceHistory();

        var testObj1 = {value: 1};
        var testObj2 = {value: 2};

        dh.add(testObj1);
        dh.add(testObj2);
        dh.add(testObj1);

        expect(dh.list()).to.deep.equal([testObj1, testObj2]);
    });

    it('discards duplicate entries that are the same values of modifier and arrays of dice configs', function () {
        var dh = newDiceHistory();

        var testEntry1 = generateHistoryItem(0, 1, 1);
        var testEntry2 = generateHistoryItem(0, 2, 2);
        var duplicateTestEntry = generateHistoryItem(0, 1, 1);

        dh.add(testEntry1);
        dh.add(testEntry2);
        dh.add(duplicateTestEntry);

        expect(dh.list()).to.deep.equal([testEntry1, testEntry2]);
    });

    it('loads previously saved values from localStorage', function () {
        var initialDiceHistory = newDiceHistory();
        var testItem = generateHistoryItem(0, 1, 1);
        initialDiceHistory.add(testItem);

        var historyForLaterSession = diceHistory(localStorageMock);
        expect(JSON.stringify(historyForLaterSession.list())).to.equal(JSON.stringify([testItem]));
    });

    function generateHistoryItem(modifier, d4, d6, d8, d10, d12) {
        return {
            modifier: modifier,
            diceConfig: [
                {number: d4, size: 4},
                {number: d6, size: 6},
                {number: d8, size: 8},
                {number: d10, size: 10},
                {number: d12, size: 12}
            ]
        };
    }
});
