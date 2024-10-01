import time
from deep_translator import GoogleTranslator
from langdetect import detect, LangDetectException
import re


def translate_text(text, src_lang, dest_lang, retries=3, delay=5):
    translator = GoogleTranslator(source=src_lang, target=dest_lang)
    
    for attempt in range(retries):
        try:
            translated = translator.translate(text)
            return translated
        except Exception as e:
            print(f"Attempt {attempt + 1} failed: {e}")
            if attempt < retries - 1:
                time.sleep(delay)
            else:
                raise

def perform_translation(transcribed_texts):
    if len(transcribed_texts) != 3:
        print("Invalid number of items in the translation list.")
        return None

    source_language = transcribed_texts[0].lower()
    target_language = transcribed_texts[1].lower()
    text_to_translate = transcribed_texts[2]

    language_codes = {
    "afrikaans": "af",
    "albanian": "sq",
    "amharic": "am",
    "arabic": "ar",
    "armenian": "hy",
    "azerbaijani": "az",
    "basque": "eu",
    "belarusian": "be",
    "bengali": "bn",
    "bosnian": "bs",
    "bulgarian": "bg",
    "catalan": "ca",
    "cebuano": "ceb",
    "chichewa": "ny",
    "chinese (simplified)": "zh-cn",
    "chinese (traditional)": "zh-tw",
    "corsican": "co",
    "croatian": "hr",
    "czech": "cs",
    "danish": "da",
    "dutch": "nl",
    "english": "en",
    "esperanto": "eo",
    "estonian": "et",
    "filipino": "tl",
    "finnish": "fi",
    "french": "fr",
    "frisian": "fy",
    "galician": "gl",
    "georgian": "ka",
    "german": "de",
    "greek": "el",
    "gujarati": "gu",
    "haitian creole": "ht",
    "hausa": "ha",
    "hawaiian": "haw",
    "hebrew": "he",
    "hindi": "hi",
    "hmong": "hmn",
    "hungarian": "hu",
    "icelandic": "is",
    "igorot": "io",
    "indonesian": "id",
    "irish": "ga",
    "italian": "it",
    "japanese": "ja",
    "javanese": "jv",
    "kannada": "kn",
    "kazakh": "kk",
    "khmer": "km",
    "korean": "ko",
    "kurdish (kurmanji)": "ku",
    "kyrgyz": "ky",
    "lao": "lo",
    "latin": "la",
    "latvian": "lv",
    "lithuanian": "lt",
    "luxembourgish": "lb",
    "macedonian": "mk",
    "malagasy": "mg",
    "malay": "ms",
    "malayalam": "ml",
    "maltese": "mt",
    "maori": "mi",
    "marathi": "mr",
    "mongolian": "mn",
    "myanmar (burmese)": "my",
    "nepali": "ne",
    "norwegian": "no",
    "nyanja": "ny",
    "pashto": "ps",
    "persian": "fa",
    "polish": "pl",
    "portuguese": "pt",
    "punjabi": "pa",
    "romanian": "ro",
    "russian": "ru",
    "samoan": "sm",
    "sanskrit": "sa",
    "serbian": "sr",
    "sesotho": "st",
    "shona": "sn",
    "sindhi": "sd",
    "sinhala": "si",
    "slovak": "sk",
    "slovenian": "sl",
    "somali": "so",
    "spanish": "es",
    "sundanese": "su",
    "swahili": "sw",
    "swedish": "sv",
    "tajik": "tg",
    "tamil": "ta",
    "telugu": "te",
    "thai": "th",
    "turkish": "tr",
    "ukrainian": "uk",
    "urdu": "ur",
    "uzbek": "uz",
    "vietnamese": "vi",
    "welsh": "cy",
    "xhosa": "xh",
    "yiddish": "yi",
    "yoruba": "yo",
    "zulu": "zu"
}


    if source_language not in language_codes:
        print("Invalid source language. Please input a valid language.")
        return None
    
    if target_language not in language_codes:
        print("Invalid target language. Please input a valid language.")
        return None

    src_lang_code = language_codes[source_language]
    dest_lang_code = language_codes[target_language]

    # Detect language if source language is not English
    if src_lang_code != "en":
        try:
            text_to_translate = translate_text(text_to_translate, "en", src_lang_code)
        except Exception as e:
            print(f"Failed to translate to source language: {e}")
            return None

    # Validate if the transcribed text is a proper sentence
    # if not is_proper_sentence(text_to_translate):
    #     print("Invalid sentence. Please input a proper sentence.")
    #     return None

    # Translate to target language
    try:
        translation_out = translate_text(text_to_translate, src_lang_code, dest_lang_code)
        return translation_out
    except Exception as e:
        print(f"Translation failed: {e}")
        return None


