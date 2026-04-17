import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  uploadResume,
  getResume,
  startInterview,
} from '../../services/interviewService.js';
import INTERVIEW_ROLES from '../../constants/roles.js';
import DIFFICULTY_LEVELS from '../../constants/difficulty.js';
import {
  BsDisplay,
  BsServer,
  BsLightningFill,
  BsGraphUp,
  BsCloudFill,
  BsStarFill,
  BsStar,
  BsFileEarmarkArrowUp,
  BsCheckCircleFill,
} from 'react-icons/bs';
import { FaPython, FaReact, FaJava } from 'react-icons/fa';
import toast from 'react-hot-toast';
import './index.css';

const ROLE_ICONS = {
  'frontend-developer': BsDisplay,
  'backend-developer': BsServer,
  'full-stack-developer': BsLightningFill,
  'data-analyst': BsGraphUp,
  'devops-engineer': BsCloudFill,
  'python-developer': FaPython,
  'react-developer': FaReact,
  'java-developer': FaJava,
};

const DEVICE_INTERVIEW_LIMIT_KEY = 'deviceInterviewAttempts';
const DEVICE_INTERVIEW_LIMIT = 2;

const getDeviceInterviewAttempts = () => {
  const stored = window.localStorage.getItem(DEVICE_INTERVIEW_LIMIT_KEY);
  return stored ? Number(stored) : 0;
};

const incrementDeviceInterviewAttempts = () => {
  const current = getDeviceInterviewAttempts();
  window.localStorage.setItem(DEVICE_INTERVIEW_LIMIT_KEY, String(current + 1));
};

const DIFFICULTY_ICONS = {
  easy: (
    <span className="setup-difficulty-stars">
      <BsStarFill className="setup-star-filled" />
      <BsStar className="setup-star-empty" />
      <BsStar className="setup-star-empty" />
    </span>
  ),
  medium: (
    <span className="setup-difficulty-stars">
      <BsStarFill className="setup-star-filled" />
      <BsStarFill className="setup-star-filled" />
      <BsStar className="setup-star-empty" />
    </span>
  ),
  hard: (
    <span className="setup-difficulty-stars">
      <BsStarFill className="setup-star-filled" />
      <BsStarFill className="setup-star-filled" />
      <BsStarFill className="setup-star-filled" />
    </span>
  ),
};

function InterviewSetupPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [resumeText, setResumeText] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [deviceAttempts, setDeviceAttempts] = useState(getDeviceInterviewAttempts());

  useEffect(() => {
    const loadResume = async () => {
      try {
        const data = await getResume();
        if (data) {
          setResumeText(data.text);
          setResumeFileName(data.fileName);
        }
      } catch (error) {
        // No resume found - that's okay
      }
    };

    loadResume();
  }, []);

  useEffect(() => {
    setDeviceAttempts(getDeviceInterviewAttempts());
  }, []);
const handleResumeUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (file.type !== 'application/pdf') {
    toast.error('Please upload a PDF file.');
    return;
  }

  setUploadingResume(true);

  try {
    const data = await uploadResume(file);
    setResumeText(data.text);
    setResumeFileName(data.fileName);
    toast.success('Resume uploaded successfully!');
  } catch (error) {
    const message =
      error.response?.data?.message || 'Failed to upload resume';
    toast.error(message);
  } finally {
    setUploadingResume(false);
  }
};

const handleStartInterview = async () => {
  if (!selectedRole) {
    toast.error('Please select a role.');
    return;
  }
  if (!resumeText) {
    toast.error('Please upload your resume.');
    return;
  }

  setLoading(true);

  try {
    if (deviceAttempts >= DEVICE_INTERVIEW_LIMIT) {
      toast.error(
        'This device has already used both interview attempts. Please try again from a different device.'
      );
      return;
    }

    const difficultyConfig = DIFFICULTY_LEVELS.find(
      (d) => d.id === selectedDifficulty
    );
    const totalQuestions = difficultyConfig ? difficultyConfig.questions : 5;
    const data = await startInterview(
      selectedRole,
      resumeText,
      totalQuestions
    );
    incrementDeviceInterviewAttempts();
    setDeviceAttempts((prev) => prev + 1);
    toast.success('Interview started!');
    navigate(`/interview/${data.interviewId}`, {
      state: { audio: data.audio },
    });
  } catch (error) {
    const message =
      error.response?.data?.message || 'Failed to start interview';
    toast.error(message);
  } finally {
    setLoading(false);
  }
};

const handleNext = () => {
  if (step === 1 && !selectedRole) {
    toast.error('Please select a role.');
    return;
  }
  setStep((prev) => Math.min(prev + 1, 3));
};

