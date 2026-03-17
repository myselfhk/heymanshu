export default function SplitText({ text }) {
  return (
    <>
      {text.split('').map((char, i) => (
        <div
          key={i}
          className="target"
          style={{
            display: 'inline-block',
            whiteSpace: char === ' ' ? 'pre' : undefined,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </div>
      ))}
    </>
  )
}
