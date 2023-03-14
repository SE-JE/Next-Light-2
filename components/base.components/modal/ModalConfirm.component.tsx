import React, { useEffect } from 'react';
import { modalConfirmProps } from './modal.props';
import styles from './modal.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from '../button';
import {
  modalConfirmContainer,
  modalConfirmIcon,
  modalConfirmIconContainer,
  modalConfirmTitle,
} from './modal.decorate';

export function ModalConfirmComponent({
  title,
  icon,
  show,
  onClose,
  children,
  tip,
  paint,
  onSubmit,
  submitButton,
}: modalConfirmProps) {
  useEffect(() => {
    if (show) {
      document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    } else {
      document.getElementsByTagName('body')[0].style.removeProperty('overflow');
    }
  }, [show]);

  return (
    <>
      <div
        className={` 
            ${styles.modal__background}
            ${show ? 'opacity-30' : 'scale-0 opacity-0'}
          `}
        onClick={() => onClose()}
      ></div>

      <div
        className={`
            ${modalConfirmContainer[paint || 'warning']}
            ${styles.modal__confirm}
            ${
              show
                ? 'top-[1rem] md:top-[15vh] opacity-1'
                : '-top-[110vh] opacity-0'
            }
        `}
      >
        <div className="p-4 flex flex-col items-center">
          <div
            className={`
              my-4 w-12 h-12 flex justify-center items-center rounded-full shadow-md
              ${modalConfirmIconContainer[paint || 'warning']}
            `}
          >
            <FontAwesomeIcon
              icon={icon || faQuestion}
              className={`
                text-xl
                ${modalConfirmIcon[paint || 'warning']}
              `}
            />
          </div>

          <div className="py-4 text-center">
            <div
              className={`
                text-lg font-semibold
                ${modalConfirmTitle[paint || 'warning']}
              `}
            >
              {title}
            </div>
            <div className="mt-1">{tip}</div>
          </div>

          {children}

          <div className="flex justify-center gap-4">
            <ButtonComponent
              label="Cancel"
              variant="simple"
              onClick={() => onClose()}
              customPaint={{
                color: 'slate-500',
              }}
            />
            <ButtonComponent
              {...submitButton}
              label={submitButton?.label || 'Yes'}
              paint={submitButton?.paint || paint || 'warning'}
              onClick={onSubmit}
            />
          </div>
        </div>
      </div>
    </>
  );
}
