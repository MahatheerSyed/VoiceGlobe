from gtts import gTTS
from io import BytesIO
import pygame

# Initialize Pygame mixer
pygame.mixer.init()

def text_to_speech(text, language='en'):
    try:
        # Create a gTTS object and convert the text
        tts = gTTS(text=text, lang=language, slow=False)

        # Store the audio in a BytesIO object (in-memory buffer)
        mp3_fp = BytesIO()
        tts.write_to_fp(mp3_fp)

        # Move the pointer to the beginning of the BytesIO object
        mp3_fp.seek(0)

        # Load the audio from the BytesIO object using pygame
        pygame.mixer.music.load(mp3_fp, "mp3")
        pygame.mixer.music.play()

        # Keep the program running until the audio finishes playing
        while pygame.mixer.music.get_busy():
            pygame.time.Clock().tick(10)

    except Exception as e:
        print(f"Error: {e}")

# Example usage:

