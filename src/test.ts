import SpamFilter from "./spam-filter";

const filter = new SpamFilter("hd adfaifjoa dd https://goo.gl/nVLutc", ["http://www.filekok.com/main"], 3);

console.log(filter.isSpam());