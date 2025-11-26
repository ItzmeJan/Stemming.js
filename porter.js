/**
 * Porter Stemmer Algorithm Implementation
 * A widely used stemming algorithm for English words
 * Based on the algorithm by Martin Porter
 * 
 * @param {string} word - The word to stem
 * @returns {string} - The stemmed word
 */
function porterStemmer(word) {
    if (!word || word.length === 0) {
        return word;
    }

    // Convert to lowercase
    word = word.toLowerCase();

    // Minimum word length for stemming
    if (word.length < 3) {
        return word;
    }

    // Helper function to check if a character is a vowel
    function isVowel(char) {
        return /[aeiou]/.test(char);
    }

    // Helper function to check if a character is a consonant
    function isConsonant(char) {
        return /[bcdfghjklmnpqrstvwxyz]/.test(char);
    }

    // Check if character at index is a consonant
    function isConsonantAt(word, index) {
        if (index < 0 || index >= word.length) {
            return false;
        }
        return isConsonant(word[index]);
    }

    // Check if character at index is a vowel
    function isVowelAt(word, index) {
        if (index < 0 || index >= word.length) {
            return false;
        }
        return isVowel(word[index]);
    }

    // Check if a letter is a consonant (considering 'y')
    function isConsonantLetter(word, index) {
        const char = word[index];
        if (isVowel(char)) {
            return false;
        }
        if (char === 'y' && index > 0 && isConsonantAt(word, index - 1)) {
            return true;
        }
        return isConsonant(char);
    }

    // Check if a letter is a vowel (considering 'y')
    function isVowelLetter(word, index) {
        return !isConsonantLetter(word, index);
    }

    // Measure the number of consonant-vowel sequences
    function measure(word) {
        let count = 0;
        let i = 0;
        const len = word.length;

        // Skip leading consonants
        while (i < len && isConsonantLetter(word, i)) {
            i++;
        }

        // Count CV sequences
        while (i < len) {
            // Find vowel
            while (i < len && isVowelLetter(word, i)) {
                i++;
            }
            if (i >= len) break;

            // Find consonant
            while (i < len && isConsonantLetter(word, i)) {
                i++;
            }
            count++;
        }

        return count;
    }

    // Check if stem contains a vowel
    function containsVowel(word) {
        for (let i = 0; i < word.length; i++) {
            if (isVowelLetter(word, i)) {
                return true;
            }
        }
        return false;
    }

    // Check if word ends with double consonant
    function endsWithDoubleConsonant(word) {
        if (word.length < 2) {
            return false;
        }
        const last = word[word.length - 1];
        const secondLast = word[word.length - 2];
        return last === secondLast && isConsonantLetter(word, word.length - 1);
    }

    // Check if word ends with CVC pattern (consonant-vowel-consonant)
    function endsWithCVC(word) {
        if (word.length < 3) {
            return false;
        }
        const len = word.length;
        return isConsonantLetter(word, len - 3) &&
               isVowelLetter(word, len - 2) &&
               isConsonantLetter(word, len - 1) &&
               !/[wxy]/.test(word[len - 1]);
    }

    // Step 1a: Plural and past participles
    if (word.endsWith('sses')) {
        word = word.slice(0, -4) + 'ss';
    } else if (word.endsWith('ies')) {
        word = word.slice(0, -3) + 'i';
    } else if (word.endsWith('ss')) {
        // Keep 'ss'
    } else if (word.endsWith('s')) {
        word = word.slice(0, -1);
    }

    // Step 1b: More complex endings
    let step1bApplied = false;
    if (word.endsWith('eed')) {
        const stem = word.slice(0, -3);
        if (measure(stem) > 0) {
            word = stem + 'ee';
        }
    } else if (word.endsWith('ed')) {
        const stem = word.slice(0, -2);
        if (containsVowel(stem)) {
            word = stem;
            step1bApplied = true;
        }
    } else if (word.endsWith('ing')) {
        const stem = word.slice(0, -3);
        if (containsVowel(stem)) {
            word = stem;
            step1bApplied = true;
        }
    }

    // Step 1b: Special cases after removing 'ed' or 'ing'
    if (step1bApplied) {
        if (word.endsWith('at') || word.endsWith('bl') || word.endsWith('iz')) {
            word = word + 'e';
        } else if (endsWithDoubleConsonant(word) && !/[lsz]/.test(word[word.length - 1])) {
            word = word.slice(0, -1);
        } else if (measure(word) === 1 && endsWithCVC(word)) {
            word = word + 'e';
        }
    }

    // Step 1c: Replace 'y' with 'i' if preceded by a consonant
    if (word.endsWith('y') && containsVowel(word.slice(0, -1))) {
        word = word.slice(0, -1) + 'i';
    }

    // Step 2: Suffix replacement
    const step2Replacements = [
        ['ational', 'ate'],
        ['tional', 'tion'],
        ['enci', 'ence'],
        ['anci', 'ance'],
        ['izer', 'ize'],
        ['abli', 'able'],
        ['alli', 'al'],
        ['entli', 'ent'],
        ['eli', 'e'],
        ['ousli', 'ous'],
        ['ization', 'ize'],
        ['ation', 'ate'],
        ['ator', 'ate'],
        ['alism', 'al'],
        ['iveness', 'ive'],
        ['fulness', 'ful'],
        ['ousness', 'ous'],
        ['aliti', 'al'],
        ['iviti', 'ive'],
        ['biliti', 'ble'],
        ['logi', 'log']
    ];

    for (const [suffix, replacement] of step2Replacements) {
        if (word.endsWith(suffix)) {
            const stem = word.slice(0, -suffix.length);
            if (measure(stem) > 0) {
                word = stem + replacement;
                break;
            }
        }
    }

    // Step 3: More suffix replacements
    const step3Replacements = [
        ['icate', 'ic'],
        ['ative', ''],
        ['alize', 'al'],
        ['iciti', 'ic'],
        ['ical', 'ic'],
        ['ful', ''],
        ['ness', '']
    ];

    for (const [suffix, replacement] of step3Replacements) {
        if (word.endsWith(suffix)) {
            const stem = word.slice(0, -suffix.length);
            if (measure(stem) > 0) {
                word = stem + replacement;
                break;
            }
        }
    }

    // Step 4: Remove additional suffixes
    const step4Replacements = [
        'al', 'ance', 'ence', 'er', 'ic', 'able', 'ible', 'ant', 'ement',
        'ment', 'ent', 'ion', 'ou', 'ism', 'ate', 'iti', 'ous', 'ive', 'ize'
    ];

    for (const suffix of step4Replacements) {
        if (word.endsWith(suffix)) {
            const stem = word.slice(0, -suffix.length);
            if (measure(stem) > 1) {
                // Special case for 'ion'
                if (suffix === 'ion' && (stem.endsWith('s') || stem.endsWith('t'))) {
                    word = stem;
                    break;
                } else if (suffix !== 'ion') {
                    word = stem;
                    break;
                }
            }
        }
    }

    // Step 5a: Remove final 'e'
    if (word.endsWith('e')) {
        const stem = word.slice(0, -1);
        if (measure(stem) > 1) {
            word = stem;
        } else if (measure(stem) === 1 && !endsWithCVC(stem)) {
            word = stem;
        }
    }

    // Step 5b: Remove final 'l' if double
    if (word.endsWith('ll') && measure(word) > 1) {
        word = word.slice(0, -1);
    }

    return word;
}

// Export the function
export { porterStemmer };

// Also export as default for convenience
export default porterStemmer;

