import React, { useState } from 'react';
import { sounds } from '../../utils/sound';

interface FakeCheckboxesProps {
  onAllValidChange?: (isValid: boolean) => void;
}

interface CheckboxItem {
  id: string;
  label: string;
  required: boolean;
  checked: boolean;
}

export const FakeCheckboxes: React.FC<FakeCheckboxesProps> = () => {
  const [items, setItems] = useState<CheckboxItem[]>([
    { id: 'cb1', label: 'I am human.', required: true, checked: true },
    { id: 'cb2', label: 'I confirm that I am probably human.', required: true, checked: false },
    { id: 'cb3', label: 'I understand this checkbox and its philosophical ramifications.', required: true, checked: true },
    { id: 'cb4', label: 'I did not accidentally click this checkbox while sneezing.', required: false, checked: false },
    { id: 'cb5', label: 'I accept something (unspecified, non-negotiable).', required: true, checked: false },
    { id: 'cb6', label: 'Remember me (Even if I wish to forget myself).', required: false, checked: true },
  ]);

  const handleToggle = (id: string) => {
    sounds.playKeypress();
    setItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          // If unchecking 'I am human', trigger buzzer
          if (item.id === 'cb1' && item.checked) {
            sounds.playBuzzer();
          }
          return { ...item, checked: !item.checked };
        }
        return item;
      })
    );
  };

  return (
    <div className="fake-checkboxes-container">
      <div className="checkboxes-header">
        LEGAL & BIOLOGICAL ACKNOWLEDGMENTS (MANDATORY):
      </div>

      <div className="checkboxes-list">
        {items.map(item => (
          <label key={item.id} className="checkbox-row-label">
            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => handleToggle(item.id)}
              className="cursed-checkbox-native"
            />
            <span className="checkbox-custom-mark">
              {item.checked ? '☑' : '☐'}
            </span>
            <span className="checkbox-text-content">
              {item.label}
              {item.required && <span className="req-asterisk">*</span>}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};
