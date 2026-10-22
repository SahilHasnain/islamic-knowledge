type Props = { text: string };

const listMarker = /^(?:•|[-–] )\s*|^\(\d+\)\s*|^\d+[.)]\s*/;

function looksLikeVerse(lines: string[]) {
  return lines.length >= 2 && lines.length <= 8 &&
    lines.every((line) => line.length > 0 && line.length <= 58 && !/[.!?؛:]$/.test(line));
}

export default function FormattedText({ text }: Props) {
  const paragraphs = text.trim().split(/\n\s*\n+/).map((part) => part.trim()).filter(Boolean);

  return <div className="formatted-text">
    {paragraphs.map((paragraph, index) => {
      const lines = paragraph.split("\n").map((line) => line.trim()).filter(Boolean);
      const isList = lines.length > 0 && lines.every((line) => listMarker.test(line));

      if (isList) {
        return <ul className="reader-list" key={index}>{lines.map((line, lineIndex) => (
          <li key={lineIndex}>{line.replace(listMarker, "")}</li>
        ))}</ul>;
      }

      if (looksLikeVerse(lines)) {
        return <p className="reader-verse" key={index}>{lines.map((line, lineIndex) => (
          <span key={lineIndex}>{line}{lineIndex < lines.length - 1 && <br />}</span>
        ))}</p>;
      }

      const content = lines.join(" ").replace(/\s+/g, " ");
      const isCitation = /\([^\n()]{2,100}\)$/.test(content) && content.length < 130;
      return <p className={isCitation ? "reader-citation" : undefined} key={index}>{content}</p>;
    })}
  </div>;
}
