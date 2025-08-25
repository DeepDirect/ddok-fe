import React, { useState, forwardRef } from 'react';

import { EyeIcon, EyeClosedIcon } from '@phosphor-icons/react';

import Input from '@/features/Auth/components/Input/Input';

type PasswordInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>;

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(({ ...props }, ref) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <Input
      ref={ref}
      type={isVisible ? 'text' : 'password'}
      icon={
        <button
          type="button"
          onClick={() => setIsVisible(!isVisible)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label={isVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
        >
          {isVisible ? <EyeIcon size={20} /> : <EyeClosedIcon size={20} />}
        </button>
      }
      {...props}
    />
  );
});

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
