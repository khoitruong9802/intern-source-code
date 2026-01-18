import { forwardRef } from 'react';

const MessageBoard = forwardRef(
  (
    {
      block = {
        message: '',
        messageLength: 0,
        translatedMessage: '',
        fontFamily: 'Arial',
        isBold: false,
        isItalic: false,
        isUnderlined: false,
        fontSize: '16px',
        color: '#C9BA2B',
        backgroundColor: '#08172C',
        effect: '',
        translatedMesBefore: false,
      },
      isInfinite,
    },
    ref
  ) => {
    return (
      <div
        style={{
          width: '1050px',
          height: '70px',
          overflow: 'hidden',
          border: '1px gray solid',
          backgroundColor: block.backgroundColor,
          position: 'relative',
        }}
      >
        <p
          ref={ref}
          style={{
            height: '70px',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            fontFamily: block.fontFamily,
            fontSize: block.fontSize,
            fontWeight: block.isBold ? 'bold' : 'normal',
            fontStyle: block.isItalic ? 'italic' : 'normal',
            textDecoration: block.isUnderlined ? 'underline' : 'none',
            color: block.color,
            position: 'absolute',
            animation: `${block.effect} ${
              (block.messageLength + 1050) / 150
            }s linear 0s ${isInfinite ? 'infinite' : '1 normal forwards'}`,
          }}
        >
          {block.translatedMesBefore ? block.translatedMessage : block.message}
          <span className="ml-[1050px]">
            {block.translatedMesBefore
              ? block.message
              : block.translatedMessage}
          </span>
        </p>
      </div>
    );
  }
);

export default MessageBoard;
