document.addEventListener('DOMContentLoaded', () => {
    const synthesizeBtn = document.getElementById('synthesize-btn');
    const textInput = document.getElementById('text-input');
    const audioOutput = document.getElementById('audio-output');
    const audioPlayer = document.getElementById('audio-player');
    const loadingDiv = document.getElementById('loading');
    const errorMessageDiv = document.getElementById('error-message');

    const ADAM_VOICE_ID = "pNInz6obpgDQGcFmaJgB"; // A pleasant, standard voice from ElevenLabs for demonstration

    async function handleSynthesize() {
        const text = textInput.value.trim();
        if (!text) {
            showError("Please enter some text to synthesize.");
            return;
        }

        loadingDiv.classList.remove('hidden');
        audioOutput.classList.add('hidden');
        synthesizeBtn.disabled = true;
        hideError();

        try {
            const result = await websim.textToSpeech({
                text: text,
                voice: ADAM_VOICE_ID,
            });

            audioPlayer.src = result.url;
            audioOutput.classList.remove('hidden');
            audioPlayer.play();

        } catch (error) {
            console.error('Error synthesizing speech:', error);
            showError("Sorry, there was an an error generating the audio. Please try again.");
        } finally {
            loadingDiv.classList.add('hidden');
            synthesizeBtn.disabled = false;
        }
    }
    
    function showError(message) {
        errorMessageDiv.textContent = message;
        errorMessageDiv.classList.remove('hidden');
    }

    function hideError() {
        errorMessageDiv.classList.add('hidden');
    }

    synthesizeBtn.addEventListener('click', handleSynthesize);
});

