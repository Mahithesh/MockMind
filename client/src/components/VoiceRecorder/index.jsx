import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { BsMicFill, BsFillStopCircleFill, BsArrowRepeat, BsCheckCircleFill } from 'react-icons/bs';
import './index.css';

const MAX_RECORD_TIME = 300; // 5 minutes in seconds

export default function VoiceRecorder({ onRecordingComplete, disabled }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  useEffect(() => {
    let timerId = null;

    if (isRecording) {
      timerId = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev + 1 >= MAX_RECORD_TIME) {
            stopRecording();
            toast.success('Maximum recording time reached (5 minutes).');
            return MAX_RECORD_TIME;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [isRecording]);

  useEffect(() => {
    return () => {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        if (mediaRecorder.stream) {
          mediaRecorder.stream.getTracks().forEach((track) => track.stop());
        }
      }
      if (audioPreviewUrl) {
        URL.revokeObjectURL(audioPreviewUrl);
      }
    };
  }, [mediaRecorder, audioPreviewUrl]);

  const startRecording = async () => {
    try {
      if (audioPreviewUrl) {
        URL.revokeObjectURL(audioPreviewUrl);
      }
      setRecordedBlob(null);
      setAudioPreviewUrl(null);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const options = { mimeType: 'audio/webm;codecs=opus' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'audio/webm';
      }

      const recorder = new MediaRecorder(stream, options);
      const chunks = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        setRecordedBlob(audioBlob);

        const previewUrl = URL.createObjectURL(audioBlob);
        setAudioPreviewUrl(previewUrl);

        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);
    } catch (error) {
      console.error('Microphone access error:', error.message);
      toast.error(
        'Could not access microphone. Please allow microphone permissions.'
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    setIsRecording(false);
  };

  const handleSubmit = () => {
    if (recordedBlob) {
      onRecordingComplete(recordedBlob);
      setRecordedBlob(null);
      if (audioPreviewUrl) {
        URL.revokeObjectURL(audioPreviewUrl);
        setAudioPreviewUrl(null);
      }
      setRecordingTime(0);
    }
  };

  const handleReRecord = () => {
    if (audioPreviewUrl) {
      URL.revokeObjectURL(audioPreviewUrl);
    }
    setRecordedBlob(null);
    setAudioPreviewUrl(null);
    setRecordingTime(0);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="voice-recorder">
      {!isRecording && !audioPreviewUrl && (
        <button
          className={`vr-record-btn ${disabled ? 'vr-record-btn-disabled' : ''}`}
          onClick={startRecording}
          disabled={disabled}
        >
          <BsMicFill className="vr-btn-icon" /> Start Recording
        </button>
      )}

      {isRecording && (
        <div className="vr-recording-area">
          <div className="vr-recording-status">
            <span className="vr-record-dot">●</span>
            <span className="vr-status-text">Recording...</span>
            <span className="vr-timer">{formatTime(recordingTime)}</span>
          </div>
          <button className="vr-stop-btn" onClick={stopRecording}>
            <BsFillStopCircleFill className="vr-btn-icon" /> Stop Recording
          </button>
        </div>
      )}

      {audioPreviewUrl && !isRecording && (
        <div className="vr-preview">
          <p className="vr-preview-label">Review your answer before submitting</p>
          <audio className="vr-audio-player" src={audioPreviewUrl} controls />
          <p className="vr-preview-duration">Duration: {formatTime(recordingTime)}</p>
          <div className="vr-preview-actions">
            <button
              className={`vr-rerecord-btn ${disabled ? 'vr-rerecord-btn-disabled' : ''}`}
              onClick={handleReRecord}
              disabled={disabled}
            >
              <BsArrowRepeat className="vr-btn-icon" /> Re-record
            </button>
            <button
              className={`vr-submit-btn ${disabled ? 'vr-submit-btn-disabled' : ''}`}
              onClick={handleSubmit}
              disabled={disabled}
            >
              <BsCheckCircleFill className="vr-btn-icon" /> Submit Answer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}