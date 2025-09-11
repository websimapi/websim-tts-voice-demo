document.addEventListener('DOMContentLoaded', () => {
    const recordBtn = document.getElementById('record-btn');
    const statusDiv = document.getElementById('status');
    const synthesizeBtn = document.getElementById('synthesize-btn');
    const textInput = document.getElementById('text-input');
    const audioOutput = document.getElementById('audio-output');
    const audioPlayer = document.getElementById('audio-player');
    const loadingDiv = document.getElementById('loading');
    const errorMessageDiv = document.getElementById('error-message');

    let isRecording = false;
    let mediaRecorder;
    let audioChunks = [];

    const ADAM_VOICE_ID = "pNInz6obpgDQGcFmaJgB"; // A pleasant, standard voice from ElevenLabs for demonstration

    async function toggleRecording() {
        if (!isRecording) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.ondataavailable = event => {
                    audioChunks.push(event.data);
                };
                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    // In a real app, you would upload this blob for cloning.
                    // Here we just acknowledge the recording is done.
                    audioChunks = [];
                    stream.getTracks().forEach(track => track.stop());
                };
                mediaRecorder.start();
                startRecordingState();
            } catch (err) {
                console.error("Error accessing microphone:", err);
                statusDiv.textContent = 'Error: Could not access microphone.';
            }
        } else {
            mediaRecorder.stop();
            stopRecordingState();
        }
    }
    
    function startRecordingState() {
        isRecording = true;
        recordBtn.classList.add('recording');
        recordBtn.querySelector('span').textContent = 'Stop Recording';
        statusDiv.textContent = 'Recording... Press again to stop.';
        audioOutput.classList.add('hidden');
        synthesizeBtn.disabled = true;
    }
    
    function stopRecordingState() {
        isRecording = false;
        recordBtn.classList.remove('recording');
        recordBtn.querySelector('span').textContent = 'Start Recording';
        statusDiv.textContent = 'Recording finished! You can now synthesize speech.';
        synthesizeBtn.disabled = false;
    }

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
            showError("Sorry, there was an error generating the audio. Please try again.");
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

    recordBtn.addEventListener('click', toggleRecording);
    synthesizeBtn.addEventListener('click', handleSynthesize);
});

