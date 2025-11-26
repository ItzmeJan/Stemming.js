/**
 * Snowball Stemmer (Porter2) Algorithm Implementation
 * An improved version of the Porter stemmer
 * Based on the Snowball framework and Porter2 algorithm
 * 
 * @param {string} word - The word to stem
 * @returns {string} - The stemmed word
 */
function snowballStemmer(word) {
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

    // Check if a letter is a consonant (considering 'y')
    function isConsonantLetter(word, index) {
        const char = word[index];
        if (index < 0 || index >= word.length) {
            return false;
        }
        if (isVowel(char)) {
            return false;
        }
        if (char === 'y' && index > 0 && isConsonantLetter(word, index - 1)) {
            return true;
        }
        return /[bcdfghjklmnpqrstvwxyz]/.test(char);
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

    // Check if word ends with a short syllable
    function isShort(word) {
        return measure(word) === 1 && endsWithCVC(word);
    }

    // R1: Region after the first consonant following a vowel
    function getR1(word) {
        let i = 0;
        const len = word.length;
        
        // Skip leading consonants
        while (i < len && isConsonantLetter(word, i)) {
            i++;
        }
        
        // Find first vowel
        while (i < len && isVowelLetter(word, i)) {
            i++;
        }
        
        // Find first consonant after vowel
        while (i < len && isConsonantLetter(word, i)) {
            i++;
        }
        
        return i;
    }

    // R2: Region after the first consonant following a vowel in R1
    function getR2(word) {
        const r1 = getR1(word);
        if (r1 === word.length) {
            return r1;
        }
        
        let i = r1;
        const len = word.length;
        
        // Find first vowel in R1
        while (i < len && isVowelLetter(word, i)) {
            i++;
        }
        
        // Find first consonant after vowel in R1
        while (i < len && isConsonantLetter(word, i)) {
            i++;
        }
        
        return i;
    }

    // Check if suffix is in R1
    function inR1(word, suffix) {
        const r1 = getR1(word);
        return word.length - suffix.length >= r1;
    }

    // Check if suffix is in R2
    function inR2(word, suffix) {
        const r2 = getR2(word);
        return word.length - suffix.length >= r2;
    }

    // Step 0: Remove apostrophes and 's
    word = word.replace(/'s$/, '');
    word = word.replace(/'$/, '');

    // Step 1a: Plural and past participles
    if (word.endsWith('sses')) {
        word = word.slice(0, -4) + 'ss';
    } else if (word.endsWith('ied') || word.endsWith('ies')) {
        const stem = word.slice(0, -3);
        word = stem.length > 1 ? stem + 'i' : stem + 'ie';
    } else if (word.endsWith('us') || word.endsWith('ss')) {
        // Keep as is
    } else if (word.endsWith('s')) {
        const beforeS = word.slice(0, -1);
        if (containsVowel(beforeS)) {
            word = beforeS;
        }
    }

    // Step 1b: More complex endings
    let step1bApplied = false;
    if (word.endsWith('eed') || word.endsWith('eedly')) {
        const suffix = word.endsWith('eedly') ? 'eedly' : 'eed';
        const stem = word.slice(0, -suffix.length);
        if (inR1(word, suffix)) {
            word = stem + 'ee';
        }
    } else if (word.endsWith('ed') || word.endsWith('edly') || 
               word.endsWith('ing') || word.endsWith('ingly')) {
        let suffix = '';
        if (word.endsWith('edly')) {
            suffix = 'edly';
        } else if (word.endsWith('ingly')) {
            suffix = 'ingly';
        } else if (word.endsWith('ed')) {
            suffix = 'ed';
        } else if (word.endsWith('ing')) {
            suffix = 'ing';
        }
        
        const stem = word.slice(0, -suffix.length);
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
        } else if (isShort(word)) {
            word = word + 'e';
        }
    }

    // Step 1c: Replace 'y' or 'Y' with 'i' if preceded by a consonant
    if (word.length > 1 && (word.endsWith('y') || word.endsWith('Y'))) {
        const stem = word.slice(0, -1);
        if (isConsonantLetter(word, word.length - 2)) {
            word = stem + 'i';
        }
    }

    // Step 2: Suffix replacement
    const step2Replacements = [
        ['ization', 'ize'],
        ['ational', 'ate'],
        ['fulness', 'ful'],
        ['ousness', 'ous'],
        ['iveness', 'ive'],
        ['tional', 'tion'],
        ['biliti', 'ble'],
        ['lessli', 'less'],
        ['entli', 'ent'],
        ['ation', 'ate'],
        ['alism', 'al'],
        ['aliti', 'al'],
        ['ousli', 'ous'],
        ['iviti', 'ive'],
        ['fulli', 'ful'],
        ['enci', 'ence'],
        ['anci', 'ance'],
        ['abli', 'able'],
        ['izer', 'ize'],
        ['ator', 'ate'],
        ['alli', 'al'],
        ['bli', 'ble'],
        ['ogi', 'og'],
        ['li', '']
    ];

    for (const [suffix, replacement] of step2Replacements) {
        if (word.endsWith(suffix)) {
            const stem = word.slice(0, -suffix.length);
            if (inR1(word, suffix)) {
                // Special case for 'li'
                if (suffix === 'li' && stem.length >= 3) {
                    const lastChar = stem[stem.length - 1];
                    if (/[cdeghkmnrt]/.test(lastChar)) {
                        word = stem + replacement;
                        break;
                    }
                } else {
                    word = stem + replacement;
                    break;
                }
            }
        }
    }

    // Step 3: More suffix replacements
    const step3Replacements = [
        ['ational', 'ate'],
        ['tional', 'tion'],
        ['alize', 'al'],
        ['icate', 'ic'],
        ['iciti', 'ic'],
        ['ical', 'ic'],
        ['ful', ''],
        ['ness', '']
    ];

    for (const [suffix, replacement] of step3Replacements) {
        if (word.endsWith(suffix)) {
            const stem = word.slice(0, -suffix.length);
            if (inR1(word, suffix)) {
                word = stem + replacement;
                break;
            }
        }
    }

    // Step 4: Remove additional suffixes
    const step4Replacements = [
        ['al', ''],
        ['ance', ''],
        ['ence', ''],
        ['er', ''],
        ['ic', ''],
        ['able', ''],
        ['ible', ''],
        ['ant', ''],
        ['ement', ''],
        ['ment', ''],
        ['ent', ''],
        ['ism', ''],
        ['ate', ''],
        ['iti', ''],
        ['ous', ''],
        ['ive', ''],
        ['ize', '']
    ];

    for (const [suffix, replacement] of step4Replacements) {
        if (word.endsWith(suffix)) {
            const stem = word.slice(0, -suffix.length);
            if (inR2(word, suffix)) {
                word = stem + replacement;
                break;
            }
        }
    }

    // Special case for 'ion'
    if (word.endsWith('ion')) {
        const stem = word.slice(0, -3);
        if (inR2(word, 'ion') && (stem.endsWith('s') || stem.endsWith('t'))) {
            word = stem;
        }
    }

    // Step 5a: Remove final 'e'
    if (word.endsWith('e')) {
        const stem = word.slice(0, -1);
        if (inR2(word, 'e') || (inR1(word, 'e') && !endsWithCVC(stem))) {
            word = stem;
        }
    }

    // Step 5b: Remove final 'l' if double
    if (word.endsWith('ll') && inR2(word, 'l')) {
        word = word.slice(0, -1);
    }

    return word;
}

// Export the function
export { snowballStemmer };

// Also export as default for convenience
export default snowballStemmer;

