export class Announcer {
    private _available: number[];
    private _allAnnounced: number[] = [];
    private _announcedQuickCheck: {[key: number]: boolean} = {};

    constructor(private _maxAllowed: number) {
        this._available = Array.from({length: _maxAllowed}, (_, i)=> i + 1);
    }

    public get allAnnounced() {
        return this._allAnnounced;
    }

    public hasBeenAnnounced(num: number) {
        return this._announcedQuickCheck[num];
    }

    public lastAnnounced() {
        return this._allAnnounced[this._allAnnounced.length - 1];
    }
   
    public next(): number {
        if(this._available.length === 0) return 0;

        const rand = Math.floor(Math.random() * 100);

        const numAvailable = this._available.length;
        const numSlotsPerRand = 100/numAvailable;
        const randSlot = rand / numSlotsPerRand;
        const index = Math.floor(randSlot);
        const numToAnnounce = this._available[index];

        this._available.splice(index, 1);
        this._allAnnounced.push(numToAnnounce);
        this._announcedQuickCheck[numToAnnounce] = true;
        return numToAnnounce;
    }
}