const notes = [
  { char: '♪', left: '15%', bottom: '64px', duration: '6s', delay: '0s', size: '28px' },
  { char: '♫', left: '30%', bottom: '80px', duration: '7s', delay: '1.5s', size: '20px' },
  { char: '♪', left: '20%', bottom: '48px', duration: '8s', delay: '3s', size: '24px' },
  { char: '♩', left: '35%', bottom: '96px', duration: '6.5s', delay: '4.5s', size: '18px' },
  { char: '♬', left: '12%', bottom: '112px', duration: '7.5s', delay: '2s', size: '22px' },
];

function FloatingNotes() {
  return (
    <>
      {notes.map((note, i) => (
        <div
          key={i}
          className="floating-note"
          style={{
            left: note.left,
            bottom: note.bottom,
            fontSize: note.size,
            '--note-duration': note.duration,
            '--note-delay': note.delay,
          }}
        >
          {note.char}
        </div>
      ))}
    </>
  );
}

export default FloatingNotes;
