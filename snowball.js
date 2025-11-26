function snowballStem(word) {
    word = word.toLowerCase();

    if (word.length < 3) return word;

    // mark Y as vowel when needed
    word = word.replace(/^y/, "Y").replace(/([aeiou])y/g, "$1Y");

    const vowels = /[aeiouY]/;

    const measure = (str) => {
        return (str.match(/[^aeiouY]+[aeiouY]+/g) || []).length;
    };

    const hasVowel = (str) => vowels.test(str);

    const endsWithDouble = (str) => /(bb|dd|ff|gg|mm|nn|pp|rr|tt)$/.test(str);

    const cvc = (str) => /[^aeiou][aeiou][^aeiouwxy]$/.test(str);

    const step1a = () => {
        if (word.endsWith("sses")) word = word.slice(0, -2);
        else if (word.endsWith("ies") || word.endsWith("ied")) {
            if (word.length > 4) word = word.slice(0, -2);
            else word = word.slice(0, -1);
        } else if (word.endsWith("s") && !word.endsWith("ss")) {
            word = word.slice(0, -1);
        }
    };

    const step1b = () => {
        let didReplace = false;
        if (word.endsWith("eed") || word.endsWith("eedly")) {
            let stem = word.replace(/eedly?$/, "");
            if (measure(stem) > 0) {
                word = word.replace(/eedly?$/, "ee");
            }
        } else {
            if (word.match(/(ed|edly|ing|ingly)$/)) {
                let stem = word.replace(/(ed|edly|ing|ingly)$/, "");
                if (hasVowel(stem)) {
                    word = stem;
                    didReplace = true;
                }
            }

            if (didReplace) {
                if (word.endsWith("at") || word.endsWith("bl") || word.endsWith("iz")) {
                    word += "e";
                } else if (endsWithDouble(word)) {
                    word = word.slice(0, -1);
                } else if (measure(word) === 1 && cvc(word)) {
                    word += "e";
                }
            }
        }
    };

    const step1c = () => {
        if (word.endsWith("y") || word.endsWith("Y")) {
            let stem = word.slice(0, -1);
            if (hasVowel(stem)) word = stem + "i";
        }
    };

    step1a();
    step1b();
    step1c();

    // Convert Ys back to y
    word = word.replace(/Y/g, "y");
    return word;
}
