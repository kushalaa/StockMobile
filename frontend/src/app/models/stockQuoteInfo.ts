export interface IQuoteInfo {
    c: number; //last price
    d: number; // change 
    dp: number; // change percent
    h: number; // high price
    l: number; // low price
    o: number; // open price
    pc: number; // prev close
    t: number; // timestamp
    ticker: string;
}