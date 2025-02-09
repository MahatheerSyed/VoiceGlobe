from flask import Flask, render_template, request, jsonify, url_for
from translation import perform_translation
from googletrans import Translator
from gtts import gTTS
from io import BytesIO
import os
import uuid  # To generate unique file names

app = Flask(__name__)

# Route to serve the HTML page
@app.route('/')
def index():
    return render_template('index.html')

# Function to convert text to speech and save it with a unique file name
def text_to_speech(text, language='en', file_path=None):
    try:
        # Create a gTTS object and convert the text to speech
        tts = gTTS(text=text, lang=language, slow=False)

        # If a file path is provided, save the audio to the file
        if file_path:
            mp3_fp = BytesIO()
            tts.write_to_fp(mp3_fp)
            mp3_fp.seek(0)  # Reset the buffer pointer

            # Create directory if it doesn't exist
            os.makedirs(os.path.dirname(file_path), exist_ok=True)

            # Save the new audio file
            with open(file_path, 'wb') as f:
                f.write(mp3_fp.read())

    except Exception as e:
        print(f"Error in text-to-speech: {e}")

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
        # Detect the language of the text to be translated
        detected = translator.detect(transcribed_texts[2])
        target_lang = detected.lang

        # Translate the text
        translation_new = translator.translate(transcribed_texts[2], src='en', dest=target_lang)
        transcribed_texts[2] = translation_new.text

        # Perform further translation processing if needed
        translation_out = perform_translation(transcribed_texts)

        if translation_out:
            # Generate a unique file name using UUID
            unique_filename = f"output_{uuid.uuid4().hex}.mp3"
            
            # Define the path to save the audio file
            audio_path = os.path.join(app.static_folder, 'audio', unique_filename)

            # Save the audio file
            text_to_speech(translation_out, target_lang, audio_path)

            # Respond with the translation and unique audio URL
            return jsonify({
                "translation": translation_out,
                "audio_url": url_for('static', filename=f'audio/{unique_filename}')
            })
        else:
            return jsonify({"error": "Translation failed or input was invalid."})
    
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": f"Translation failed: {e}"})

if __name__ == "__main__":
    # Ensure the audio directory exists
    audio_dir = os.path.join(app.static_folder, 'audio')
    if not os.path.exists(audio_dir):
        os.makedirs(audio_dir)
    
    app.run(debug=True)
