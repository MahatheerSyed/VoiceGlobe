from flask import Flask, render_template, request, jsonify, url_for
from translation import perform_translation
from googletrans import Translator
from gtts import gTTS
from io import BytesIO
import os
import pygame

app = Flask(__name__)

# Initialize Pygame mixer


os.environ["SDL_AUDIODRIVER"] = "dummy"
import pygame
pygame.init()
# Route to serve the HTML page
@app.route('/')
def index():
    return render_template('index.html')

# Function to play text-to-speech audio and save it
# Function to convert text to speech and save it without playing audio
def text_to_speech(text, language='en', file_path=None):
    try:
        # Create a gTTS object and convert the text
        tts = gTTS(text=text, lang=language, slow=False)

        # Store the audio in a BytesIO object (in-memory buffer)
        mp3_fp = BytesIO()
        tts.write_to_fp(mp3_fp)

        # Save the audio to a file if a file path is provided
        if file_path:
            # Delete the previous audio file if it exists
            if os.path.exists(file_path):
                os.remove(file_path)

            mp3_fp.seek(0)  # Reset the buffer pointer
            with open(file_path, 'wb') as f:
                f.write(mp3_fp.read())

        # No need to load and play the audio file with pygame
    except Exception as e:
        print(f"Error: {e}")


# API endpoint to handle translation requests
@app.route('/translate', methods=['POST'])
def translate():
    translator = Translator()
    data = request.json
    transcribed_texts = data.get('texts', [])

    # Check if transcribed_texts has enough elements
    if len(transcribed_texts) < 3:
        return jsonify({"error": "Input text is missing."})

    try:
        # Log the input text
        print(f"Input text for translation: {transcribed_texts[2]}")

        detected = translator.detect(transcribed_texts[2])
        target_lang = detected.lang
        
        # Log the detected language
        print(f"Detected language: {target_lang}")

        # Translate the text
        translation_new = translator.translate(transcribed_texts[2], src='en', dest=target_lang)
        transcribed_texts[2] = translation_new.text

        # Log the translated text
        print(f"Translated text: {transcribed_texts[2]}")

        translation_out = perform_translation(transcribed_texts)

        if translation_out:
            # Define the path to save the audio file
            audio_path = os.path.join(app.static_folder, 'audio', 'output.mp3')

            # Stop and unload the mixer to ensure the file is released
            if pygame.mixer.music.get_busy():
                pygame.mixer.music.stop()
            pygame.mixer.music.unload()

            # Always delete the previous audio file before saving a new one
            if os.path.exists(audio_path):
                os.remove(audio_path)

            # Save the audio file and play it
            text_to_speech(translation_out, target_lang, audio_path)

            return jsonify({
                "translation": translation_out,
                "audio_url": url_for('static', filename='audio/output.mp3')
            })
        else:
            return jsonify({"error": "Translation failed or input was invalid."})
    
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": f"Translation failed: {e}"})

if __name__ == "__main__":
    app.run(debug=True)