const handleBack = () => {
  setStep((prev) => Math.max(prev - 1, 1));
};

  if (loading) {
    return (
      <div className="setup-page">
        <div className="setup-preparing">
          <div className="spinner-border setup-preparing-spinner" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h2 className="setup-preparing-heading">
            Preparing Your Interview...
          </h2>
          <p className="setup-preparing-text">
            AI is analyzing your resume and generating personalized questions for
            the <strong>{selectedRole}</strong> role.
          </p>
          <div className="setup-preparing-steps">
            <div className="setup-prep-step">
              <BsCheckCircleFill className="setup-prep-step-icon-active" />
              <span className="setup-prep-step-text">Analyzing resume</span>
            </div>
            <div className="setup-prep-step">
              <BsCheckCircleFill className="setup-prep-step-icon-active" />
              <span className="setup-prep-step-text">
                Generating questions
              </span>
            </div>
            <div className="setup-prep-step">
              <BsCheckCircleFill className="setup-prep-step-icon-pending" />
              <span className="setup-prep-step-text">
                Setting up voice interviewer
              </span>
            </div>
          </div>
          <p className="setup-preparing-hint">
            This may take 10-15 seconds...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="setup-page">
      <div className="setup-container">
        <div className="setup-step-indicator">
          <span
            className={`setup-step-badge ${step >= 1 ? 'setup-step-active' : ''}`}
          >
            1. Role
          </span>
          <span
            className={`setup-step-badge ${step >= 2 ? 'setup-step-active' : ''}`}
          >
            2. Difficulty
          </span>
          <span
            className={`setup-step-badge ${step >= 3 ? 'setup-step-active' : ''}`}
          >
            3. Resume
          </span>
        </div>

        {step === 1 && (
          <div className="setup-section">
            <h2 className="setup-section-heading">Select Interview Role</h2>
            <div className="setup-roles-grid">
              {INTERVIEW_ROLES.map((role) => {
                const RoleIcon = ROLE_ICONS[role.id];
                return (
                  <button
                    key={role.id}
                    className={`setup-role-card ${selectedRole === role.title ? 'setup-role-selected' : ''}`}
                    onClick={() => setSelectedRole(role.title)}
                  >
                    {RoleIcon && <RoleIcon className="setup-role-icon" />}
                    <h3 className="setup-role-title">{role.title}</h3>
                    <p className="setup-role-desc">{role.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="setup-section">
            <h2 className="setup-section-heading">Choose Difficulty</h2>
            <div className="setup-difficulty-row">
              {DIFFICULTY_LEVELS.map((level) => (
                <button
                  key={level.id}
                  className={`setup-difficulty-card ${selectedDifficulty === level.id ? 'setup-difficulty-selected' : ''}`}
                  onClick={() => setSelectedDifficulty(level.id)}
                >
                  {DIFFICULTY_ICONS[level.id]}
                  <h3 className="setup-difficulty-label">{level.label}</h3>
                  <p className="setup-difficulty-desc">{level.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="setup-section">
            <h2 className="setup-section-heading">Upload Your Resume</h2>
            <div className="setup-resume-area">
              {resumeText ? (
                <div className="setup-resume-uploaded">
                  <div className="setup-resume-info">
                    <BsFileEarmarkArrowUp className="setup-resume-file-icon" />
                    <p className="setup-resume-name">{resumeFileName}</p>
                  </div>
                  <label className="setup-change-resume-btn">
                    Change
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleResumeUpload}
                      hidden
                    />
                  </label>
                </div>
              ) : (
                <label className="setup-upload-zone">
                  <BsFileEarmarkArrowUp className="setup-upload-icon" />
                  <p className="setup-upload-text">
                    {uploadingResume
                      ? 'Uploading...'
                      : 'Click to upload PDF resume'}
                  </p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleResumeUpload}
                    disabled={uploadingResume}
                    hidden
                  />
                </label>
              )}
            </div>
          </div>
        )}

        <div className="setup-device-limit-banner">
          <p className="setup-device-limit-text">
            Device interview attempts: {deviceAttempts}/{DEVICE_INTERVIEW_LIMIT}.{' '}
            {deviceAttempts >= DEVICE_INTERVIEW_LIMIT
              ? 'No more interviews can be started from this device.'
              : 'You can still start one more interview.'}
          </p>
        </div>

        <div className="setup-nav-buttons">
          {step > 1 && (
            <button className="setup-back-btn" onClick={handleBack}>
              Back
            </button>
          )}
          {step < 3 ? (
            <button className="setup-next-btn" onClick={handleNext}>
              Next
            </button>
          ) : (
            <button
              className={`setup-start-btn ${
                loading || !selectedRole || !resumeText || deviceAttempts >= DEVICE_INTERVIEW_LIMIT
                  ? 'setup-start-btn-disabled'
                  : ''
              }`}
              onClick={handleStartInterview}
              disabled={
                loading || !selectedRole || !resumeText || deviceAttempts >= DEVICE_INTERVIEW_LIMIT
              }
            >
              Start Interview
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default InterviewSetupPage;
