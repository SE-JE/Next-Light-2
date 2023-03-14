// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { buttonProps } from './button.props';
import {
  buttonVariant,
  buttonContainer,
  buttonRadius,
} from './button.decorate';
import styles from './button.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function ButtonComponent({
  type,
  label,
  variant,
  paint,
  rounded,
  block,
  className,
  disabled,
  size,
  onClick,
  icon,
  loading,
  customPaint,
}: buttonProps) {
  return (
    <>
      <button
        type={type || 'button'}
        className={` 
          ${styles.button}
          ${buttonVariant[variant || 'solid'][paint || 'primary']}
          ${buttonContainer[size || 'md']}
          ${rounded ? 'rounded-full' : buttonRadius[size || 'md']}
          ${block && 'w-full justify-center'}
          ${customPaint?.color && `text-${customPaint.color}`}
          ${customPaint?.bg && `bg-${customPaint.bg}`}
          ${customPaint?.border && `border-${customPaint.border}`}
          ${className}
        `}
        disabled={disabled || loading}
        onClick={onClick}
      >
        {loading ? (
          <>
            <div
              className={`
                  ${styles.button__loading}
                  ${
                    size == 'sm'
                      ? 'w-3 h-3'
                      : size == 'lg'
                      ? 'w-5 h-5'
                      : 'w-4 h-4'
                  }
              `}
            ></div>
          </>
        ) : (
          <FontAwesomeIcon
            icon={icon}
            className={`
              ${
                size == 'xs'
                  ? 'text-xs'
                  : size == 'sm'
                  ? 'text-sm mb-0.5'
                  : size == 'lg'
                  ? 'text-xl mb-0.5'
                  : 'text-base mb-0.5'
              }
            `}
          />
        )}
        {label}
      </button>
    </>
  );
}
