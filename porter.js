function porterStemmer(word) {
    if (word.length < 3) return word;

    const vowels = /[aeiouy]/;
    const doubleConsonant = /(bb|dd|ff|gg|mm|nn|pp|rr|tt)$/;
    const cvc = (str) => /([^aeiou][aeiou][^aeiouwxy])$/.test(str);

    const measure = (str) => {
        let m = 0, state = 0;
        for (let i = 0; i < str.length; i++) {
            if (vowels.test(str[i])) {
                if (state === 0) state = 1;
            } else {
                if (state === 1) {
                    state = 0;
                    m++;
                }
            }
        }
        return m;
    };

    const step1a = (w) => {
        if (w.endsWith("sses")) return w.slice(0, -2);
        if (w.endsWith("ies")) return w.slice(0, -2);
        if (w.endsWith("ss")) return w;
        if (w.endsWith("s")) return w.slice(0, -1);
        return w;
    };

    const step1b = (w) => {
        let stem;
        if (w.endsWith("eed")) {
            stem = w.slice(0, -3);
            if (measure(stem) > 0) return stem + "ee";
            return w;
        }

        const pattern = /(ed|ing)$/;
        if (pattern.test(w)) {
            stem = w.replace(pattern, "");
            if (vowels.test(stem)) {
                if (stem.endsWith("at") || stem.endsWith("bl") || stem.endsWith("iz")) {
                    return stem + "e";
                } else if (doubleConsonant.test(stem)) {
                    return stem.slice(0, -1);
                } else if (measure(stem) === 1 && cvc(stem)) {
                    return stem + "e";
                }
                return stem;
            }
        }
        return w;
    };

    const step1c = (w) => {
        if (w.endsWith("y")) {
            const stem = w.slice(0, -1);
            if (vowels.test(stem)) return stem + "i";
        }
        return w;
    };

    word = step1a(word);
    word = step1b(word);
    word = step1c(word);

    return word;
}
