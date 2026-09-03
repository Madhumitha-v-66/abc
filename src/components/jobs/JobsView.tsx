import React, { useState } from 'react';
import { Job } from '../../types';
import { useCaptcha } from '../../context/CaptchaContext';
import { usePopup } from '../../context/PopupContext';
import { sounds } from '../../utils/sound';
import { Briefcase, MapPin, DollarSign, Clock, Users, CheckCircle } from 'lucide-react';

const INITIAL_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Senior CAPTCHA Verification Engineer',
    company: 'Turing Defiance Inc.',
    location: 'Remote (Offshore Oil Rig)',
    salary: '73 Bananas / hour',
    postedAgo: '3 hours ago',
    applicants: 1420,
    description: 'We are seeking an elite engineer capable of identifying whether a sourdough baguette with plastic wheels qualifies as a commercial freight vehicle in under 3.2 seconds.',
    requirements: [
      'PhD in Identifying Crosswalks through blurry 240p photos',
      'Proven ability to solve Coffman deadlocks while being yelled at',
      '0% tolerance for reasonable UX conventions',
      'Must type backwards on on-screen keyboards with at least 80 WPM'
    ],
    applied: false,
  },
  {
    id: 'job-2',
    title: 'Keyboard Layout Optimization Intern',
    company: 'Entropy Dynamic Keyboards LLC',
    location: 'Hybrid (Basement)',
    salary: 'Unpaid (Compensated in Life Experience)',
    postedAgo: '1 day ago',
    applicants: 89,
    description: 'Your sole duty is to inject chaos into users keyboards every 7 seconds and display banners reading "KEYBOARD OPTIMIZED FOR YOUR CONVENIENCE".',
    requirements: [
      'Enthusiastic sadism regarding muscle memory',
      'Deep appreciation of Dvorak, Atbash, and alphabetical order',
      'Strong ability to ignore user complaints'
    ],
    applied: false,
  },
  {
    id: 'job-3',
    title: 'Professional Popup Closer (Contractor)',
    company: 'Urgent Lottery Associates',
    location: 'Worldwide / Cyber Void',
    salary: '₹4,72,819 (Conditional upon finding the close button)',
    postedAgo: '4 hours ago',
    applicants: 4210,
    description: 'Candidates must track down transparent 1px close buttons disguised as periods inside scam banners while 4 other popups spawn concurrently.',
    requirements: [
      'Visual acuity superior to birds of prey',
      'Reflexes fast enough to click evasive buttons that move 40px on hover',
      'Emotional stability when encountering 73% sad computers'
    ],
    applied: false,
  },
  {
    id: 'job-4',
    title: 'Chief Humanity Verification Specialist',
    company: 'Autonomous Simulation Bureau',
    location: 'Silicon Valley, CA (Simulation Room #4)',
    salary: '$180,000 / year + Free Coffee Beans',
    postedAgo: '6 hours ago',
    applicants: 312,
    description: 'Evaluate whether candidates are real living souls or LLMs imitating people who pretend to be productive on SupergluedIn.',
    requirements: [
      'Must have cried at least once during a quarterly OKR review',
      'Certified in gaslighting candidates who select 9 out of 10 vehicle images'
    ],
    applied: false,
  }
];

export const JobsView: React.FC = () => {
  const { requireCaptcha } = useCaptcha();
  const { showToast } = usePopup();
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [selectedJob, setSelectedJob] = useState<Job>(INITIAL_JOBS[0]);

  const handleApply = (job: Job) => {
    sounds.playDing();
    requireCaptcha(`Apply for "${job.title}"`, () => {
      setJobs(prev =>
        prev.map(j => (j.id === job.id ? { ...j, applied: true } : j))
      );
      if (selectedJob.id === job.id) {
        setSelectedJob(prev => ({ ...prev, applied: true }));
      }
      showToast(`📝 Application submitted for "${job.title}"! Good luck surviving the interview.`, 'info');
    });
  };

  return (
    <div className="jobs-view-container">
      <div className="jobs-top-banner">
        <h2>💼 DISRUPTIVE EMPLOYMENT OPPORTUNITIES</h2>
        <p>“Where your resume is scanned by AI, rejected by CAPTCHA, and filed under Spam.”</p>
      </div>

      <div className="jobs-split-pane">
        {/* Left list of jobs */}
        <div className="jobs-list-col">
          {jobs.map(job => (
            <div
              key={job.id}
              className={`job-card-item ${selectedJob.id === job.id ? 'job-selected' : ''}`}
              onClick={() => { sounds.playKeypress(); setSelectedJob(job); }}
            >
              <div className="job-card-top">
                <h4 className="job-title-h4">{job.title}</h4>
                <span className="job-time-tag">{job.postedAgo}</span>
              </div>
              <p className="job-company-name">{job.company}</p>
              <div className="job-badges-strip">
                <span className="job-badge"><MapPin size={12} /> {job.location}</span>
                <span className="job-badge"><DollarSign size={12} /> {job.salary}</span>
              </div>
              {job.applied && (
                <div className="job-applied-pill">
                  <CheckCircle size={14} /> APPLIED (PENDING VERIFICATION)
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Job Detail Card */}
        <div className="job-detail-col">
          <div className="job-detail-card">
            <h2 className="detail-title">{selectedJob.title}</h2>
            <h4 className="detail-company">{selectedJob.company} • {selectedJob.location}</h4>

            <div className="detail-meta-row">
              <span><Clock size={16} /> Posted {selectedJob.postedAgo}</span>
              <span>•</span>
              <span><Users size={16} /> {selectedJob.applicants} desperate applicants</span>
              <span>•</span>
              <span>💰 {selectedJob.salary}</span>
            </div>

            <div className="detail-action-row">
              {selectedJob.applied ? (
                <button className="applied-status-btn" disabled>
                  ✅ ALREADY APPLIED (CAPTCHA PASSED)
                </button>
              ) : (
                <button
                  className="apply-now-btn"
                  onClick={() => handleApply(selectedJob)}
                >
                  <Briefcase size={16} /> APPLY NOW (REQUIRES CAPTCHA)
                </button>
              )}
            </div>

            <div className="detail-body-section">
              <h3>JOB DESCRIPTION:</h3>
              <p>{selectedJob.description}</p>

              <h3>STRICT PREREQUISITES:</h3>
              <ul className="requirements-ul">
                {selectedJob.requirements.map((req, i) => (
                  <li key={i}>⚠️ {req}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
