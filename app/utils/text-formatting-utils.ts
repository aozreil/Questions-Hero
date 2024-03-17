import katex from "katex";

const htmlContentTags = [
    "<p>",
    "<br>",
    "<li>",
    "<ul>",
    "<ol>",
    "<h1>",
    "<h2>",
    "<h3>",
    "<h4>",
    "<h5>",
    "<h6>",
    "<div>",
    "<hr>",
    "</p>",
    "</br>",
    "</li>",
    "</ul>",
    "</ol>",
    "</h1>",
    "</h2>",
    "</h3>",
    "</h4>",
    "</h5>",
    "</h6>",
    "</div>",
    "</hr>",
    "<b>",
    "</b>",
    "<B>",
    "</B>",
];

export function replaceHTMLCodesByEmptyString(text: string) {
    let regex;
    htmlContentTags.forEach((key) => {
        regex = new RegExp(`[ ]*${key}[ ]*`, "g");
        text = text.replace(regex, "");
    });

    return removeKatexFromString(text.replace(/"/g, '')
      .replace(new RegExp('<br>', 'g'), ' ')
      .replace(new RegExp('\n', 'g'), ' '))
      .replace(/"/g, '');
}

/* eslint no-constant-condition:0 */
const findEndOfMath = function (
    delimiter: string,
    text: string,
    startIndex: number
) {
    // Adapted from
    // https://github.com/Khan/perseus/blob/master/src/perseus-markdown.jsx
    let index = startIndex;
    let braceLevel = 0;

    const delimLength = delimiter.length;

    while (index < text.length) {
        const character = text[index];

        if (
            braceLevel <= 0 &&
            text.slice(index, index + delimLength) === delimiter
        ) {
            return index;
        } else if (character === "\\") {
            index++;
        } else if (character === "{") {
            braceLevel++;
        } else if (character === "}") {
            braceLevel--;
        }

        index++;
    }

    return -1;
};

const escapeRegex = function (string: string) {
    return string.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
};

const amsRegex = /^\\begin{/;

const splitAtDelimiters = function (text: any, delimiters: any) {
    let index;
    const data = [];

    const regexLeft = new RegExp(
        "(" + delimiters.map((x: any) => escapeRegex(x.left)).join("|") + ")"
    );

    while (true) {
        index = text.search(regexLeft);
        if (index === -1) {
            break;
        }
        if (index > 0) {
            data.push({
                type: "text",
                data: text.slice(0, index),
            });
            text = text.slice(index); // now text starts with delimiter
        }
        // ... so this always succeeds:
        // eslint-disable-next-line no-loop-func
        const i = delimiters.findIndex((delim: any) => text.startsWith(delim.left));
        index = findEndOfMath(delimiters[i].right, text, delimiters[i].left.length);
        if (index === -1) {
            break;
        }
        const rawData = text.slice(0, index + delimiters[i].right.length);
        const math = amsRegex.test(rawData)
            ? rawData
            : text.slice(delimiters[i].left.length, index);
        data.push({
            type: "math",
            data: math,
            rawData,
            display: delimiters[i].display,
        });
        text = text.slice(index + delimiters[i].right.length);
    }

    if (text !== "") {
        data.push({
            type: "text",
            data: text,
        });
    }

    return data;
};

const CodesToHTMLMap = {
    S1U1B1: "<sub>",
    S1U1B0: "</sub>",
    S1U1P1: "<sup>",
    S1S1P0: "</sup>",
    F1F1F1S1: '<font face="symbol">',
    F1F1F10: "</font>",
    F1S1S1W1: '<font face="wingdings">',
    F2S2S2W1: "<font style=\"font-family: 'Wingdings 2'\">",
    F3S3S3W1: "<font style=\"font-family: 'Wingdings 3'\">",
} as const;

const FileCompressionStates = {
    ORIGINAL: "original",
    COMPRESSED: "compressed",
};

export function getFileCompressionState() {
    return FileCompressionStates;
}

export function getContentHtmlTags() {
    return htmlContentTags;
}

export const getIndexFromSlug = (slug: string) => {
    return slug.split("-").shift();
};

export function getQuizTitleParts(quizTitle: string) {
    const regex = new RegExp(/(Quiz|Exam)\W*[0-9]+\W*:?/);
    const matches = quizTitle.match(regex);

    let quizNumber = "";
    let quizTitleWithoutNumber = quizTitle;
    if (matches && matches.length > 0) {
        quizNumber = matches[0].replace(":", "").trim();
        quizTitleWithoutNumber = quizTitle.replace(matches[0], "").trim();
    }

    return {
        index: quizNumber,
        title: quizTitleWithoutNumber,
    };
}

export function mapCodesToHTMLTags(text: string) {
    let regex;
    Object.keys(CodesToHTMLMap).forEach((key) => {
        regex = new RegExp(key, "g");
        text = text.replace(
            regex,
            CodesToHTMLMap[key as keyof typeof CodesToHTMLMap]
        );
    });

    return text;
}

export function removeImage(text: string) {
    const regex =
        /[a-z0-9]*_[a-z0-9]*_[a-z0-9]*_[a-z0-9]*_[a-z0-9]*_[a-zA-Z0-9_]*[00|11]/gm;
    const matches = text.match(regex);

    if (matches && matches.length) {
        for (const match of matches) {
            text = text.replace(match, "");
        }
    }

    return text;
}

function removeSpecialCharacterAtTheEnd(text: string) {
    if (text) {
        let result = text.replace(/\s+$/, ""); // use this instead of trimEnd because some safari version does not supported it
        return result.replace(/[&\/\\#,+($~%.'":*?<{]+$/g, "");
    }
    return text;
}

export const latexDelimitersList = [
    { left: "$$", right: "$$", display: true },
    { left: "\\(", right: "\\)", display: false },
    { left: "\\begin{equation}", right: "\\end{equation}", display: true },
    { left: "\\begin{equation*}", right: "\\end{equation*}", display: true },
    { left: "\\begin{align}", right: "\\end{align}", display: true },
    { left: "\\begin{align*}", right: "\\end{align*}", display: true },
    { left: "\\begin{alignat}", right: "\\end{alignat}", display: true },
    { left: "\\begin{alignat*}", right: "\\end{alignat*}", display: true },
    { left: "\\begin{gather}", right: "\\end{gather}", display: true },
    { left: "\\begin{gather*}", right: "\\end{gather*}", display: true },
    { left: "\\begin{CD}", right: "\\end{CD}", display: true },
    { left: "\\begin{CD*}", right: "\\end{CD*}", display: true },
    { left: "\\[", right: "\\]", display: true },
];

export function getLatexSegments(text: any): {
    type: "math" | "text";
    data: string;
    rawData: undefined | string;
    display: undefined | boolean;
}[] {
    //@ts-ignore
    return splitAtDelimiters(text, latexDelimitersList);
}

export function replaceCodesByEmptyString(text: string) {
    let regex;
    Object.keys(CodesToHTMLMap).forEach((key) => {
        regex = new RegExp(`[ ]*${key}[ ]*`, "g");
        text = text.replace(regex, "");
    });

    return text;
}

export function getFileObjectMyName(fileName: string) {
    const cloudFrontStorageUrl = "https://d2lvgg3v3hfg70.cloudfront.net";
    const nameParts = fileName.split("_");
    const fileFolder = nameParts[nameParts.length - 2];
    const filePath =
        cloudFrontStorageUrl + "/" + fileFolder + "/" + fileName + ".jpg";
    const isInline = nameParts[nameParts.length - 1] === "11";
    return {
        path: filePath,
        is_inline: isInline,
        folder: fileFolder,
    };
}

export function getRegexImageUUID() {
    return "[a-z0-9]{8}_[a-z0-9]{4}_[a-z0-9]{4,}_[a-z0-9]{4,}_[a-z0-9]{4,}_[a-zA-Z0-9_]";
}

function splitPerOption(txt: string) {
    let newOption = [];
    txt = txt.replace(/\s+/g, " ");
    newOption = txt.split(/(?=[A-Z]([)]))/g);
    newOption = newOption.filter((x) => x !== ")");
    const result = newOption.join("\n");
    return result;
}
export function parseImageUUIDInQuestionText(
    text: string,
    generateURLs: boolean = false
): { parsedText: string; imagesURLs: string[] } {
    const regex = new RegExp(`${getRegexImageUUID()}*[00|11]`, "gm");
    const matches = text.match(regex);
    const imagesURLs = [];
    if (matches && matches.length) {
        for (const match of matches) {
            if (generateURLs) {
                const file = getFileObjectMyName(match);
                imagesURLs.push(file.path);
            }
            text = text.replace(match, "");
        }
        const firstOptionIndex = text.lastIndexOf("A)");
        if (firstOptionIndex !== -1) {
            let answerText = text.substring(firstOptionIndex);
            answerText = answerText
                .split(" ")
                .filter((s) => s)
                .join(" ");
            answerText = splitPerOption(answerText);
            let options = answerText.split("\n");
            if (options.length === 1) {
                options = answerText.split("<br>");
            }
            answerText = "";
            options.forEach((option) => {
                if (option.length !== 2 && option.length !== 3) {
                    answerText += option + "\n";
                }
            });
            text = text.substr(0, firstOptionIndex) + answerText;
        }
    }
    return { parsedText: text, imagesURLs };
}

const lowers = [
    "A",
    "An",
    "The",
    "And",
    "But",
    "Or",
    "For",
    "Nor",
    "As",
    "At",
    "By",
    "For",
    "From",
    "In",
    "Into",
    "Near",
    "Of",
    "On",
    "Onto",
    "To",
    "With",
];
const lLowers = [
    "a",
    "an",
    "the",
    "and",
    "but",
    "or",
    "for",
    "nor",
    "as",
    "at",
    "by",
    "for",
    "from",
    "in",
    "into",
    "near",
    "of",
    "on",
    "onto",
    "to",
    "with",
];

function toTitleCase(str: string) {
    let i;
    let j;

    str = str.replace(/([^\W_]+[^\s-]*) */g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1);
    });

    for (i = 0, j = lowers.length; i < j; i++) {
        str = str.replace(new RegExp("\\s" + lowers[i] + "\\s", "g"), (txt) => {
            return txt?.toLowerCase();
        });
    }
    return str;
}

function isNullOrWhitespace(input: string | null | undefined): boolean {
    if (input == null) return true;

    return input.replace(/\s/gi, "").length < 1;
}

function handleTitleLength(
    titleText: string,
    flatWords: string[],
    splittingChar: string
) {
    const result = titleText.split(" ").splice(0, 10);
    if (lLowers.indexOf(result[result.length - 1]?.toLowerCase()) === -1) {
        return removeSpecialCharacterAtTheEnd(toTitleCase(result.join(" ")));
    } else {
        let index = result.length;
        while (result.length - 1 !== flatWords.length - 1) {
            if (lLowers.indexOf(result[result.length - 1]?.toLowerCase()) !== -1) {
                if (
                    result.length < flatWords.length &&
                    flatWords[result.length].includes(splittingChar)
                ) {
                    break;
                }
                result.push(flatWords[index++]);
            } else {
                break;
            }
        }
        return removeSpecialCharacterAtTheEnd(result.join(" "));
    }
}

function splitTextLongerThanTenWorldOrBreakLine(
    line: string,
    flatWords: string[],
    splittingChar: string
) {
    const texts = line.split(".");
    let textToReturn = texts[0];
    if (texts[0].split(" ").length >= 10) {
        textToReturn = handleTitleLength(texts[0], flatWords, splittingChar);
    } else {
        for (let i = 1; i < texts.length; i++) {
            if (textToReturn.length < 10) {
                textToReturn += handleTitleLength(texts[i], flatWords, splittingChar);
            } else {
                break;
            }
        }
    }

    return removeSpecialCharacterAtTheEnd(textToReturn);
}

export function getQuestionTitle(
    questionTitle: string,
    option: "meta" | "html" = "html"
) {
    let text = questionTitle || "";

    if (option === "meta") {
        text = replaceCodesByEmptyString(text);
    } else {
        text = mapCodesToHTMLTags(text);
    }

    let segments = getLatexSegments(text) ?? [];
    const splittingChar = option !== "meta" ? "<br>" : "\n";

    segments = segments.map((segment) => {
        if (segment.type === "text") {
            let data = removeImage(segment.data);
            data = toTitleCase(data.trim());
            if (option !== "meta") {
                data = data.replace(/(?:<Br>|<br>|\n)/g, " <br>")?.trim();
            } else {
                data = data.replace(/(?:<Br>|<br>|\n)/g, " \n")?.trim();
            }
            return {
                ...segment,
                data,
            };
        } else {
            return segment;
        }
    });

    const fullText = segments.map((el) => el.data).join(" ");
    const flatWords = fullText.split(" ");
    const lines = removeImage(fullText).split(splittingChar);

    let titleIndex = 0;
    while (isNullOrWhitespace(lines[titleIndex])) {
        titleIndex++;
        if (titleIndex >= lines.length) {
            return "";
        }
    }

    // Text is combination of text and latex
    if (segments.length > 1 || segments[0].type === "math") {
        return segments.reduce((acc, curr) => {
            if (acc.split(" ").length > 10 || acc.endsWith(".")) {
                return acc;
            }
            if (curr.type === "text") {
                return (
                    acc +
                    splitTextLongerThanTenWorldOrBreakLine(
                        curr.data,
                        flatWords,
                        splittingChar
                    )
                );
            } else if (curr.type === "math" && curr.data.length < 200) {
                return acc + curr.rawData + " ";
            } else {
                return acc;
            }
        }, "");
    }

    if (lines[titleIndex].split(" ").length >= 10) {
        return splitTextLongerThanTenWorldOrBreakLine(
            lines[titleIndex],
            flatWords,
            splittingChar
        );
    } else {
        let textToReturn = lines[titleIndex];
        if (lines[titleIndex].split(" ").length < 5) {
            if (lines[titleIndex + 1] && !lines[titleIndex + 1].includes("A)")) {
                for (let i = titleIndex + 1; i < lines.length; i++) {
                    if (isNullOrWhitespace(lines[i])) {
                        continue;
                    }
                    textToReturn += handleTitleLength(lines[i], flatWords, splittingChar);
                    if (textToReturn.length > 10) {
                        break;
                    }
                }
            }
        }

        return removeSpecialCharacterAtTheEnd(textToReturn);
    }
}

enum QUESTION_MULTIPLE_CHOICE {
    label = "Multiple Choice",
    value = "MULTIPLE_CHOICE",
}

enum QUESTION_TRUE_FALSE {
    label = "True False",
    value = "TRUE_FALSE",
}

enum QUESTION_ESSAY {
    label = "Essay",
    value = "ESSAY",
}

enum QUESTION_SHORT_ANSWER {
    label = "Short Answer",
    value = "SHORT_ANSWER",
}

enum QUESTION_NOT_ANSWERED {
    label = "Not Answered",
    value = "NOT_ANSWERED",
}

enum QUESTION_MATCHING {
    label = "Matching",
    value = "MATCHING",
}

export const AnswerBankQuestionTypesLabelMap: { [key: string]: string } = {
    [QUESTION_NOT_ANSWERED.value]: QUESTION_NOT_ANSWERED.label,
    [QUESTION_SHORT_ANSWER.value]: QUESTION_SHORT_ANSWER.label,
    [QUESTION_ESSAY.value]: QUESTION_ESSAY.label,
    [QUESTION_TRUE_FALSE.value]: QUESTION_TRUE_FALSE.label,
    [QUESTION_MULTIPLE_CHOICE.value]: QUESTION_MULTIPLE_CHOICE.label,
    [QUESTION_MATCHING.value]: QUESTION_MATCHING.label,
};

const CodesTeaserToBlurImage = [
    "@#IMG-DLM&",
    "@#LAT-DLM&",
    "@#SUB-DLM&",
    "@#SUP-DLM&"
];

export function replaceCodesByUUIDBlurImage(text: string, fromPage = "TEXT_BOOK") {
    let image = fromPage === "TEXT_BOOK" ?
        "<img  loading=\"lazy\" src=\"/assets/images/blured-text-book.svg\" class=\"d-inline m-1\" alt=\"blured image\" width=\"139\" height=\"30\">" :
        "<img  loading=\"lazy\" src=\"/assets/images/short-blured-teaser-answer.svg\" class=\"d-inline\" alt=\"blured image\" width=\"195\" height=\"39\">";

    let regex;
    CodesTeaserToBlurImage.forEach((key, index) => {
        regex = new RegExp(`${key}`, "g");
        text = text.replace(regex, image);
    });
    if (text && text[text?.length - 1] !== ">" && fromPage === "homework_help") {
        text = text + "...";
    }
    return text;
}

export function getAnswersBankTextAsHtml(
    text: string,
    hideImage: boolean,
    questionType: string,
    isPreview: boolean
) {
    text = mapCodesToHTMLTags(text);
    text = replaceCodesByUUIDBlurImage(text)
    const matches = replaceImagesWithHTML(text);
    text = getHTMLOfImage(text, hideImage, matches, isPreview);
    if (!isPreview) {
        text = text.replace(/\n/gi, "<br>");
    }
    return text;
}

export function replaceImagesWithHTML(text: string) {
    const regex = new RegExp(
        `${getRegexImageUUID()}+_[00|11][^\\.png|\\.webp|\\.jpg]`,
        "gm"
    );
    const matches = (text.match(regex) ?? []).map((match) =>
        match.replace(/\n/gi, "")
    );
    return matches;
}

function getHTMLOfImage(
    text: string,
    hideImage: boolean,
    matches: string[],
    isPreview: boolean
) {
    let textWithoutImages = replaceHTMLCodesByEmptyString(text).replace(/"/g, ' ');
    matches.forEach((el)=>{
        textWithoutImages = textWithoutImages.replace(el, ' ')
    })
    if (matches && matches.length) {
        for (let match of matches) {
            match = match.trim();
            const matchIndex = text.indexOf(match);
            if (matchIndex > -1) {
                const substring = text.substring(
                    matchIndex,
                    matchIndex + match.length + 4
                );
                if (substring.endsWith(".jpg")) {
                    break;
                }
            }
            const file = getFileObjectMyName(match);
            let imgElement = "";
            if (isPreview) {
                imgElement +=
                    '<img src="' +
                    file.path +
                    '" height="30" alt="'+ textWithoutImages + '" class="answers-bank-image ' +
                    "d-inline" +
                    '" rel="preload" >';
            } else {
                imgElement = "";
                if (hideImage) {
                    imgElement +=
                        '<img src="' +
                        file.path +
                        '" height="30" alt="'+ textWithoutImages + '" class="answers-bank-image ' +
                        "d-inline" +
                        '" rel="preload" >';
                } else {
                    let imgClasses;
                    if (file.is_inline) {
                        imgClasses = "d-inline";
                    } else {
                        imgClasses = "d-block";
                    }
                    imgElement +=
                        '<img src="' +
                        file.path +
                        '" alt="'+ textWithoutImages + '" class="answers-bank-image ' +
                        imgClasses +
                        '" rel="preload" >';
                }
            }
            text = text.replace(match, imgElement);
        }
    }

    return text;
}

export const isLatexTable = (text: string) => {
    try {
        const tree = (katex as any).__parse(text.replace(/(\$|\u20AC)/g, ""), {
            throwOnError: false,
            displayMode: true,
            strict: false,
        });

        if (tree instanceof Array) {
            for (const item of tree) {
                if (item.type === "array") {
                    return true;
                }
            }
        }
        return tree.type === "array";
    } catch (e) {
        return false;
    }
};

export function isTextIncludingLatex (text?: string) {
    if (!text) return false;
    const segments = getLatexSegments(text);
    return !(segments?.length === 1 && segments[0].type === "text");
}

export function getKatexHTML(text: string, isPreview: boolean): string {
    if (!text) {
        return "";
    }
    const segments = getLatexSegments(text);
    if (segments.length === 1 && segments[0].type === "text") {
        return text;
    }
    return segments
        .map((seg) => {
            if (seg.type === "math") {
                if (isPreview) {
                    latexDelimitersList.forEach((delimiter) => {
                        seg.data = seg.data.replace(delimiter.right, "");
                        seg.data = seg.data.replace(delimiter.left, "");
                    });
                    // if (isPreview && isLatexTable(seg.data)) {
                    //   return renderA11yString(seg.data.toString());
                    // }
                }
                seg.data = seg.data.replace(/(?:<Br>|<br>|\n)/g, "");
                try {
                    return `<span class="ql-formula" data-value="${
                        seg.data
                    }">${katex.renderToString(seg.data, {
                        displayMode: seg.display && !isPreview,
                        strict: false,
                        throwOnError: false,
                    })}</span>`;
                } catch (e) {
                    return " " + seg.data + " ";
                }
            } else {
                return " " + seg.data + " ";
            }
        })
        .reduce((total, current) => {
            return total + current;
        });
}

export function getImagesPath(text: string) {
    const matches = replaceImagesWithHTML(text);
    let images = [];
    if (matches?.length) {
        for (let match of matches) {
            match = match.trim();
            const matchIndex = text.indexOf(match);
            if (matchIndex > -1) {
                const substring = text.substring(
                    matchIndex,
                    matchIndex + match.length + 4
                );
                if (substring.endsWith(".jpg")) {
                    break;
                }
            }

            const file = getFileObjectMyName(match);
            if (file?.path) {
                images.push(file.path);
            }
        }
    }

    return images;
}

export function getFullTextFormatted(
    text: string,
    hideImage: boolean,
    questionType: string,
    isPreview: boolean
): { text: string; answer: string } {
    try {
        let newText = getKatexHTML(
            getAnswersBankTextAsHtml(text, hideImage, questionType, isPreview),
            isPreview
        );
        if (questionType === "MULTIPLE_CHOICE") {
            newText = newText.replace(/\)/g, ') ');
            const index = newText.lastIndexOf("<br>A)");
            return {
                text: newText.substring(0, index),
                answer: newText.substring(index),
            };
        }
        return {
            text: newText,
            answer: "",
        };
    } catch (error) {
        return {
            text: text,
            answer: "",
        };
    }
}

export function isNumber(value: string): boolean {
    return !isNaN(Number(value));
}

export function title(text?: string) {
    text = text || '';

    text = mapCodesToHTMLTags(text);
    let segments = getLatexSegments(text) ?? [];
    const splittingChar = '<br>';

    segments = segments.map((segment) => {
        if (segment.type === 'text') {
            let data = removeImage(segment.data);
            data = toTitleCase(data.trim());
            data = data.replace(/(?:<Br>|<br>|\n)/g, ' <br>')?.trim();
            return {
                ...segment,
                data
            };

        } else {
            return segment;
        }
    });


    const fullText = segments.map(el => el.data).join(' ');
    const flatWords = fullText.split(' ');
    const lines = removeImage(fullText).split(splittingChar);

    let titleIndex = 0;
    while (isNullOrWhitespace(lines[titleIndex])) {
        titleIndex++;
        if (titleIndex >= lines.length) {
            return '';
        }
    }

    // Text is combination of text and latex
    if (segments.length > 1 || segments[0].type === 'math') {
        return segments.reduce((acc, curr) => {
            if (acc.split(' ').length > 10 || acc.endsWith('.')) {
                return acc;
            }
            if (curr.type === 'text') {
                return acc + splitTextLongerThanTenWorldOrBreakLine(curr.data, flatWords, splittingChar);
            } else if (curr.type === 'math') {
                if(curr.data.length < 150){
                    return acc + curr.rawData + ' ';
                }
                return acc + ' ';
            } else {
                return acc + ' ';
            }
        }, '');
    }


    if (lines[titleIndex].split(' ').length >= 10) {
        return splitTextLongerThanTenWorldOrBreakLine(lines[titleIndex], flatWords, splittingChar);
    } else {
        let textToReturn = lines[titleIndex];
        if (lines[titleIndex].split(' ').length < 5) {
            if (lines[titleIndex + 1] && !lines[titleIndex + 1].includes('A)')) {
                for (let i = titleIndex + 1; i < lines.length; i++) {
                    if (isNullOrWhitespace(lines[i])) {
                        continue;
                    }
                    textToReturn += handleTitleLength(lines[i], flatWords, splittingChar);
                    if (textToReturn.length > 10) {
                        break;
                    }
                }
            }
        }

        return removeSpecialCharacterAtTheEnd(textToReturn);
    }
}

export function getRequestCookie(key: string, request: Request) {
    const cookies = Object.fromEntries(
        request.headers
            .get("Cookie")
            ?.split(";")
            .map((cookie) => cookie.trim().split("=")) ?? []
    );

    return cookies[key];
}

export const getTextFormatted = (text?: string, type?: string) => {
    let newText = text ? getKatexHTML(
        getAnswersBankTextAsHtml(text, false, type ?? '', false),
        false,
    ) : text;

    if (newText && type === "MULTIPLE_CHOICE") {
        newText = newText.replace(/\)/g, ') ');
        newText = newText.replace("<br>A)", "<br><br>A)");
    }

    return newText ?? '';
}

export function removeKatexFromString(text: string): string {
    if (!text) {
        return '';
    }
    const segments = getLatexSegments(text);
    if (segments.length === 1 && segments[0].type === 'text') {
        return text;
    }
    return segments
      .map((seg) => {
          if (seg.type === 'math') {
              latexDelimitersList.forEach((delimiter) => {
                  seg.data = seg.data.replace(delimiter.right, '');
                  seg.data = seg.data.replace(delimiter.left, '');
              });
              seg.data = seg.data.replace(/(?:<Br>|<br>|\n)/g, '');
              return seg.data;
          } else {
              return ' ' + seg.data + ' ';
          }
      })
      .reduce((total, current) => {
          return total + current;
      });
}

export function getCleanText(text?: string): string {
    if (!text) return '';
    return removeImage(text);
}