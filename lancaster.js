/**
 * Lancaster Stemmer (Paice/Husk Stemmer) Implementation
 * A more aggressive stemming algorithm than Porter stemmer
 * 
 * @param {string} word - The word to stem
 * @returns {string} - The stemmed word
 */
function lancasterStemmer(word) {
    if (!word || word.length === 0) {
        return word;
    }

    // Convert to lowercase
    word = word.toLowerCase();

    // Minimum word length for stemming
    if (word.length < 3) {
        return word;
    }

    // Lancaster stemmer rules
    // Format: [suffix, replacement, condition]
    // Condition: 'v' = vowel, 'c' = consonant, 'd' = digit, 'l' = letter
    const rules = [
        // Rule set 1: General suffix removal
        ['ia', '', 'v'],
        ['a', '', 'v'],
        ['bb', 'b', ''],
        ['cy', 'c', ''],
        ['dd', 'd', ''],
        ['ee', 'e', ''],
        ['ff', 'f', ''],
        ['gg', 'g', ''],
        ['gh', 'h', ''],
        ['ic', '', 'v'],
        ['ied', 'y', 'v'],
        ['ier', 'y', 'v'],
        ['ies', 'y', 'v'],
        ['ily', 'y', 'v'],
        ['ing', '', 'v'],
        ['iingly', '', 'v'],
        ['ingly', '', 'v'],
        ['inly', '', 'v'],
        ['ion', '', 'v'],
        ['ly', '', 'v'],
        ['mm', 'm', ''],
        ['nn', 'n', ''],
        ['pp', 'p', ''],
        ['rr', 'r', ''],
        ['ss', 's', ''],
        ['tt', 't', ''],
        ['ui', 'u', 'v'],
        ['us', '', 'v'],
        ['vv', 'v', ''],
        ['zz', 'z', ''],
        
        // Rule set 2: More specific patterns
        ['al', '', 'v'],
        ['ance', '', 'v'],
        ['ant', '', 'v'],
        ['ary', '', 'v'],
        ['ate', '', 'v'],
        ['ed', '', 'v'],
        ['ence', '', 'v'],
        ['ent', '', 'v'],
        ['ery', '', 'v'],
        ['ful', '', 'v'],
        ['ible', '', 'v'],
        ['ic', '', 'v'],
        ['ical', '', 'v'],
        ['ify', '', 'v'],
        ['ine', '', 'v'],
        ['ion', '', 'v'],
        ['ise', '', 'v'],
        ['ish', '', 'v'],
        ['ism', '', 'v'],
        ['ist', '', 'v'],
        ['ite', '', 'v'],
        ['ity', '', 'v'],
        ['ive', '', 'v'],
        ['ize', '', 'v'],
        ['less', '', 'v'],
        ['ly', '', 'v'],
        ['ment', '', 'v'],
        ['ness', '', 'v'],
        ['ous', '', 'v'],
        ['ship', '', 'v'],
        ['sion', '', 'v'],
        ['tion', '', 'v'],
        ['ure', '', 'v'],
        ['y', '', 'v'],
        
        // Rule set 3: Special cases
        ['able', '', 'v'],
        ['age', '', 'v'],
        ['al', '', 'v'],
        ['ally', '', 'v'],
        ['ance', '', 'v'],
        ['ant', '', 'v'],
        ['ary', '', 'v'],
        ['ate', '', 'v'],
        ['ation', '', 'v'],
        ['ative', '', 'v'],
        ['ator', '', 'v'],
        ['atory', '', 'v'],
        ['ed', '', 'v'],
        ['edly', '', 'v'],
        ['edness', '', 'v'],
        ['ee', '', 'v'],
        ['eer', '', 'v'],
        ['ence', '', 'v'],
        ['ency', '', 'v'],
        ['ent', '', 'v'],
        ['ently', '', 'v'],
        ['er', '', 'v'],
        ['ery', '', 'v'],
        ['es', '', 'v'],
        ['est', '', 'v'],
        ['ful', '', 'v'],
        ['fully', '', 'v'],
        ['ible', '', 'v'],
        ['ibly', '', 'v'],
        ['ic', '', 'v'],
        ['ical', '', 'v'],
        ['ically', '', 'v'],
        ['ied', 'y', 'v'],
        ['ier', 'y', 'v'],
        ['ies', 'y', 'v'],
        ['ily', 'y', 'v'],
        ['ing', '', 'v'],
        ['ingly', '', 'v'],
        ['ion', '', 'v'],
        ['ional', '', 'v'],
        ['ionally', '', 'v'],
        ['ioned', '', 'v'],
        ['ioner', '', 'v'],
        ['ioning', '', 'v'],
        ['ions', '', 'v'],
        ['ious', '', 'v'],
        ['iously', '', 'v'],
        ['ise', '', 'v'],
        ['ised', '', 'v'],
        ['iser', '', 'v'],
        ['ises', '', 'v'],
        ['ising', '', 'v'],
        ['ism', '', 'v'],
        ['ist', '', 'v'],
        ['istic', '', 'v'],
        ['istically', '', 'v'],
        ['ists', '', 'v'],
        ['ite', '', 'v'],
        ['ited', '', 'v'],
        ['itely', '', 'v'],
        ['ites', '', 'v'],
        ['iting', '', 'v'],
        ['ition', '', 'v'],
        ['itional', '', 'v'],
        ['itionally', '', 'v'],
        ['itions', '', 'v'],
        ['itive', '', 'v'],
        ['itively', '', 'v'],
        ['ity', '', 'v'],
        ['ive', '', 'v'],
        ['ively', '', 'v'],
        ['iveness', '', 'v'],
        ['ivity', '', 'v'],
        ['ize', '', 'v'],
        ['ized', '', 'v'],
        ['izer', '', 'v'],
        ['izers', '', 'v'],
        ['izes', '', 'v'],
        ['izing', '', 'v'],
        ['less', '', 'v'],
        ['lessly', '', 'v'],
        ['lessness', '', 'v'],
        ['ly', '', 'v'],
        ['ment', '', 'v'],
        ['mental', '', 'v'],
        ['mentally', '', 'v'],
        ['mented', '', 'v'],
        ['menting', '', 'v'],
        ['ments', '', 'v'],
        ['ness', '', 'v'],
        ['nesses', '', 'v'],
        ['ous', '', 'v'],
        ['ously', '', 'v'],
        ['ousness', '', 'v'],
        ['ship', '', 'v'],
        ['ships', '', 'v'],
        ['sion', '', 'v'],
        ['sional', '', 'v'],
        ['sionally', '', 'v'],
        ['sioned', '', 'v'],
        ['sioner', '', 'v'],
        ['sioning', '', 'v'],
        ['sions', '', 'v'],
        ['tion', '', 'v'],
        ['tional', '', 'v'],
        ['tionally', '', 'v'],
        ['tioned', '', 'v'],
        ['tioner', '', 'v'],
        ['tioning', '', 'v'],
        ['tions', '', 'v'],
        ['tious', '', 'v'],
        ['tiously', '', 'v'],
        ['ure', '', 'v'],
        ['ured', '', 'v'],
        ['ures', '', 'v'],
        ['uring', '', 'v'],
        ['y', '', 'v'],
    ];

    // Helper function to check if a character is a vowel
    function isVowel(char) {
        return /[aeiou]/.test(char);
    }

    // Helper function to check if a character is a consonant
    function isConsonant(char) {
        return /[bcdfghjklmnpqrstvwxyz]/.test(char);
    }

    // Helper function to check if word has a vowel
    function hasVowel(word) {
        return /[aeiou]/.test(word);
    }

    // Helper function to check condition
    function checkCondition(word, condition) {
        if (!condition || condition === '') {
            return true;
        }
        if (condition === 'v') {
            return hasVowel(word);
        }
        if (condition === 'c') {
            return !hasVowel(word);
        }
        return true;
    }

    // Apply rules iteratively
    let changed = true;
    let iterations = 0;
    const maxIterations = 100; // Prevent infinite loops

    while (changed && iterations < maxIterations) {
        changed = false;
        iterations++;

        // Try each rule
        for (const [suffix, replacement, condition] of rules) {
            if (word.length <= suffix.length) {
                continue;
            }

            // Check if word ends with suffix
            if (word.endsWith(suffix)) {
                const stem = word.slice(0, -suffix.length);
                
                // Check minimum stem length
                if (stem.length < 2) {
                    continue;
                }

                // Check condition
                if (!checkCondition(stem, condition)) {
                    continue;
                }

                // Apply replacement
                word = stem + replacement;
                changed = true;
                break; // Apply one rule per iteration
            }
        }
    }

    // Final cleanup: remove trailing 'e' if word is long enough
    if (word.length > 3 && word.endsWith('e') && hasVowel(word.slice(0, -1))) {
        word = word.slice(0, -1);
    }

    // Remove trailing 'y' if preceded by a consonant and word is long enough
    if (word.length > 3 && word.endsWith('y') && isConsonant(word[word.length - 2])) {
        word = word.slice(0, -1) + 'i';
    }

    return word;
}

// Export the function
export { lancasterStemmer };

// Also export as default for convenience
export default lancasterStemmer;

