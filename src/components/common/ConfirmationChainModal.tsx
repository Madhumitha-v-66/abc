import React, { useState } from 'react';
import { sounds } from '../../utils/sound';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationChainModalProps {
  isOpen: boolean;
  actionName: string;
  onClose: () => void;
}

export const ConfirmationChainModal: React.FC<ConfirmationChainModalProps> = ({
  isOpen,
  actionName,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [popupOffset, setPopupOffset] = useState({ x: 0, y: 0 });

  if (!isOpen) return null;

  const handleNextStep = () => {
    sounds.playDing();
    // Occasionally jolt/reposition the popup slightly
    setPopupOffset({
      x: (Math.random() - 0.5) * 30,
      y: (Math.random() - 0.5) * 20,
    });
    setCurrentStep(prev => prev + 1);
  };

  const handleEarlyCancel = () => {
    sounds.playBuzzer();
    setCurrentStep(6); // Jump straight to "Action successfully cancelled"
  };

  const handleFinalAcknowledge = () => {
    sounds.playBoing();
    setCurrentStep(1);
    setPopupOffset({ x: 0, y: 0 });
    onClose();
  };

  return (
    <div className="confirmation-chain-overlay">
      <div
        className="confirmation-chain-card"
        style={{
          transform: `translate(${popupOffset.x}px, ${popupOffset.y}px)`,
          transition: 'transform 0.15s ease',
        }}
      >
        <div className="chain-card-header">
          <div className="chain-header-left">
            <AlertTriangle size={20} color="#ffff00" className="alert-pulse" />
            <span className="font-pixel">DECISION CHECKPOINT {Math.min(currentStep, 5)} / 5</span>
          </div>
          <button
            type="button"
            className="chain-close-btn"
            onClick={handleEarlyCancel}
            title="Cancel confirmation"
          >
            <X size={16} />
          </button>
        </div>

        <div className="chain-card-body">
          {/* Step 1 */}
          {currentStep === 1 && (
            <div className="chain-step-content">
              <h2 className="chain-title">ARE YOU SURE?</h2>
              <p className="chain-body-text">
                You attempted to <b>{actionName.toUpperCase()}</b>. This action may have unpredictable
                synergistic consequences on your permanent record.
              </p>
              <div className="chain-actions-row">
                <button
                  type="button"
                  className="chain-btn chain-btn-sec"
                  onClick={handleEarlyCancel}
                >
                  NO, ABORT
                </button>
                <button
                  type="button"
                  className="chain-btn chain-btn-pri"
                  onClick={handleNextStep}
                >
                  YES, I WISH TO PROCEED
                </button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {currentStep === 2 && (
            <div className="chain-step-content">
              <h2 className="chain-title">ARE YOU REALLY SURE?</h2>
              <p className="chain-body-text">
                Your previous decision has been reviewed by the <b>SupergluedIn Decision Department™</b>.
                They reported 73% uncertainty. Are you really convinced?
              </p>
              <div className="chain-actions-row-swapped">
                <button
                  type="button"
                  className="chain-btn chain-btn-pri chain-btn-huge"
                  onClick={handleNextStep}
                >
                  DEFINITELY YES
                </button>
                <button
                  type="button"
                  className="chain-btn chain-btn-sec chain-btn-tiny"
                  onClick={handleEarlyCancel}
                >
                  I NEED TO THINK
                </button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {currentStep === 3 && (
            <div className="chain-step-content">
              <h2 className="chain-title">FINAL CONFIRMATION</h2>
              <p className="chain-body-text">
                Please confirm that you confirm your previous confirmation regarding <b>{actionName}</b>.
              </p>
              <div className="chain-actions-row">
                <button
                  type="button"
                  className="chain-btn chain-btn-pri"
                  onClick={handleNextStep}
                >
                  CONFIRM FINAL CONFIRMATION
                </button>
              </div>
            </div>
          )}

          {/* Step 4 */}
          {currentStep === 4 && (
            <div className="chain-step-content">
              <h2 className="chain-title">CONFIRM FINAL CONFIRMATION</h2>
              <p className="chain-body-text">
                Are you absolutely certain that you want to continue? We are giving you an opportunity to reconsider.
              </p>
              <div className="chain-actions-row">
                <button
                  type="button"
                  className="chain-btn chain-btn-pri"
                  onClick={handleNextStep}
                >
                  I AM 100% WILLING TO SUFFER
                </button>
              </div>
            </div>
          )}

          {/* Step 5 */}
          {currentStep === 5 && (
            <div className="chain-step-content">
              <h2 className="chain-title">LAST CHANCE TO CONFIRM YOUR PREVIOUS CONFIRMATION</h2>
              <p className="chain-body-text">
                This is the ultimate, non-negotiable confirmation of all confirmations. Click below to execute.
              </p>
              <div className="chain-actions-row">
                <button
                  type="button"
                  className="chain-btn chain-btn-pri chain-btn-pulsing"
                  onClick={handleNextStep}
                >
                  PROCEED TO THE BITTER END
                </button>
              </div>
            </div>
          )}

          {/* Step 6: THE RAGEBAIT CONCLUSION */}
          {currentStep === 6 && (
            <div className="chain-step-content chain-conclusion-box">
              <div className="skull-big">🤡🚫</div>
              <h2 className="chain-title-cancel">ACTION SUCCESSFULLY CANCELLED.</h2>
              <p className="chain-body-text">
                After comprehensive philosophical deliberation across 5 confirmation checkpoints, our
                system determined that you probably did not mean to <b>{actionName}</b>.
              </p>
              <button
                type="button"
                className="chain-btn chain-btn-pri"
                onClick={handleFinalAcknowledge}
              >
                OKAY, THANK YOU
              </button>
            </div>
          )}
        </div>

        <div className="chain-card-footer">
          <small>*Certified 100% genuine administrative impedance protocol.</small>
        </div>
      </div>
    </div>
  );
};
