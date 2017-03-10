windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

var margin = { top: 20, right: 20, bottom: 30, left: 40 };

width = windowWidth - margin.left - margin.right;
height = windowHeight - margin.bottom - margin.top;

let stopwords = ["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves"];


function getWordCounts(data) {
    let cleaned_data = data.replace(/[(),.!?<>\-_\/\+:]/g, ""); // !?.,@#$%&"\[\]|()“”:/-_\+
    let text = cleaned_data.toLowerCase();
    // document.getElementById("corpus").innerHTML = text;

    let words = text.split(' ')
        .map(function(x) { return x.trim(); }) // trim out excessive spaces around words
        .filter(function(x) { return !(!x); }) // remove empty strings
        .filter(function(x) { return !(stopwords.indexOf(x) >= 0); }) // remove stopwords
        .filter(function(x) { return x.length > 2; }); // remove single or double character words

    let counts = {};
    for (var i = 0; i < words.length; i++) {
        counts[words[i]] = 1 + (counts[words[i]] || 0);
    }
    var arr = [];
    for (var key in counts) {
        arr.push({ text: key, count: counts[key] });
    }

    var res = arr.filter(function(x) { return x.count > 1 && x.count < 20; });
    return res;
}


var fill = d3.scaleOrdinal(d3.schemeCategory10);
var xScale = d3.scaleLinear()
    .range([0, width]);

var svg = d3.select("body")
    .append("svg")
    .attr("width", "500")
    .attr("height", "500");

var chartGroup = svg.append("g").attr("transform", "translate(250,250)");

// Make the word cloud

function drawCloud(words) {
    // console.log(words);

    chartGroup.selectAll("text")
        .data(words)
        .enter().append("text")
        .style("fill", function(d, i) { return fill(i); })
        .style("font-size", function(d) { return d.size + "px"; })
        .attr("transform", function(d) {
            return "translate(" + [+d.x, +d.y] + ")rotate(" + d.rotate + ")";
        })
        .attr("text-anchor", "middle")
        .text(function(d) { return d.text });
}

console.log("Loading data");
d3.json("corpus.json", function(error, data) {
    if (error) throw error;

    var text = data.text;

    console.log("calculating stats");
    word_counts = getWordCounts(text);

    // document.getElementById("corpus").innerHTML = word_counts.map(function(x) { return x.text });
    console.log(word_counts.map(function(x) { return x.text }));

    var wordcloud = d3.layout.cloud()
        .size([500, 500])
        // .words(word_counts)
        .words(word_counts)
        .padding(2)
        .rotate(function() { return ~~(Math.random() * 2) * 90; })
        .fontSize(function(d) { return d.count * 8; })
        .on("end", drawCloud) // register a callback to insert the elements into the group once the layout has been finalized
        .start();

});